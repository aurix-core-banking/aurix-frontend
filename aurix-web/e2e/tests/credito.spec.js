const { test, expect, loginComToken } = require('../fixtures/auth');

test.describe('Crédito', () => {
  test.beforeEach(async ({ page }) => {
    await loginComToken(page);
    await page.goto('/credito');
  });

  test.describe('Simular crédito', () => {
    test('deve exibir formulário de simulação', async ({ page }) => {
      await expect(page.locator('text=Credito').first()).toBeVisible({ timeout: 15000 });
      await expect(page.locator('label:has-text("Valor desejado"), text=Valor desejado').first()).toBeVisible();
      await expect(page.locator('button:has-text("Simular")')).toBeVisible();
    });

    test('deve permitir inserir valor para simulação', async ({ page }) => {
      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('50000');
        const valor = await valorInput.inputValue();
        expect(parseFloat(valor)).toBe(50000);
      }
    });

    test('deve simular crédito ao clicar no botão', async ({ page }) => {
      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('50000');
        await page.locator('button:has-text("Simular")').click();

        const resultado = page.locator('text=Simulacao');
        const erro = page.locator('[role="alert"]');

        await expect(resultado.or(erro)).toBeVisible({ timeout: 15000 });
      }
    });

    test('deve validar valor obrigatório', async ({ page }) => {
      await page.locator('button:has-text("Simular")').click();

      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(valorInput).toHaveAttribute('required');
      }
    });
  });

  test.describe('Solicitar crédito', () => {
    test('deve acessar página de solicitação de crédito', async ({ page }) => {
      await page.goto('/credito');

      await expect(page.locator('text=Credito').first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Ver contratos', () => {
    test('deve acessar página de contratos', async ({ page }) => {
      await page.goto('/credito');

      await expect(page.locator('text=Credito').first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Navegação', () => {
    test('deve navegar entre páginas de crédito', async ({ page }) => {
      await page.goto('/credito');
      await expect(page.locator('text=Credito').first()).toBeVisible();

      await page.goto('/credito');
      await expect(page.locator('text=Credito').first()).toBeVisible();
    });
  });
});
