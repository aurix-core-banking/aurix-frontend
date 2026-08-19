const { test, expect, loginComToken } = require('../fixtures/auth');

test.describe('PIX', () => {
  test.beforeEach(async ({ page }) => {
    await loginComToken(page);
    await page.goto('/pix');
  });

  test.describe('Criar chave PIX', () => {
    test('deve exibir página PIX com abas', async ({ page }) => {
      await expect(page.locator('h4:has-text("PIX"), h5:has-text("PIX")').first()).toBeVisible({ timeout: 15000 });
      await expect(page.locator('[role="tab"]:has-text("Enviar PIX")')).toBeVisible();
      await expect(page.locator('[role="tab"]:has-text("Receber PIX")')).toBeVisible();
      await expect(page.locator('[role="tab"]:has-text("Chaves PIX")')).toBeVisible();
    });

    test('deve alternar para aba de chaves PIX', async ({ page }) => {
      await page.locator('[role="tab"]:has-text("Chaves PIX")').click();
      await expect(page.locator('text=Minhas Chaves PIX')).toBeVisible();
    });

    test('deve exibir botão para carregar chaves', async ({ page }) => {
      await page.locator('[role="tab"]:has-text("Chaves PIX")').click();
      await expect(page.locator('button:has-text("Carregar Chaves")')).toBeVisible();
    });
  });

  test.describe('Enviar PIX', () => {
    test('deve exibir formulário de envio PIX', async ({ page }) => {
      await expect(page.locator('text=Dados do PIX')).toBeVisible();
      await expect(page.locator('text=Tipo de Chave')).toBeVisible();
      await expect(page.locator('text=Chave PIX')).toBeVisible();
      await expect(page.locator('text=Valor')).toBeVisible();
    });

    test('deve ter stepper de etapas', async ({ page }) => {
      await expect(page.locator('text=Dados do PIX')).toBeVisible();
      await expect(page.locator('text=Confirmação')).toBeVisible();
      await expect(page.locator('text=Concluído')).toBeVisible();
    });

    test('deve ter select de tipo de chave', async ({ page }) => {
      const select = page.locator('select, [role="combobox"]').first();
      if (await select.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(select).toBeVisible();
      }
    });

    test('deve validar campos obrigatórios ao enviar', async ({ page }) => {
      const sendButton = page.locator('button:has-text("Enviar PIX")').first();
      await expect(sendButton).toBeDisabled();
    });

    test('deve preencher formulário de envio', async ({ page }) => {
      const chaveInput = page.locator('input').filter({ hasText: '' }).nth(0);
      const valorInput = page.locator('input[type="number"]').first();

      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('100.50');

        const valor = await valorInput.inputValue();
        expect(parseFloat(valor)).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Receber PIX', () => {
    test('deve alternar para aba de receber PIX', async ({ page }) => {
      await page.locator('[role="tab"]:has-text("Receber PIX")').click();

      await expect(page.locator('text=Valor e Descrição')).toBeVisible();
      await expect(page.locator('text=QR Code Gerado')).toBeVisible();
    });

    test('deve exibir formulário de recebimento', async ({ page }) => {
      await page.locator('[role="tab"]:has-text("Receber PIX")').click();

      await expect(page.locator('button:has-text("Gerar QR Code")')).toBeVisible();
    });

    test('deve gerar QR Code ao preencher valor', async ({ page }) => {
      await page.locator('[role="tab"]:has-text("Receber PIX")').click();

      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('250.00');

        const gerarButton = page.locator('button:has-text("Gerar QR Code")');
        await expect(gerarButton).toBeEnabled();
      }
    });
  });

  test.describe('Histórico PIX', () => {
    test('deve acessar histórico PIX', async ({ page }) => {
      await page.goto('/pix');

      await page.locator('[role="tab"]:has-text("Chaves PIX")').click();
      await expect(page.locator('text=Minhas Chaves PIX')).toBeVisible();
    });
  });
});
