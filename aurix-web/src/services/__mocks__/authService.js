const authService = {
  login: jest.fn().mockResolvedValue({ data: { token: 'mock-token', user: { nome: 'Maria Silva', email: 'maria@test.com' } } }),
  logout: jest.fn(),
  getCurrentUser: jest.fn().mockResolvedValue({ data: { nome: 'Maria Silva', email: 'maria@test.com', conta: { saldo: 15750.5 } } }),
  register: jest.fn().mockResolvedValue({ data: { id: '1', status: 'CRIADO' } }),
  requestPasswordReset: jest.fn().mockResolvedValue({ data: { message: 'Email enviado' } }),
  verifyMFA: jest.fn().mockResolvedValue({ data: { valido: true } }),
};

export default authService;
