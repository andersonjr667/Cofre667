const jsonStore = require('../config/jsonStore');
const { v4: uuidv4 } = require('crypto');

class UserModel {
  // Criar novo usuário
  async create(userData) {
    try {
      const user = {
        id: this.generateId(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return jsonStore.addItem('users', user);
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  async findByEmail(email) {
    try {
      return jsonStore.findOne('users', user => user.email === email);
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  async findById(id) {
    try {
      return jsonStore.findById('users', id);
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os usuários
  async findAll() {
    try {
      return jsonStore.getTable('users');
    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  async update(id, updates) {
    try {
      updates.updatedAt = new Date().toISOString();
      return jsonStore.updateItem('users', id, updates);
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário
  async delete(id) {
    try {
      return jsonStore.deleteItem('users', id);
    } catch (error) {
      throw error;
    }
  }

  // Gerar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = new UserModel();
