import React from 'react';
import BaseBuild from '../components_build/BaseBuild';
import { ModelBuild, Store } from '../core/model-build';
import ControllerBuild from '../core/controller-build';

// Exemplo de definição de modelo com campos e validações
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
      name: 'type',
      type: 'select',
      label: 'Tipo',
      validators: [
        { type: 'required', message: 'O tipo é obrigatório' }
      ],
      config: {
        options: [
          { value: 'admin', label: 'Administrador' },
          { value: 'user', label: 'Usuário' }
        ]
      }
    },
    {
      name: 'active',
      type: 'boolean',
      label: 'Ativo'
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Data de Nascimento'
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

// Criação de uma store para o modelo
const userStore = new Store({
  model: userModel,
  autoLoad: false,
  sorters: [
    { property: 'name', direction: 'ASC' }
  ]
});

// Criação de um controller para gerenciar a aplicação
const userController = new ControllerBuild({
  models: {
    user: userModel
  },
  stores: {
    users: userStore
  },
  actions: {
    // Ações do controller
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
    },
    
    editUser: function(user) {
      // Aqui poderia redirecionar para uma tela de edição
      console.log('Editando usuário:', user);
    }
  }
});

// Exemplo de uso em um componente React
const UserManagement = () => {
  const [currentUser, setCurrentUser] = React.useState(null);
  
  // Configuração do formulário
  const formConfig = {
    xtype: 'form',
    title: 'Cadastro de Usuário',
    layout: 'vertical',
    model: userModel,
    items: [
      {
        xtype: 'input',
        name: 'name',
        label: 'Nome',
        validators: [
          { type: 'required', message: 'Nome é obrigatório' }
        ]
      },
      {
        xtype: 'input',
        name: 'email',
        label: 'E-mail',
        validators: [
          { type: 'required', message: 'E-mail é obrigatório' },
          { type: 'email', message: 'E-mail inválido' }
        ]
      },
      {
        xtype: 'select',
        name: 'type',
        label: 'Tipo',
        options: [
          { value: 'admin', label: 'Administrador' },
          { value: 'user', label: 'Usuário' }
        ]
      },
      {
        xtype: 'checkbox',
        name: 'active',
        label: 'Ativo'
      },
      {
        xtype: 'datepicker',
        name: 'birthDate',
        label: 'Data de Nascimento'
      }
    ],
    listeners: {
      afterLoad: (data) => {
        console.log('Dados carregados:', data);
      },
      afterSave: (data) => {
        console.log('Dados salvos:', data);
      }
    },
    buttons: [
      {
        text: 'Salvar',
        type: 'primary',
        htmlType: 'submit'
      },
      {
        text: 'Cancelar',
        htmlType: 'button',
        onClick: () => console.log('Cancelado')
      }
    ]
  };
  
  // Configuração da grid
  const gridConfig = {
    xtype: 'grid',
    title: 'Lista de Usuários',
    store: userStore,
    columns: [
      {
        dataIndex: 'name',
        title: 'Nome',
        sortable: true,
        filterable: true
      },
      {
        dataIndex: 'email',
        title: 'E-mail',
        sortable: true,
        filterable: true
      },
      {
        dataIndex: 'type',
        title: 'Tipo',
        sortable: true,
        render: (text) => text === 'admin' ? 'Administrador' : 'Usuário'
      },
      {
        dataIndex: 'active',
        title: 'Status',
        sortable: true,
        render: (value) => value ? 'Ativo' : 'Inativo'
      },
      {
        dataIndex: 'birthDate',
        title: 'Data de Nascimento',
        sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString() : ''
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
        text: 'Novo Usuário',
        onClick: () => setCurrentUser({})
      },
      {
        type: 'reload',
        text: 'Atualizar',
        onClick: () => userStore.load()
      }
    ],
    actions: [
      {
        type: 'edit',
        tooltip: 'Editar',
        onClick: (record) => {
          setCurrentUser(record);
          userController.dispatch('editUser', record);
        }
      },
      {
        type: 'delete',
        tooltip: 'Excluir',
        onClick: (record) => userController.dispatch('deleteUser', record)
      }
    ]
  };
  
  // Efeito para carregar dados ao montar o componente
  React.useEffect(() => {
    userStore.load();
  }, []);
  
  return (
    <div className="user-management">
      <div className="user-form">
        {currentUser && <BaseBuild json={formConfig} />}
      </div>
      <div className="user-grid">
        <BaseBuild json={gridConfig} />
      </div>
    </div>
  );
};

export default UserManagement;