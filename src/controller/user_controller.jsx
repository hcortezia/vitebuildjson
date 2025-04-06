import { Store } from '../core/model-build';
import ControllerBuild from '../core/controller-build';
import userModel from '../models/user_model';

// Criação de uma store para o modelo
export const userStore = new Store({
  model: userModel,
  autoLoad: false,
  sorters: [
    { property: 'name', direction: 'ASC' }
  ]
});

// Criação de um controller para gerenciar a aplicação
const userController = new ControllerBuild({
  models: { user: userModel },
  stores: { users: userStore },
  actions: {
    // Ações do controller
    saveUser: async function(values) {
      console.log('saveUser', values);
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
      return user;
    },
    
    // Função para carregar todos os usuários
    loadUsers: function() {
      return this.getStore('users').load();
    },
    
    // Função para buscar um usuário específico
    getUser: async function(id) {
      try {
        return await this.getModel('user').get(id);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
      }
    }
  }
});

export default userController;
