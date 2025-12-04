const chai = require('chai');
const expect = chai.expect;

// Simular requisição HTTP
const mockRequest = async (url, options = {}) => {
  const baseURL = 'http://localhost:3000';
  const response = await fetch(baseURL + url, options);
  const data = await response.json();
  return { status: response.status, data };
};

describe('Testes de Registro', function() {
  this.timeout(5000);

  it('Deve registrar um novo usuário com sucesso', async function() {
    const userData = {
      name: 'Usuário Teste',
      email: `teste${Date.now()}@example.com`,
      password: '123456'
    };

    const response = await mockRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    expect(response.status).to.equal(201);
    expect(response.data.sucesso).to.be.true;
    expect(response.data.usuario).to.have.property('id');
    expect(response.data.usuario).to.have.property('email', userData.email);
    expect(response.data.usuario).to.not.have.property('password');
  });

  it('Deve retornar erro ao tentar registrar com email duplicado', async function() {
    const email = `duplicate${Date.now()}@example.com`;
    
    const userData = {
      name: 'Usuário 1',
      email: email,
      password: '123456'
    };

    // Primeiro registro
    await mockRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    // Segundo registro (deve falhar)
    const response = await mockRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    expect(response.status).to.equal(400);
    expect(response.data.sucesso).to.be.false;
    expect(response.data.mensagem).to.include('já cadastrado');
  });

  it('Deve retornar erro ao tentar registrar sem dados obrigatórios', async function() {
    const response = await mockRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Teste' })
    });

    expect(response.status).to.equal(400);
    expect(response.data.sucesso).to.be.false;
  });

  it('Deve retornar erro ao tentar registrar com senha curta', async function() {
    const userData = {
      name: 'Usuário Teste',
      email: `teste${Date.now()}@example.com`,
      password: '12345'
    };

    const response = await mockRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    expect(response.status).to.equal(400);
    expect(response.data.sucesso).to.be.false;
    expect(response.data.mensagem).to.include('6 caracteres');
  });
});
