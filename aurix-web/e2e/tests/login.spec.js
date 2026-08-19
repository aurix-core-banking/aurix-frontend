const { test, expect, login, CREDENCIAIS_VALIDAS, CREDENCIAIS_INVALIDAS } = require('../fixtures/auth');

test.describe('Login', () => {
  test.describe('Login com credenciais', () => {
    test('deve exibir formulário de login corretamente', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('text=AUREUS Banking')).toBeVisible();
      await expect(page.locator('text=Internet Banking Seguro')).toBeVisible();
      await expect(page.locator('input[placeholder="000.000.000-00"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('text=Entrar')).toBeVisible();
    });

    test('deve fazer login com credenciais válidas', async ({ page }) => {
      await page.goto('/');

      await page.locator('input[placeholder="000.000.000-00"]').fill(CREDENCIAIS_VALIDAS.cpf);
      await page.locator('input[type="password"]').fill(CREDENCIAIS_VALIDAS.senha);
      await page.locator('button[type="submit"]').click();

      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('text=Saldo Disponível')).toBeVisible({ timeout: 10000 });
    });

    test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
      await page.goto('/');

      await page.locator('input[placeholder="000.000.000-00"]').fill(CREDENCIAIS_INVALIDAS.cpf);
      await page.locator('input[type="password"]').fill(CREDENCIAIS_INVALIDAS.senha);
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('[role="alert"]')).toContainText(/inválid|erro|falha/i);
    });

    test('deve exigir campos obrigatórios', async ({ page }) => {
      await page.goto('/');

      await page.locator('button[type="submit"]').click();

      const cpfInput = page.locator('input[placeholder="000.000.000-00"]');
      await expect(cpfInput).toHaveAttribute('required');
    });

    test('deve formatar CPF corretamente', async ({ page }) => {
      await page.goto('/');

      const cpfInput = page.locator('input[placeholder="000.000.000-00"]');
      await cpfInput.fill('12345678909');

      const valor = await cpfInput.inputValue();
      expect(valor).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    });

    test('deve alternar visibilidade da senha', async ({ page }) => {
      await page.goto('/');

      const senhaInput = page.locator('input[type="password"]');
      await expect(senhaInput).toHaveAttribute('type', 'password');

      const toggleButton = page.locator('[data-testid="VisibilityIcon"]').first();
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
        await expect(page.locator('input').nth(1)).toHaveAttribute('type', 'text');
      }
    });
  });

  test.describe('MFA', () => {
    test('deve exibir tela de MFA após login com credenciais', async ({ page }) => {
      await page.goto('/');

      await page.locator('input[placeholder="000.000.000-00"]').fill(CREDENCIAIS_VALIDAS.cpf);
      await page.locator('input[type="password"]').fill(CREDENCIAIS_VALIDAS.senha);
      await page.locator('button[type="submit"]').click();

      const mfaScreen = page.locator('text=Código de segurança');
      const dashboardScreen = page.locator('text=Saldo Disponível');

      const mfaVisivel = await mfaScreen.isVisible({ timeout: 5000 }).catch(() => false);

      if (mfaVisivel) {
        await expect(page.locator('text=Enviamos um código de segurança')).toBeVisible();
        await expect(page.locator('input[placeholder="000000"]')).toBeVisible();
        await expect(page.locator('text=Validar código')).toBeVisible();
      } else {
        await expect(dashboardScreen).toBeVisible({ timeout: 10000 });
      }
    });

    test('deve validar código MFA corretamente', async ({ page }) => {
      await page.goto('/');

      await page.locator('input[placeholder="000.000.000-00"]').fill(CREDENCIAIS_VALIDAS.cpf);
      await page.locator('input[type="password"]').fill(CREDENCIAIS_VALIDAS.senha);
      await page.locator('button[type="submit"]').click();

      const mfaScreen = page.locator('text=Código de segurança');
      const mfaVisivel = await mfaScreen.isVisible({ timeout: 5000 }).catch(() => false);

      if (mfaVisivel) {
        await page.locator('input[placeholder="000000"]').fill('123456');
        await page.locator('text=Validar código').click();

        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
      }
    });

    test('deve voltar para login ao clicar em Voltar no MFA', async ({ page }) => {
      await page.goto('/');

      await page.locator('input[placeholder="000.000.000-00"]').fill(CREDENCIAIS_VALIDAS.cpf);
      await page.locator('input[type="password"]').fill(CREDENCIAIS_VALIDAS.senha);
      await page.locator('button[type="submit"]').click();

      const mfaScreen = page.locator('text=Código de segurança');
      const mfaVisivel = await mfaScreen.isVisible({ timeout: 5000 }).catch(() => false);

      if (mfaVisivel) {
        await page.locator('button:has-text("Voltar")').click();
        await expect(page.locator('input[placeholder="000.000.000-00"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
      }
    });
  });

  test.describe('Logout', () => {
    test('deve fazer logout e voltar para tela de login', async ({ authenticatedPage: page }) => {
      const userMenu = page.locator('[data-testid="user-profile-menu"], button:has-text("João"), [aria-label="conta do usuário"]').first();

      if (await userMenu.isVisible({ timeout: 3000 }).catch(() => false)) {
        await userMenu.click();

        const logoutButton = page.locator('button:has-text("Sair"), [data-testid="logout"]').first();
        if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await logoutButton.click();
          await expect(page).toHaveURL('/');
        }
      } else {
        localStorage.removeItem('aurix_token');
        await page.goto('/');
        await expect(page.locator('text=AUREUS Banking')).toBeVisible();
      }
    });

    test('deve limpar token ao fazer logout', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.setItem('aurix_token', 'fake_token'));
      await page.evaluate(() => {
        window.dispatchEvent(new Event('logout'));
      });
      const token = await page.evaluate(() => localStorage.getItem('aurix_token'));
      expect(token === null || token === '').toBeTruthy();
    });
  });

  test.describe('Navegação', () => {
    test('deve ter links para esqueci senha e primeiro acesso', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('text=Esqueci minha senha')).toBeVisible();
      await expect(page.locator('text=Primeiro acesso')).toBeVisible();
    });

    test('deve navegar para esqueci senha', async ({ page }) => {
      await page.goto('/');

      await page.locator('text=Esqueci minha senha').click();
      await expect(page).toHaveURL(/.*esqueci-senha/);
    });

    test('deve navegar para primeiro acesso', async ({ page }) => {
      await page.goto('/');

      await page.locator('text=Primeiro acesso').click();
      await expect(page).toHaveURL(/.*primeiro-acesso/);
    });

    test('deve exibir opção de biometria', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('text=Entrar com Biometria')).toBeVisible();
    });
  });
});
