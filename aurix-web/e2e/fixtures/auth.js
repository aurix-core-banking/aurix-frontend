const { test: base, expect } = require('@playwright/test');

const CREDENCIAIS_VALIDAS = {
  cpf: '12345678909',
  senha: 'Senha@123',
};

const CREDENCIAIS_INVALIDAS = {
  cpf: '00000000000',
  senha: 'senha_errada',
};

const USUARIO_MOCK = {
  id: 1,
  nome: 'João da Silva',
  cpf: '123.456.789-09',
  email: 'joao.silva@email.com',
  contaId: 1,
  conta: {
    id: 1,
    numero: '12345-6',
    agencia: '0001',
    tipo: 'Corrente',
  },
};

const TOKEN_MOCK = 'eyJhbGciOiJIUzI1NiJ9.mock.token.aurix';

async function setupAuth(page) {
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('aurix_token', token);
    localStorage.setItem('aurix_user', JSON.stringify(user));
  }, { token: TOKEN_MOCK, user: USUARIO_MOCK });
}

async function login(page, credenciais = CREDENCIAIS_VALIDAS) {
  await page.goto('/');

  const cpfInput = page.locator('input[placeholder="000.000.000-00"]');
  await cpfInput.fill(credenciais.cpf);

  const senhaInput = page.locator('input[type="password"]');
  await senhaInput.fill(credenciais.senha);

  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
}

async function loginComToken(page) {
  await setupAuth(page);
  await page.goto('/dashboard');
  await page.waitForURL('**/dashboard');
}

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await setupAuth(page);
    await page.goto('/dashboard');
    await page.waitForURL('**/dashboard');
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },
});

module.exports = {
  test,
  expect,
  setupAuth,
  login,
  loginComToken,
  CREDENCIAIS_VALIDAS,
  CREDENCIAIS_INVALIDAS,
  USUARIO_MOCK,
  TOKEN_MOCK,
};
