const chai = require('chai');
const expect = chai.expect;

// Simular requisição HTTP
const mockRequest = async (url, options = {}) => {
  const baseURL = 'http://localhost:3000';
  const response = await fetch(baseURL + url, options);
  const data = await response.json();
  return { status: response.status, data };
};

describe('Testes de Login', function() {
  this.timeout(5000);
  
  let testUser = {
    name: 'Usuário Login Teste',
    email: `login${Date.now()}@example.com`,
    password: '123456'
  };

  // Criar usuário antes dos testes
  before(async function() {
    await mockRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
  });

  it('Deve fazer login com credenciais válidas', async function() {
    const response = await mockRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    expect(response.status).to.equal(200);
    expect(response.data.sucesso).to.be.true;
    expect(response.data).to.have.property('token');
    expect(response.data).to.have.property('usuario');
    expect(response.data.usuario).to.not.have.property('password');
  });

  it('Deve retornar erro com email inválido', async function() {
    const response = await mockRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'emailinvalido@example.com',
        password: '123456'
      })
    });

    expect(response.status).to.equal(401);
    expect(response.data.sucesso).to.be.false;
    expect(response.data.mensagem).to.include('incorretos');
  });

  it('Deve retornar erro com senha incorreta', async function() {
    const response = await mockRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'senhaerrada'
      })
    });

    expect(response.status).to.equal(401);
    expect(response.data.sucesso).to.be.false;
    expect(response.data.mensagem).to.include('incorretos');
  });

  it('Deve retornar erro ao tentar login sem credenciais', async function() {
    const response = await mockRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    expect(response.status).to.equal(400);
    expect(response.data.sucesso).to.be.false;
  });

  it('Deve verificar token válido', async function() {
    // Primeiro fazer login
    const loginResponse = await mockRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const token = loginResponse.data.token;

    // Verificar token
    const response = await mockRequest('/api/auth/verify', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });

    expect(response.status).to.equal(200);
    expect(response.data.sucesso).to.be.true;
    expect(response.data).to.have.property('usuario');
  });

  it('Deve retornar erro com token inválido', async function() {
    const response = await mockRequest('/api/auth/verify', {
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer token_invalido'
      }
    });

    expect(response.status).to.equal(401);
    expect(response.data.sucesso).to.be.false;
  });
});
