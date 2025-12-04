const jsonStore = require('./config/jsonStore');

console.log('🔍 Verificando integridade do banco de dados...\n');

try {
  const data = jsonStore.read();
  
  console.log('✅ Banco de dados carregado com sucesso!\n');
  
  // Verificar estrutura
  const requiredTables = ['users', 'debtors', 'transactions', 'investments', 'settings', 'debtHistory'];
  const missingTables = [];
  
  requiredTables.forEach(table => {
    if (!data[table]) {
      missingTables.push(table);
      console.log(`❌ Tabela ausente: ${table}`);
    } else {
      console.log(`✅ Tabela encontrada: ${table} (${Array.isArray(data[table]) ? data[table].length : 'objeto'} ${Array.isArray(data[table]) ? 'registros' : ''})`);
    }
  });
  
  if (missingTables.length > 0) {
    console.log(`\n⚠️  ${missingTables.length} tabela(s) ausente(s)`);
    console.log('Corrigindo estrutura...');
    
    missingTables.forEach(table => {
      if (table === 'settings') {
        data[table] = {};
      } else {
        data[table] = [];
      }
    });
    
    jsonStore.write(data);
    console.log('✅ Estrutura corrigida!');
  } else {
    console.log('\n✅ Todas as tabelas estão presentes!');
  }
  
  // Verificar integridade dos dados
  console.log('\n📊 Resumo dos dados:');
  console.log(`   Usuários: ${data.users?.length || 0}`);
  console.log(`   Devedores: ${data.debtors?.length || 0}`);
  console.log(`   Transações: ${data.transactions?.length || 0}`);
  console.log(`   Investimentos: ${data.investments?.length || 0}`);
  console.log(`   Histórico de Dívidas: ${data.debtHistory?.length || 0}`);
  
  console.log('\n✅ Verificação concluída com sucesso!');
  
} catch (error) {
  console.error('❌ Erro ao verificar banco de dados:', error.message);
  process.exit(1);
}
