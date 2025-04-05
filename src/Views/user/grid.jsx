import React from 'react';

/**
 * Cria uma configuração de grid para usuário
 * 
 * @param {Object} store - A store de usuários
 * @param {Object} options - Opções para customizar a grid
 * @param {Function} options.onAdd - Função chamada ao adicionar usuário
 * @param {Function} options.onEdit - Função chamada ao editar usuário
 * @param {Function} options.onDelete - Função chamada ao excluir usuário
 * @param {Function} options.onReload - Função chamada ao recarregar usuários
 * @returns {Object} Configuração da grid
 */
const createGridConfig = (store, options = {}) => {
  const {
    onAdd = () => console.log('Adicionar usuário'),
    onEdit = (record) => console.log('Editar usuário', record),
    onDelete = (record) => console.log('Excluir usuário', record),
    onReload = () => console.log('Recarregar usuários')
  } = options;

  return {
    xtype: 'grid',
    title: 'Lista de Usuários',
    store: store,
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
        onClick: onAdd
      },
      {
        type: 'reload',
        text: 'Atualizar',
        onClick: onReload
      }
    ],
    actions: [
      {
        type: 'edit',
        tooltip: 'Editar',
        onClick: onEdit
      },
      {
        type: 'delete',
        tooltip: 'Excluir',
        onClick: onDelete
      }
    ]
  };
};

export default createGridConfig; 