import { ModelBuild, Store } from './model-build';

class ControllerBuild {
  constructor(config = {}) {
    const {
      models = {},
      stores = {},
      views = {},
      refs = {},
      routes = [],
      actions = {}
    } = config;
    
    this.models = this.initModels(models);
    this.stores = this.initStores(stores);
    this.views = views;
    this.refs = refs;
    this.routes = routes;
    this.actions = this.bindActions(actions);
    
    // Event listeners
    this.listeners = {};
    
    // Inicialização
    this.init();
  }
  
  // Inicializa os modelos
  initModels(modelConfigs) {
    const models = {};
    
    Object.keys(modelConfigs).forEach(key => {
      models[key] = new ModelBuild(modelConfigs[key]);
    });
    
    return models;
  }
  
  // Inicializa as stores
  initStores(storeConfigs) {
    const stores = {};
    
    Object.keys(storeConfigs).forEach(key => {
      const storeConfig = storeConfigs[key];
      
      // Se a configuração incluir um modelo por nome, substitui pela instância
      if (storeConfig.modelName && this.models[storeConfig.modelName]) {
        storeConfig.model = this.models[storeConfig.modelName];
        delete storeConfig.modelName;
      }
      
      stores[key] = new Store(storeConfig);
    });
    
    return stores;
  }
  
  // Vincula as ações ao contexto do controlador
  bindActions(actions) {
    const boundActions = {};
    
    Object.keys(actions).forEach(key => {
      boundActions[key] = actions[key].bind(this);
    });
    
    return boundActions;
  }
  
  // Inicialização do controlador
  init() {
    // Pode ser sobrescrito por classe derivada
  }
  
  // Adiciona um event listener
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    
    this.listeners[eventName].push(callback);
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
  
  // Executa uma ação por nome
  dispatch(actionName, ...args) {
    if (this.actions[actionName]) {
      return this.actions[actionName](...args);
    } else {
      console.error(`Ação '${actionName}' não encontrada`);
      return null;
    }
  }
  
  // Obtém uma referência para um componente da view
  getRef(refName) {
    return this.refs[refName];
  }
  
  // Registra uma referência a um componente da view
  setRef(refName, component) {
    this.refs[refName] = component;
    return this;
  }
  
  // Obtém um modelo por nome
  getModel(modelName) {
    return this.models[modelName];
  }
  
  // Obtém uma store por nome
  getStore(storeName) {
    return this.stores[storeName];
  }
  
  // Obtém uma view por nome
  getView(viewName) {
    return this.views[viewName];
  }
  
  // Cria handlers para eventos de formulário
  createFormHandlers(formName, options = {}) {
    const {
      modelName,
      storeName,
      afterSave,
      afterLoad,
      beforeSubmit
    } = options;
    
    const model = modelName ? this.getModel(modelName) : null;
    const store = storeName ? this.getStore(storeName) : null;
    
    return {
      onSubmit: async (values) => {
        try {
          // Trigger beforeSubmit callback
          if (beforeSubmit) {
            const shouldContinue = beforeSubmit(values);
            if (shouldContinue === false) return;
          }
          
          let savedData;
          
          if (model) {
            savedData = await model.save(values);
          }
          
          // Se tiver store associada, atualiza ou adiciona o registro
          if (store && savedData) {
            const idProperty = model ? model.idProperty : 'id';
            const recordId = savedData[idProperty];
            
            if (recordId) {
              // Verifica se o registro já existe na store
              const existingIndex = store.findIndex(idProperty, recordId);
              
              if (existingIndex !== -1) {
                store.update(savedData);
              } else {
                store.add(savedData);
              }
            }
          }
          
          // Trigger afterSave callback
          if (afterSave) {
            afterSave(savedData);
          }
          
          return savedData;
        } catch (error) {
          console.error(`Erro ao salvar formulário ${formName}:`, error);
          throw error;
        }
      },
      
      onLoad: async (params) => {
        try {
          let loadedData;
          
          if (model) {
            if (params && params.id) {
              loadedData = await model.loadById(params.id);
            } else {
              loadedData = model.create();
            }
          }
          
          // Trigger afterLoad callback
          if (afterLoad) {
            afterLoad(loadedData);
          }
          
          return loadedData;
        } catch (error) {
          console.error(`Erro ao carregar dados para o formulário ${formName}:`, error);
          throw error;
        }
      }
    };
  }
  
  // Cria handlers para eventos de grid
  createGridHandlers(gridName, options = {}) {
    const {
      storeName,
      modelName,
      afterLoad,
      afterDelete,
      afterEdit,
      afterAdd
    } = options;
    
    const store = storeName ? this.getStore(storeName) : null;
    const model = modelName ? this.getModel(modelName) : null;
    
    return {
      onLoad: async (params) => {
        try {
          if (!store) {
            throw new Error(`Store não encontrada para o grid ${gridName}`);
          }
          
          const result = await store.load(params);
          
          // Trigger afterLoad callback
          if (afterLoad) {
            afterLoad(result);
          }
          
          return result;
        } catch (error) {
          console.error(`Erro ao carregar dados para o grid ${gridName}:`, error);
          throw error;
        }
      },
      
      onDelete: async (record) => {
        try {
          if (!store) {
            throw new Error(`Store não encontrada para o grid ${gridName}`);
          }
          
          const idProperty = model ? model.idProperty : 'id';
          const recordId = record[idProperty];
          
          if (!recordId) {
            throw new Error('Registro não tem ID definido');
          }
          
          // Se tiver modelo, usa ele para excluir no servidor
          if (model) {
            await model.destroy(recordId);
          }
          
          // Remove da store
          store.remove(record);
          
          // Trigger afterDelete callback
          if (afterDelete) {
            afterDelete(record);
          }
          
          return true;
        } catch (error) {
          console.error(`Erro ao excluir registro do grid ${gridName}:`, error);
          throw error;
        }
      },
      
      onEdit: (record) => {
        try {
          // Trigger afterEdit callback
          if (afterEdit) {
            afterEdit(record);
          }
          
          return record;
        } catch (error) {
          console.error(`Erro ao editar registro do grid ${gridName}:`, error);
          throw error;
        }
      },
      
      onAdd: () => {
        try {
          // Cria um novo registro vazio
          const newRecord = model ? model.create() : {};
          
          // Trigger afterAdd callback
          if (afterAdd) {
            afterAdd(newRecord);
          }
          
          return newRecord;
        } catch (error) {
          console.error(`Erro ao adicionar registro ao grid ${gridName}:`, error);
          throw error;
        }
      }
    };
  }
  
  // Configuração para crie um componente de forma a partir de um modelo
  createFormConfig(modelName, options = {}) {
    const model = this.getModel(modelName);
    
    if (!model) {
      throw new Error(`Modelo '${modelName}' não encontrado`);
    }
    
    const {
      title,
      layout = 'vertical',
      width,
      buttons = [],
      extraItems = [],
      exclude = []
    } = options;
    
    // Converte campos do modelo em itens do formulário
    const items = model.fields
      .filter(field => !exclude.includes(field.name))
      .map(field => {
        const {
          name,
          type = 'string',
          label = name,
          required = false,
          validators = []
        } = field;
        
        // Mapeia tipos de campo para xtypes
        let xtype;
        switch (type) {
          case 'string':
            xtype = 'input';
            break;
          case 'number':
            xtype = 'input';
            break;
          case 'boolean':
            xtype = 'checkbox';
            break;
          case 'date':
            xtype = 'datepicker';
            break;
          case 'select':
            xtype = 'select';
            break;
          default:
            xtype = 'input';
        }
        
        // Se o campo for obrigatório, adiciona validador
        const fieldValidators = [...validators];
        if (required && !validators.some(v => v.type === 'required')) {
          fieldValidators.push({
            type: 'required',
            message: `O campo ${label} é obrigatório`
          });
        }
        
        return {
          xtype,
          name,
          label,
          validators: fieldValidators,
          ...field.config // Configurações adicionais específicas do campo
        };
      });
    
    // Adiciona itens extras
    const allItems = [...items, ...extraItems];
    
    // Configuração do formulário
    return {
      xtype: 'form',
      title,
      layout,
      width,
      model,
      items: allItems,
      buttons
    };
  }
  
  // Cria uma configuração de grid a partir de um modelo
  createGridConfig(modelName, options = {}) {
    const model = this.getModel(modelName);
    
    if (!model) {
      throw new Error(`Modelo '${modelName}' não encontrado`);
    }
    
    const store = options.storeName ? this.getStore(options.storeName) : null;
    
    const {
      title,
      features = {},
      toolbar = [],
      actions = [],
      extraColumns = [],
      exclude = []
    } = options;
    
    // Converte campos do modelo em colunas do grid
    const columns = model.fields
      .filter(field => !exclude.includes(field.name))
      .map(field => {
        const {
          name,
          type = 'string',
          label = name,
          hidden = false,
          sortable = true,
          filterable = true,
          width,
          render
        } = field;
        
        return {
          dataIndex: name,
          title: label,
          type,
          sortable,
          filterable,
          hidden,
          width,
          render
        };
      });
    
    // Adiciona colunas extras
    const allColumns = [...columns, ...extraColumns];
    
    // Configuração do grid
    return {
      xtype: 'grid',
      title,
      store: store || null,
      columns: allColumns,
      features,
      toolbar,
      actions
    };
  }
}

export default ControllerBuild;