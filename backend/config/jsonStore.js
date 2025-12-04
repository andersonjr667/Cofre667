const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('./db');

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
        fs.writeFileSync(this.dbPath, JSON.stringify(initialData, null, 2));
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
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler banco de dados:', error);
      throw error;
    }
  }

  // Escreve no banco de dados (operação atômica)
  write(data) {
    try {
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
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
