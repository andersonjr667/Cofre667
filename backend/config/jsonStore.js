const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('./db');
let cryptoHelper;
try {
  cryptoHelper = require('../utils/crypto');
} catch (e) {
  // if crypto helper is missing, keep running but data will be written in plain JSON
  cryptoHelper = null;
}

class JsonStore {
  constructor() {
    this.dbPath = DB_PATH;
    this.initializeDatabase();
  }

  // Inicializa o banco de dados se não existir
  initializeDatabase() {
    try {
      if (!fs.existsSync(this.dbPath)) {
        const initialData = {
          users: [],
          debtors: [],
          transactions: [],
          investments: [],
          settings: {},
          debtHistory: []
        };
        const payload = JSON.stringify(initialData, null, 2);
        if (cryptoHelper && cryptoHelper.isEncryptionEnabled()) {
          const encrypted = cryptoHelper.encrypt(payload);
          fs.writeFileSync(this.dbPath, encrypted, 'utf8');
        } else {
          fs.writeFileSync(this.dbPath, payload, 'utf8');
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  // Lê o banco de dados
  read() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      // try plain JSON first
      try {
        return JSON.parse(data);
      } catch (e) {
        // not plain JSON -> try decrypt if available
        if (cryptoHelper && cryptoHelper.isEncryptionEnabled()) {
          try {
            const decrypted = cryptoHelper.decrypt(data);
            return JSON.parse(decrypted);
          } catch (de) {
            console.error('Erro ao descriptografar banco de dados:', de);
            throw de;
          }
        }
        throw e;
      }
    } catch (error) {
      console.error('Erro ao ler banco de dados:', error);
      throw error;
    }
  }

  // Escreve no banco de dados (operação atômica)
  write(data) {
    try {
      const tempPath = `${this.dbPath}.tmp`;
      const payload = JSON.stringify(data, null, 2);
      if (cryptoHelper && cryptoHelper.isEncryptionEnabled()) {
        const encrypted = cryptoHelper.encrypt(payload);
        fs.writeFileSync(tempPath, encrypted, 'utf8');
      } else {
        fs.writeFileSync(tempPath, payload, 'utf8');
      }
      fs.renameSync(tempPath, this.dbPath);
      return true;
    } catch (error) {
      console.error('Erro ao escrever no banco de dados:', error);
      throw error;
    }
  }

  // Obtém uma tabela específica
  getTable(tableName) {
    const data = this.read();
    return data[tableName] || [];
  }

  // Atualiza uma tabela específica
  updateTable(tableName, tableData) {
    const data = this.read();
    data[tableName] = tableData;
    return this.write(data);
  }

  // Adiciona um item a uma tabela
  addItem(tableName, item) {
    const data = this.read();
    if (!data[tableName]) {
      data[tableName] = [];
    }
    data[tableName].push(item);
    this.write(data);
    return item;
  }

  // Atualiza um item em uma tabela
  updateItem(tableName, id, updates) {
    const data = this.read();
    const index = data[tableName].findIndex(item => item.id === id);
    if (index !== -1) {
      data[tableName][index] = { ...data[tableName][index], ...updates };
      this.write(data);
      return data[tableName][index];
    }
    return null;
  }

  // Remove um item de uma tabela
  deleteItem(tableName, id) {
    const data = this.read();
    const index = data[tableName].findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = data[tableName].splice(index, 1)[0];
      this.write(data);
      return deleted;
    }
    return null;
  }

  // Busca um item por ID
  findById(tableName, id) {
    const table = this.getTable(tableName);
    return table.find(item => item.id === id);
  }

  // Busca um item por condição
  findOne(tableName, condition) {
    const table = this.getTable(tableName);
    return table.find(condition);
  }

  // Busca todos os itens que atendem uma condição
  findAll(tableName, condition) {
    const table = this.getTable(tableName);
    if (condition) {
      return table.filter(condition);
    }
    return table;
  }
}

module.exports = new JsonStore();
