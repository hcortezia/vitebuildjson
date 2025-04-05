# JSON to React Component Converter

Este projeto implementa um conversor de JSON para componentes React, seguindo uma arquitetura inspirada no ExtJS, mas utilizando React, Vite e Ant Design.

## Estrutura do Projeto

O projeto segue uma arquitetura MVC (Model-View-Controller) e é composto pelos seguintes elementos:

- **JSONToComponent**: Componente principal que converte configurações JSON em componentes React
- **ModelBuild**: Gerencia dados, validações e comunicação com o servidor
- **Store**: Gerencia coleções de dados, ordenação, filtragem e paginação
- **FormBuild**: Cria formulários dinâmicos a partir de configurações JSON
- **GridBuild**: Cria tabelas/grids dinâmicas a partir de configurações JSON
- **ControllerBuild**: Gerencia a lógica de negócios e a interação entre Model e View
- **Componentes de Entrada**: InputBuild, ButtonBuild, SelectBuild, DatePickerBuild, CheckboxBuild, RadioBuild, SwitchBuild, PanelBuild

## Instalação

```bash
npm install @seu-namespace/json-to-component
```

## Uso Básico

### Exemplo: Criação de um formulário simples

```jsx
import React from 'react';
import { JSONToComponent } from '@seu-namespace/json-to-component';

function MyForm() {
  const formConfig = {
    xtype: 'form',
    title: 'Formulário de Cadastro',
    items: [
      {
        xtype: 'input',
        label: 'Nome',
        name: 'name',
        validators: [
          { type: 'required', message: 'Nome é obrigatório' }
        ]
      },
      {
        xtype: 'input',
        label: 'Email',
        name: 'email',
        validators: [
          { type: 'required', message: 'Email é obrigatório' },
          { type: 'email', message: 'Email inválido' }
        ]
      },
      {
        xtype: 'button',
        text: 'Enviar',
        type: 'primary',
        htmlType: 'submit'
      }
    ],
    listeners: {
      onSubmit: (values) => {
        console.log('Valores do formulário:', values);
      }
    }
  };

  return <JSONToComponent json={formConfig} />;
}
```

### Exemplo: Criação de uma grid

```jsx
import React from 'react';
import { JSONToComponent, Store } from '@seu-namespace/json-to-component';

function MyGrid() {
  // Definir uma store para os dados
  const dataStore = new Store({
    proxy: {
      type: 'rest',
      url: '/api/data',
      reader: {
        root: 'data',
        totalProperty: 'total'
      }
    }
  });

  const gridConfig = {
    xtype: 'grid',
    title: 'Minha Grid',
    store: dataStore,
    columns: [
      {
        dataIndex: 'id',
        title: 'ID'
      },
      {
        dataIndex: 'name',
        title: 'Nome',
        sortable: true,
        filterable: true
      },
      {
        dataIndex: 'email',
        title: 'Email'
      }
    ],
    features: {
      pagination: true,
      filter: true,
      sort: true
    },
    toolbar: [
      {
        type: 'add',
        text: 'Adicionar',
        onClick: () => console.log('Adicionar novo registro')
      },
      {
        type: 'reload',
        text: 'Atualizar'
      }
    ],
    actions: [
      {
        type: 'edit',
        tooltip: 'Editar',
        onClick: (record) => console.log('Editar registro', record)
      },
      {
        type: 'delete',
        tooltip: 'Excluir',
        onClick: (record) => console.log('Excluir registro', record)
      }
    ]
  };

  return <JSONToComponent json={gridConfig} />;
}
```

### Criando um Modelo

```jsx
import { ModelBuild } from '@seu-namespace/json-to-component';

const userModel = new ModelBuild({
  name: 'User',
  fields: [
    {
      name: 'id',
      type: 'number'
    },
    {
      name: 'name',
      type: 'string',
      label: 'Nome',
      validators: [
        { type: 'required', message: 'O nome é obrigatório' }
      ]
    },
    {
      name: 'email',
      type: 'string',
      label: 'E-mail',
      validators: [
        { type: 'required', message: 'O e-mail é obrigatório' },
        { type: 'email', message: 'E-mail inválido' }
      ]
    },
    {
      name: 'active',
      type: 'boolean',
      label: 'Ativo'
    }
  ],
  proxy: {
    type: 'rest',
    url: '/api/users',
    reader: {
      root: 'data',
      totalProperty: 'total'
    }
  }
});
```

### Criando um Controller

```jsx
import { ControllerBuild } from '@seu-namespace/json-to-component';

const userController = new ControllerBuild({
  models: {
    user: userModel
  },
  stores: {
    users: userStore
  },
  actions: {
    saveUser: async function(values) {
      try {
        const user = await this.getModel('user').save(values);
        this.getStore('users').load();
        return user;
      } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw error;
      }
    },
    
    deleteUser: async function(user) {
      try {
        await this.getModel('user').destroy(user.id);
        this.getStore('users').load();
        return true;
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        throw error;
      }
    }
  }
});
```

## API detalhada

### JSONToComponent

O componente principal que converte configurações JSON em componentes React.

```jsx
<JSONToComponent json={configObject} />
```

Propriedades do `json`:
- `xtype`: O tipo de componente a ser renderizado ('form', 'grid', 'input', etc.)
- Outras propriedades específicas para cada xtype

### ModelBuild

Gerencia dados, validações e comunicação com o servidor.

```javascript
const model = new ModelBuild({
  name: 'ModelName',
  fields: [...],
  proxy: {...},
  idProperty: 'id',
  validators: [...],
  defaultValues: {...}
});
```

### Store

Gerencia coleções de dados, ordenação, filtragem e paginação.

```javascript
const store = new Store({
  model: modelInstance,
  data: [...],
  proxy: {...},
  autoLoad: false,
  sorters: [...],
  filters: [...]
});
```

### FormBuild

Cria formulários dinâmicos a partir de configurações JSON.

```jsx
<JSONToComponent json={{
  xtype: 'form',
  title: 'Título do Formulário',
  items: [...],
  layout: 'vertical',
  model: modelInstance,
  buttons: [...],
  listeners: {...}
}} />
```

### GridBuild

Cria tabelas/grids dinâmicas a partir de configurações JSON.

```jsx
<JSONToComponent json={{
  xtype: 'grid',
  title: 'Título da Grid',
  store: storeInstance,
  columns: [...],
  features: {...},
  toolbar: [...],
  actions: [...]
}} />
```

### Componentes de Entrada

Diversos componentes para entrada de dados, como InputBuild, ButtonBuild, SelectBuild, etc.

```jsx
<JSONToComponent json={{
  xtype: 'input',
  name: 'fieldName',
  label: 'Field Label',
  type: 'text',
  validators: [...]
}} />
```

## Listeners e Eventos

Todos os componentes suportam eventos através do objeto `listeners`. Exemplos de eventos comuns:

- FormBuild: `beforeSubmit`, `afterSubmit`, `beforeLoad`, `afterLoad`
- GridBuild: `beforeLoad`, `afterLoad`, `selectionChange`
- InputBuild: `change`, `focus`, `blur`

```jsx
{
  listeners: {
    beforeSubmit: (values) => {
      console.log('Antes de enviar:', values);
      return true; // continuar o envio
    },
    afterSubmit: (response) => {
      console.log('Após enviar:', response);
    }
  }
}
```

## Personalização

É possível estender os componentes existentes para adicionar novas funcionalidades ou comportamentos:

```jsx
// Exemplo de extensão do ModelBuild
class CustomModel extends ModelBuild {
  constructor(config) {
    super(config);
    
    // Adiciona funcionalidades personalizadas
    this.customFunction = () => {
      // Implementação personalizada
    };
  }
}
```

## Componentes Disponíveis

| xtype | Descrição |
|-------|-----------|
| form | Formulário dinâmico |
| grid | Tabela/grid dinâmica |
| input | Campo de entrada de texto |
| button | Botão |
| select | Campo de seleção |
| datepicker | Seletor de data |
| checkbox | Caixa de seleção |
| radio | Botão de opção |
| switch | Interruptor |
| panel | Painel para agrupar outros componentes |

## Licença

MIT