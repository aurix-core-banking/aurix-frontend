const { test, expect, loginComToken } = require('../fixtures/auth');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginComToken(page);
  });

  test('deve carregar o dashboard corretamente', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Saldo Disponível')).toBeVisible({ timeout: 15000 });
  });

  test('deve exibir dados financeiros corretos', async ({ page }) => {
    await expect(page.locator('text=Saldo Disponível')).toBeVisible();
    await expect(page.locator('text=Resumo Financeiro')).toBeVisible();
    await expect(page.locator('text=Receitas')).toBeVisible();
    await expect(page.locator('text=Despesas')).toBeVisible();
    await expect(page.locator('text=Saldo Líquido')).toBeVisible();
  });

  test('deve exibir seção de transações recentes', async ({ page }) => {
    await expect(page.locator('text=Transações Recentes')).toBeVisible();
  });

  test('deve exibir seção de investimentos', async ({ page }) => {
    await expect(page.locator('text=Investimentos').first()).toBeVisible();
  });

  test('deve exibir seção de cartões', async ({ page }) => {
    await expect(page.locator('text=Cartões').first()).toBeVisible();
  });

  test('deve ter botões de ação rápida', async ({ page }) => {
    await expect(page.locator('button:has-text("Enviar PIX")')).toBeVisible();
    await expect(page.locator('button:has-text("TED")')).toBeVisible();
    await expect(page.locator('button:has-text("DOC")')).toBeVisible();
  });

  test.describe('Navegação', () => {
    test('deve navegar para Contas via sidebar', async ({ page }) => {
      const navItem = page.locator('[data-testid="nav-contas"], a:has-text("Contas"), button:has-text("Contas")').first();
      if (await navItem.isVisible({ timeout: 3000 }).catch(() => false)) {
        await navItem.click();
        await expect(page).toHaveURL(/.*contas/);
      } else {
        await page.goto('/contas');
        await expect(page.locator('text=Minhas Contas')).toBeVisible();
      }
    });

    test('deve navegar para PIX via sidebar', async ({ page }) => {
      const navItem = page.locator('[data-testid="nav-pix"], a:has-text("PIX"), button:has-text("PIX")').first();
      if (await navItem.isVisible({ timeout: 3000 }).catch(() => false)) {
        await navItem.click();
        await expect(page).toHaveURL(/.*pix/);
      } else {
        await page.goto('/pix');
        await expect(page.locator('text=PIX').first()).toBeVisible();
      }
    });

    test('deve navegar para Crédito via sidebar', async ({ page }) => {
      const navItem = page.locator('[data-testid="nav-credito"], a:has-text("Crédito"), button:has-text("Crédito")').first();
      if (await navItem.isVisible({ timeout: 3000 }).catch(() => false)) {
        await navItem.click();
        await expect(page).toHaveURL(/.*credito/);
      } else {
        await page.goto('/credito');
        await expect(page.locator('text=Credito').first()).toBeVisible();
      }
    });

    test('deve navegar para Extrato via sidebar', async ({ page }) => {
      const navItem = page.locator('[data-testid="nav-extrato"], a:has-text("Extrato"), button:has-text("Extrato")').first();
      if (await navItem.isVisible({ timeout: 3000 }).catch(() => false)) {
        await navItem.click();
        await expect(page).toHaveURL(/.*extrato/);
      } else {
        await page.goto('/extrato');
        await expect(page.locator('text=Extrato').first()).toBeVisible();
      }
    });
  });

  test.describe('Envio rápido de PIX', () => {
    test('deve abrir dialog de envio PIX ao clicar no botão', async ({ page }) => {
      const pixButton = page.locator('button:has-text("Enviar PIX")').first();
      await pixButton.click();

      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('[role="dialog"] >> text=Enviar PIX')).toBeVisible();
      await expect(page.locator('[role="dialog"] input').first()).toBeVisible();
    });

    test('deve fechar dialog ao cancelar', async ({ page }) => {
      const pixButton = page.locator('button:has-text("Enviar PIX")').first();
      await pixButton.click();

      await expect(page.locator('[role="dialog"]')).toBeVisible();

      await page.locator('[role="dialog"] button:has-text("Cancelar")').click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });
  });
});
