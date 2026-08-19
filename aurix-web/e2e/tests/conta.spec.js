const { test, expect, loginComToken } = require('../fixtures/auth');

test.describe('Contas', () => {
  test.beforeEach(async ({ page }) => {
    await loginComToken(page);
    await page.goto('/contas');
  });

  test('deve visualizar a página de contas', async ({ page }) => {
    await expect(page.locator('text=Minhas Contas')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Detalhes das Contas')).toBeVisible();
  });

  test('deve exibir lista de contas', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Conta")')).toBeVisible();
    await expect(page.locator('th:has-text("Tipo")')).toBeVisible();
    await expect(page.locator('th:has-text("Saldo")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Ações")')).toBeVisible();
  });

  test('deve exibir botão de nova conta', async ({ page }) => {
    await expect(page.locator('button:has-text("Nova Conta")')).toBeVisible();
  });

  test('deve ter botões de ação para cada conta', async ({ page }) => {
    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    if (count > 0) {
      const firstRow = rows.first();
      await expect(firstRow.locator('button').first()).toBeVisible();
    }
  });

  test.describe('Extrato', () => {
    test('deve abrir dialog de extrato ao clicar no botão', async ({ page }) => {
      const viewButton = page.locator('button[title="Ver Extrato"]').first();

      if (await viewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await viewButton.click();

        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await expect(page.locator('[role="dialog"] >> text=Extrato')).toBeVisible();
        await expect(page.locator('[role="dialog"] >> text=Fechar')).toBeVisible();
      }
    });

    test('deve fechar dialog de extrato', async ({ page }) => {
      const viewButton = page.locator('button[title="Ver Extrato"]').first();

      if (await viewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await viewButton.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        await page.locator('[role="dialog"] button:has-text("Fechar")').click();
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      }
    });
  });

  test.describe('Filtrar transações', () => {
    test('deve ter campos de filtro de data no extrato', async ({ page }) => {
      const viewButton = page.locator('button[title="Ver Extrato"]').first();

      if (await viewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await viewButton.click();

        await expect(page.locator('[role="dialog"] >> text=Data Inicial')).toBeVisible();
        await expect(page.locator('[role="dialog"] >> text=Data Final')).toBeVisible();
      }
    });

    test('deve ter tabela de transações no extrato', async ({ page }) => {
      const viewButton = page.locator('button[title="Ver Extrato"]').first();

      if (await viewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await viewButton.click();

        await expect(page.locator('[role="dialog"] table')).toBeVisible();
        await expect(page.locator('[role="dialog"] th:has-text("Data")')).toBeVisible();
        await expect(page.locator('[role="dialog"] th:has-text("Descrição")')).toBeVisible();
        await expect(page.locator('[role="dialog"] th:has-text("Valor")')).toBeVisible();
        await expect(page.locator('[role="dialog"] th:has-text("Saldo")')).toBeVisible();
      }
    });

    test('deve ter botão de download PDF no extrato', async ({ page }) => {
      const viewButton = page.locator('button[title="Ver Extrato"]').first();

      if (await viewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await viewButton.click();

        await expect(page.locator('[role="dialog"] button:has-text("Download PDF")')).toBeVisible();
      }
    });
  });
});
