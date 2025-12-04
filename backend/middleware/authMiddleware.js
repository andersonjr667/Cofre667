const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Obter token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token não fornecido'
      });
    }

    // Verificar formato do token (Bearer token)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Formato de token inválido'
      });
    }

    const token = parts[1];

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Token inválido ou expirado'
        });
      }

      // Adicionar informações do usuário à requisição
      req.userId = decoded.id;
      req.userEmail = decoded.email;
      
      next();
    });
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao verificar autenticação',
      erro: error.message
    });
  }
};

module.exports = authMiddleware;
