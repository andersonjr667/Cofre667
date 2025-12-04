const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

class AuthController {
  // Registro de novo usuário
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação
      if (!name || !email || !password) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Nome, email e senha são obrigatórios'
        });
      }

      // Verificar se o email já existe
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email já cadastrado'
        });
      }

      // Validar senha
      if (password.length < 6) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'A senha deve ter pelo menos 6 caracteres'
        });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await userModel.create({
        name,
        email,
        password: hashedPassword
      });

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário criado com sucesso',
        usuario: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao registrar usuário',
        erro: error.message
      });
    }
  }

  // Login de usuário
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validação
      if (!email || !password) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Email ou senha incorretos'
        });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Email ou senha incorretos'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao fazer login',
        erro: error.message
      });
    }
  }

  // Verificar token
  async verifyToken(req, res) {
    try {
      const user = await userModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado'
        });
      }

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        sucesso: true,
        usuario: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao verificar token',
        erro: error.message
      });
    }
  }
}

module.exports = new AuthController();
