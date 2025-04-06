import React, { useState, useEffect } from 'react';
import BaseBuild from '../../components_build/BaseBuild';
import createFormConfig from './form';
import createGridConfig from './grid';
import userController, { userStore } from '../../controller/user_controller';

const UserView = () => {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Handlers
  const handleSave = (data) => {
    userController.dispatch('saveUser', data);
    setCurrentUser(null);
  };
  
  const handleCancel = () => setCurrentUser(null);
  const handleAdd = () => setCurrentUser({});
  const handleEdit = (record) => {
    setCurrentUser(record);
    userController.dispatch('editUser', record);
  };
  
  const handleDelete = (record) => {
    userController.dispatch('deleteUser', record);
  };
  
  const handleReload = () => userController.dispatch('loadUsers');
  
  // Configurações
  const formConfig = createFormConfig(userController.getModel('user'), {
    title: currentUser?.id ? 'Editar Usuário' : 'Novo Usuário',
    onSave: handleSave,
    onCancel: handleCancel
  });
  
  const gridConfig = createGridConfig(userStore, {
    onAdd: handleAdd,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onReload: handleReload
  });
  
  useEffect(() => {
    userController.dispatch('loadUsers');
  }, []);
  
  return (
    <div className="user-management">
      {currentUser && <BaseBuild json={formConfig} />}
      <BaseBuild json={gridConfig} />
    </div>
  );
};

export default UserView;