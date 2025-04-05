import React from 'react';
import BaseBuild from '../components_build/BaseBuild';
// Importando configurações de componentes
import createFormConfig from '../Views/user/form';
import createGridConfig from '../Views/user/grid';
// Importando o modelo de usuário
import userModel from '../models/user';
// Importando o controller e store
import userController, { userStore } from '../controller/user_controller';

// Componente principal de gerenciamento de usuários
const UserManagement = () => {
  const [currentUser, setCurrentUser] = React.useState(null);
  
  // Handlers para o formulário
  const handleSave = (data) => {
    userController.dispatch('saveUser', data);
    setCurrentUser(null);
  };
  
  const handleCancel = () => {
    setCurrentUser(null);
  };
  
  // Handlers para a grid
  const handleAdd = () => {
    setCurrentUser({});
  };
  
  const handleEdit = (record) => {
    setCurrentUser(record);
    userController.dispatch('editUser', record);
  };
  
  const handleDelete = (record) => {
    userController.dispatch('deleteUser', record);
  };
  
  const handleReload = () => {
    userController.dispatch('loadUsers');
  };
  
  // Criando o formConfig usando a função importada com opções personalizadas
  const formConfig = createFormConfig(userModel, {
    title: currentUser?.id ? 'Editar Usuário' : 'Novo Usuário',
    onSave: handleSave,
    onCancel: handleCancel
  });
  
  // Criando o gridConfig usando a função importada
  const gridConfig = createGridConfig(userStore, {
    onAdd: handleAdd,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onReload: handleReload
  });
  
  // Efeito para carregar dados ao montar o componente
  React.useEffect(() => {
    userController.dispatch('loadUsers');
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