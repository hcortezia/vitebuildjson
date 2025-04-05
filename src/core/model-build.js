import axios from 'axios';

class ModelBuild {
  constructor(config = {}) {
    const {
      fields = [],
      name,
      proxy,
      idProperty = 'id',
      associations = [],
      validators = [],
      defaultValues = {}
    } = config;
    
    this.fields = fields;
    this.name = name;
    this.proxy = this.configureProxy(proxy);
    this.idProperty = idProperty;
    this.associations = associations;
    this.validators = validators;
    this.defaultValues = defaultValues;
    this.data = null;
    
    // Event listeners
    this.listeners = {
      beforeLoad: [],
      afterLoad: [],
      beforeSave: [],
      afterSave: [],
      beforeDestroy: [],
      afterDestroy: [],
      validationFail: [],
      error: []
    };
  }
  
  // Configura o proxy para comunicação com o servidor
  configureProxy(proxyConfig) {
    if (!proxyConfig) {
      return null;
    }
    
    const { type, url, headers = {}, timeout = 30000, withCredentials = false } = proxyConfig;
    
    // Cria uma instância do Axios
    const instance = axios.create({
      baseURL: url,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      withCredentials
    });
    
    // Adiciona interceptors se necessário
    if (proxyConfig.requestInterceptor) {
      instance.interceptors.request.use(
        proxyConfig.requestInterceptor,
        error => Promise.reject(error)
      );
    }
    
    if (proxyConfig.responseInterceptor) {
      instance.interceptors.response.use(
        proxyConfig.responseInterceptor,
        error => Promise.reject(error)
      );
    }
    
    return {
      type: type || 'rest',
      instance,
      reader: proxyConfig.reader || {
        root: 'data',
        totalProperty: 'total'
      },
      writer: proxyConfig.writer || {}
    };
  }
  
  // Adiciona um evento listener
  on(eventName, callback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].push(callback);
    }
    return this;
  }
  
  // Remove um evento listener
  un(eventName, callback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    }
    return this;
  }
  
  // Dispara um evento
  fireEvent(eventName, ...args) {
    if (this.listeners[eventName]) {
      for (const callback of this.listeners[eventName]) {
        callback(...args);
      }
    }
  }
  
  // Valida um objeto de dados
  validate(data) {
    const errors = {};
    let isValid = true;
    
    // Verifica validações a nível de campo
    this.fields.forEach(field => {
      const { name, validators = [] } = field;
      
      if (validators.length > 0) {
        const fieldValue = data[name];
        
        for (const validator of validators) {
          const { type, message, fn } = validator;
          
          // Validador de campo requerido
          if (type === 'required' && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
            errors[name] = message || `O campo ${name} é obrigatório`;
            isValid = false;
            break;
          }
          
          // Validador de e-mail
          if (type === 'email' && fieldValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
            errors[name] = message || `O campo ${name} deve ser um e-mail válido`;
            isValid = false;
            break;
          }
          
          // Validador de comprimento
          if (type === 'length' && fieldValue && fieldValue.length !== validator.len) {
            errors[name] = message || `O campo ${name} deve ter exatamente ${validator.len} caracteres`;
            isValid = false;
            break;
          }
          
          // Validador de valor mínimo
          if (type === 'min' && fieldValue !== undefined && fieldValue < validator.min) {
            errors[name] = message || `O campo ${name} deve ser maior ou igual a ${validator.min}`;
            isValid = false;
            break;
          }
          
          // Validador de valor máximo
          if (type === 'max' && fieldValue !== undefined && fieldValue > validator.max) {
            errors[name] = message || `O campo ${name} deve ser menor ou igual a ${validator.max}`;
            isValid = false;
            break;
          }
          
          // Validador personalizado
          if (type === 'custom' && fn && !fn(fieldValue, data)) {
            errors[name] = message || `O campo ${name} é inválido`;
            isValid = false;
            break;
          }
        }
      }
    });
    
    // Validações a nível de modelo
    for (const validator of this.validators) {
      const { fn, message } = validator;
      
      if (!fn(data)) {
        errors._model = message || 'Dados inválidos';
        isValid = false;
        break;
      }
    }
    
    if (!isValid) {
      this.fireEvent('validationFail', errors);
    }
    
    return { isValid, errors };
  }
  
  // Cria um novo registro com valores padrão
  create() {
    return { ...this.defaultValues };
  }
  
  // Carrega dados do modelo
  async load(params = {}) {
    if (!this.proxy) {
      throw new Error('Proxy não configurado para o modelo');
    }
    
    this.fireEvent('beforeLoad', params);
    
    try {
      const response = await this.proxy.instance.get('', { params });
      
      // Processa os dados com o reader
      const reader = this.proxy.reader;
      const responseData = response.data;
      
      const data = reader.root ? responseData[reader.root] : responseData;
      const total = reader.totalProperty ? responseData[reader.totalProperty] : (Array.isArray(data) ? data.length : 1);
      
      this.data = data;
      
      const result = { data, total, raw: responseData };
      this.fireEvent('afterLoad', result);
      
      return result;
    } catch (error) {
      this.fireEvent('error', error);
      throw error;
    }
  }
  
  // Carrega um registro específico pelo ID
  async loadById(id) {
    if (!this.proxy) {
      throw new Error('Proxy não configurado para o modelo');
    }
    
    this.fireEvent('beforeLoad', { id });
    
    try {
      const response = await this.proxy.instance.get(`/${id}`);
      
      // Processa os dados com o reader
      const reader = this.proxy.reader;
      const responseData = response.data;
      
      const data = reader.root ? responseData[reader.root] : responseData;
      this.data = data;
      
      this.fireEvent('afterLoad', data);
      
      return data;
    } catch (error) {
      this.fireEvent('error', error);
      throw error;
    }
  }
  
  // Salva (cria ou atualiza) um registro
  async save(data) {
    if (!this.proxy) {
      throw new Error('Proxy não configurado para o modelo');
    }
    
    // Valida os dados antes de salvar
    const { isValid, errors } = this.validate(data);
    if (!isValid) {
      return Promise.reject(errors);
    }
    
    this.fireEvent('beforeSave', data);
    
    try {
      let response;
      const id = data[this.idProperty];
      
      // Formata os dados para o servidor usando o writer se necessário
      const writer = this.proxy.writer;
      const dataToSend = writer.root ? { [writer.root]: data } : data;
      
      // Se tiver ID, atualiza; se não, cria
      if (id) {
        response = await this.proxy.instance.put(`/${id}`, dataToSend);
      } else {
        response = await this.proxy.instance.post('', dataToSend);
      }
      
      // Processa a resposta
      const responseData = response.data;
      const savedData = writer.root ? responseData[writer.root] : responseData;
      
      this.data = savedData;
      this.fireEvent('afterSave', savedData);
      
      return savedData;
    } catch (error) {
      this.fireEvent('error', error);
      throw error;
    }
  }
  
  // Remove um registro
  async destroy(id) {
    if (!this.proxy) {
      throw new Error('Proxy não configurado para o modelo');
    }
    
    id = id || (this.data ? this.data[this.idProperty] : null);
    
    if (!id) {
      throw new Error('ID não especificado para remoção');
    }
    
    this.fireEvent('beforeDestroy', id);
    
    try {
      const response = await this.proxy.instance.delete(`/${id}`);
      this.data = null;
      
      this.fireEvent('afterDestroy', id, response.data);
      
      return response.data;
    } catch (error) {
      this.fireEvent('error', error);
      throw error;
    }
  }
  
  // Processo de associações (hasMany, belongsTo, etc)
  processAssociations(data) {
    if (!data || !this.associations.length) {
      return data;
    }
    
    const result = { ...data };
    
    for (const association of this.associations) {
      const { type, name, model, foreignKey, primaryKey = this.idProperty } = association;
      
      if (type === 'hasMany' && Array.isArray(data[name])) {
        // Processa associações do tipo hasMany
        result[name] = data[name].map(item => {
          if (model) {
            // Se tiver um modelo associado, pode processar com ele
            // Aqui você poderia instanciar o modelo e processar os dados
            return item;
          }
          return item;
        });
      } else if (type === 'belongsTo' && data[foreignKey]) {
        // Processa associações do tipo belongsTo
        // Pode carregar o objeto relacionado se necessário
      } else if (type === 'hasOne' && data[name]) {
        // Processa associações do tipo hasOne
      }
    }
    
    return result;
  }
  
  // Converte o objeto de dados para o formato adequado ao formulário
  toForm() {
    return this.data || this.create();
  }
  
  // Cria uma instância do modelo com dados
  static create(config, data) {
    const model = new ModelBuild(config);
    model.data = data;
    return model;
  }
}

// Store para gerenciar coleções de dados
class Store {
  constructor(config = {}) {
    const {
      model,
      autoLoad = false,
      data = [],
      proxy,
      pageSize = 25,
      remoteSort = true,
      remoteFilter = true,
      sorters = [],
      filters = [],
      groupers = []
    } = config;
    
    this.model = model;
    this.proxy = proxy || (model ? model.proxy : null);
    this.data = data;
    this.pageSize = pageSize;
    this.remoteSort = remoteSort;
    this.remoteFilter = remoteFilter;
    this.sorters = sorters;
    this.filters = filters;
    this.groupers = groupers;
    this.total = 0;
    this.loading = false;
    this.currentPage = 1;
    
    // Event listeners
    this.listeners = {
      beforeLoad: [],
      load: [],
      loadError: [],
      beforeAdd: [],
      add: [],
      beforeRemove: [],
      remove: [],
      update: [],
      dataChanged: []
    };
    
    if (autoLoad) {
      this.load();
    }
  }
  
  // Adiciona um event listener
  on(eventName, callback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].push(callback);
    }
    return this;
  }
  
  // Remove um event listener
  un(eventName, callback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    }
    return this;
  }
  
  // Dispara um evento
  fireEvent(eventName, ...args) {
    if (this.listeners[eventName]) {
      for (const callback of this.listeners[eventName]) {
        callback(...args);
      }
    }
  }
  
  // Carrega dados da store
  async load(params = {}) {
    this.loading = true;
    this.fireEvent('beforeLoad', params);
    
    try {
      // Monta os parâmetros da requisição
      const requestParams = {
        page: params.page || this.currentPage,
        limit: params.pageSize || this.pageSize,
        ...params
      };
      
      // Adiciona ordenação se existir
      if (this.sorters.length > 0 && this.remoteSort) {
        requestParams.sort = this.sorters.map(sorter => ({
          property: sorter.property,
          direction: sorter.direction
        }));
      }
      
      // Adiciona filtros se existirem
      if (this.filters.length > 0 && this.remoteFilter) {
        requestParams.filter = this.filters;
      }
      
      let response;
      
      // Se tiver um proxy configurado, usa ele para carregar os dados
      if (this.proxy) {
        response = await this.proxy.instance.get('', { params: requestParams });
        
        // Extrai os dados e total da resposta usando o reader configurado
        const reader = this.proxy.reader;
        const responseData = response.data;
        
        this.data = reader.root ? responseData[reader.root] : responseData;
        this.total = reader.totalProperty ? responseData[reader.totalProperty] : this.data.length;
        this.currentPage = params.page || this.currentPage;
      } 
      // Se não tiver proxy, mas tiver um modelo com proxy, usa ele
      else if (this.model && this.model.proxy) {
        const result = await this.model.load(requestParams);
        this.data = result.data;
        this.total = result.total;
        this.currentPage = params.page || this.currentPage;
        response = result.raw;
      }
      // Se não tiver proxy nem modelo com proxy, mas tiver dados locais
      else if (this.data.length > 0) {
        // Processar dados locais (ordenação, filtro, paginação)
        let processedData = [...this.data];
        
        // Aplicar filtros locais
        if (this.filters.length > 0) {
          processedData = this.applyFilters(processedData);
        }
        
        // Aplicar ordenação local
        if (this.sorters.length > 0) {
          processedData = this.applySorters(processedData);
        }
        
        // Aplicar paginação local
        const startIndex = (requestParams.page - 1) * requestParams.limit;
        const endIndex = startIndex + requestParams.limit;
        
        this.total = processedData.length;
        this.data = processedData.slice(startIndex, endIndex);
        this.currentPage = params.page || this.currentPage;
        
        response = { data: this.data, total: this.total };
      } else {
        throw new Error('Nenhuma fonte de dados configurada para a Store');
      }
      
      this.loading = false;
      this.fireEvent('load', this.data, this.total, response);
      
      return { data: this.data, total: this.total, raw: response };
    } catch (error) {
      this.loading = false;
      this.fireEvent('loadError', error);
      throw error;
    }
  }
  
  // Aplica filtros aos dados locais
  applyFilters(data) {
    return data.filter(item => {
      return this.filters.every(filter => {
        const { property, value, operator = '=', fn } = filter;
        
        // Se tiver uma função de filtro customizada
        if (fn && typeof fn === 'function') {
          return fn(item);
        }
        
        const itemValue = item[property];
        
        // Operadores de comparação
        switch (operator) {
          case '=':
            return itemValue === value;
          case '>':
            return itemValue > value;
          case '>=':
            return itemValue >= value;
          case '<':
            return itemValue < value;
          case '<=':
            return itemValue <= value;
          case '!=':
            return itemValue !== value;
          case 'like':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'in':
            return Array.isArray(value) && value.includes(itemValue);
          default:
            return true;
        }
      });
    });
  }
  
  // Aplica ordenação aos dados locais
  applySorters(data) {
    return [...data].sort((a, b) => {
      for (const sorter of this.sorters) {
        const { property, direction = 'ASC' } = sorter;
        
        const valueA = a[property];
        const valueB = b[property];
        
        // Skip undefined values
        if (valueA === undefined || valueB === undefined) {
          continue;
        }
        
        // Comparação baseada no tipo de dados
        let comparison;
        
        if (typeof valueA === 'string') {
          comparison = valueA.localeCompare(valueB);
        } else {
          comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        }
        
        // Aplica a direção da ordenação
        if (comparison !== 0) {
          return direction.toUpperCase() === 'ASC' ? comparison : -comparison;
        }
      }
      
      return 0;
    });
  }
  
  // Adiciona um registro à store
  add(records) {
    if (!Array.isArray(records)) {
      records = [records];
    }
    
    this.fireEvent('beforeAdd', records);
    
    const newData = [...this.data, ...records];
    this.data = newData;
    this.total = this.total + records.length;
    
    this.fireEvent('add', records);
    this.fireEvent('dataChanged', this.data);
    
    return records;
  }
  
  // Remove registros da store
  remove(records) {
    if (!Array.isArray(records)) {
      records = [records];
    }
    
    this.fireEvent('beforeRemove', records);
    
    const idsToRemove = records.map(record => {
      return typeof record === 'object' ? record[this.model?.idProperty || 'id'] : record;
    });
    
    const newData = this.data.filter(item => {
      const itemId = item[this.model?.idProperty || 'id'];
      return !idsToRemove.includes(itemId);
    });
    
    const removedCount = this.data.length - newData.length;
    this.data = newData;
    this.total = this.total - removedCount;
    
    this.fireEvent('remove', records);
    this.fireEvent('dataChanged', this.data);
    
    return records;
  }
  
  // Atualiza registros na store
  update(records) {
    if (!Array.isArray(records)) {
      records = [records];
    }
    
    const updatedRecords = [];
    const idProperty = this.model?.idProperty || 'id';
    
    const newData = [...this.data];
    
    for (const record of records) {
      const id = record[idProperty];
      const index = newData.findIndex(item => item[idProperty] === id);
      
      if (index !== -1) {
        newData[index] = { ...newData[index], ...record };
        updatedRecords.push(newData[index]);
      }
    }
    
    if (updatedRecords.length > 0) {
      this.data = newData;
      this.fireEvent('update', updatedRecords);
      this.fireEvent('dataChanged', this.data);
    }
    
    return updatedRecords;
  }
  
  // Encontra um registro baseado em critérios
  find(property, value) {
    return this.data.find(item => item[property] === value);
  }
  
  // Encontra o índice de um registro baseado em critérios
  findIndex(property, value) {
    return this.data.findIndex(item => item[property] === value);
  }
  
  // Limpa todos os dados da store
  clear() {
    this.data = [];
    this.total = 0;
    this.fireEvent('dataChanged', this.data);
    return this;
  }
  
  // Adiciona um filtro
  addFilter(filter) {
    this.filters.push(filter);
    return this;
  }
  
  // Remove um filtro
  removeFilter(property) {
    this.filters = this.filters.filter(filter => filter.property !== property);
    return this;
  }
  
  // Limpa todos os filtros
  clearFilters() {
    this.filters = [];
    return this;
  }
  
  // Adiciona uma ordenação
  addSorter(sorter) {
    this.sorters.push(sorter);
    return this;
  }
  
  // Remove uma ordenação
  removeSorter(property) {
    this.sorters = this.sorters.filter(sorter => sorter.property !== property);
    return this;
  }
  
  // Limpa todas as ordenações
  clearSorters() {
    this.sorters = [];
    return this;
  }
  
  // Retorna os dados formatados para um grid
  toGrid() {
    return {
      data: this.data,
      total: this.total
    };
  }
  
  // Cria uma instância da store com dados
  static create(config, data) {
    const store = new Store(config);
    
    if (data) {
      store.data = data;
      store.total = data.length;
    }
    
    return store;
  }
}

export { ModelBuild, Store };