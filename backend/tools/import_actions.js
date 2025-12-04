const jsonStore = require('./config/jsonStore');

console.log('📦 Ferramenta de Importação de Dados\n');
console.log('='.repeat(60));

// Exemplo de como importar dados em massa
function importData() {
  try {
    const data = jsonStore.read();
    
    console.log('\n✅ Banco de dados carregado com sucesso!');
    console.log('\nEstrutura atual:');
    console.log(`- Usuários: ${data.users?.length || 0}`);
    console.log(`- Devedores: ${data.debtors?.length || 0}`);
    console.log(`- Transações: ${data.transactions?.length || 0}`);
    console.log(`- Investimentos: ${data.investments?.length || 0}`);
    
    console.log('\n💡 Para importar dados:');
    console.log('1. Modifique este arquivo adicionando seus dados');
    console.log('2. Use jsonStore.addItem(tabela, dados) para adicionar');
    console.log('3. Use jsonStore.write(data) para salvar\n');
    
    // Exemplo de importação (comentado)
    /*
    const novaTransacao = {
      userId: 'id-do-usuario',
      type: 'entrada',
      category: 'Freelance',
      amount: 1500,
      description: 'Projeto X',
      date: new Date().toISOString()
    };
    
    jsonStore.addItem('transactions', novaTransacao);
    console.log('✅ Transação importada!');
    */
    
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error.message);
  }
}

importData();
