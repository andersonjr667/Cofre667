const jsonStore = require('./config/jsonStore');

console.log('🔍 Inspecionando banco de dados...\n');
console.log('='.repeat(60));

try {
  const data = jsonStore.read();
  
  // Resumo geral
  console.log('\n📊 RESUMO GERAL\n');
  console.log(`Usuários cadastrados: ${data.users?.length || 0}`);
  console.log(`Devedores: ${data.debtors?.length || 0}`);
  console.log(`Transações: ${data.transactions?.length || 0}`);
  console.log(`Investimentos: ${data.investments?.length || 0}`);
  console.log(`Histórico de dívidas: ${data.debtHistory?.length || 0}`);
  
  // Detalhes dos usuários
  if (data.users && data.users.length > 0) {
    console.log('\n👥 USUÁRIOS\n');
    data.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Criado em: ${new Date(user.createdAt).toLocaleString('pt-BR')}`);
      console.log('');
    });
  }
  
  // Detalhes dos devedores
  if (data.debtors && data.debtors.length > 0) {
    console.log('\n💰 DEVEDORES\n');
    data.debtors.forEach((debtor, index) => {
      console.log(`${index + 1}. ${debtor.name}`);
      console.log(`   Valor: R$ ${debtor.amount.toFixed(2)}`);
      console.log(`   Status: ${debtor.status}`);
      console.log(`   Descrição: ${debtor.description || 'N/A'}`);
      console.log('');
    });
  }
  
  // Detalhes das transações
  if (data.transactions && data.transactions.length > 0) {
    console.log('\n💸 TRANSAÇÕES\n');
    data.transactions.forEach((transaction, index) => {
      const symbol = transaction.type === 'entrada' ? '+' : '-';
      console.log(`${index + 1}. ${transaction.description || 'Sem descrição'}`);
      console.log(`   Tipo: ${transaction.type}`);
      console.log(`   Valor: ${symbol} R$ ${transaction.amount.toFixed(2)}`);
      console.log(`   Categoria: ${transaction.category || 'N/A'}`);
      console.log(`   Data: ${new Date(transaction.date).toLocaleString('pt-BR')}`);
      console.log('');
    });
    
    // Calcular saldo
    const saldo = data.transactions.reduce((total, t) => {
      return total + (t.type === 'entrada' ? t.amount : -t.amount);
    }, 0);
    console.log(`   💰 Saldo Total: R$ ${saldo.toFixed(2)}\n`);
  }
  
  // Detalhes dos investimentos
  if (data.investments && data.investments.length > 0) {
    console.log('\n📈 INVESTIMENTOS\n');
    data.investments.forEach((investment, index) => {
      console.log(`${index + 1}. ${investment.name}`);
      console.log(`   Tipo: ${investment.type || 'N/A'}`);
      console.log(`   Valor atual: R$ ${investment.amount.toFixed(2)}`);
      console.log(`   Valor inicial: R$ ${investment.initialAmount.toFixed(2)}`);
      console.log(`   Taxa de retorno: ${investment.returnRate}%`);
      console.log(`   Status: ${investment.status}`);
      console.log('');
    });
    
    // Calcular total investido
    const totalInvestido = data.investments
      .filter(i => i.status === 'ativo')
      .reduce((total, i) => total + i.amount, 0);
    console.log(`   💎 Total Investido: R$ ${totalInvestido.toFixed(2)}\n`);
  }
  
  // Histórico de dívidas
  if (data.debtHistory && data.debtHistory.length > 0) {
    console.log('\n📜 HISTÓRICO DE DÍVIDAS (últimas 5 ações)\n');
    const recentHistory = data.debtHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    recentHistory.forEach((history, index) => {
      console.log(`${index + 1}. ${history.action.toUpperCase()}: ${history.debtorName}`);
      console.log(`   ${history.description}`);
      console.log(`   Data: ${new Date(history.date).toLocaleString('pt-BR')}`);
      console.log('');
    });
  }
  
  console.log('='.repeat(60));
  console.log('\n✅ Inspeção concluída!\n');
  
} catch (error) {
  console.error('❌ Erro ao inspecionar banco de dados:', error.message);
  process.exit(1);
}
