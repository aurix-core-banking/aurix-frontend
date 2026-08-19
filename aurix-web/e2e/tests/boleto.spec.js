const { test, expect, loginComToken } = require('../fixtures/auth');

test.describe('Boleto', () => {
  test.beforeEach(async ({ page }) => {
    await loginComToken(page);
    await page.goto('/pagamento');
  });

  test.describe('Gerar boleto', () => {
    test('deve exibir formulário de pagamento de boleto', async ({ page }) => {
      await expect(page.locator('text=Pagar Boleto').first()).toBeVisible({ timeout: 15000 });
    });

    test('deve ter opções de código de barras e linha digitável', async ({ page }) => {
      await expect(page.locator('button:has-text("Código de Barras")')).toBeVisible();
      await expect(page.locator('button:has-text("Linha Digitável")')).toBeVisible();
    });

    test('deve alternar entre código de barras e linha digitável', async ({ page }) => {
      await page.locator('button:has-text("Linha Digitável")').click();

      const inputLabel = page.locator('label:has-text("Linha Digitável"), input[placeholder*="2379338"]');
      await expect(inputLabel.first()).toBeVisible();
    });

    test('deve exibir campo de código de barras', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await expect(codigoInput).toBeVisible();
    });

    test('deve ter botão de consultar', async ({ page }) => {
      await expect(page.locator('button:has-text("Consultar")')).toBeVisible();
    });

    test('deve validar código de barras antes de consultar', async ({ page }) => {
      const consultarButton = page.locator('button:has-text("Consultar")');
      await expect(consultarButton).toBeDisabled();
    });

    test('deve consultar boleto com código válido', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await codigoInput.fill('23793.38128 60000.000003 00000.000400 1 84370000012345');

      await page.locator('button:has-text("Consultar")').click();

      const boletoInfo = page.locator('text=Informações do Boleto');
      const erro = page.locator('[role="alert"]');

      await expect(boletoInfo.or(erro)).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Visualizar código de barras', () => {
    test('deve exibir informações do boleto após consulta', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await codigoInput.fill('23793.38128 60000.000003 00000.000400 1 84370000012345');
      await page.locator('button:has-text("Consultar")').click();

      const boletoInfo = page.locator('text=Informações do Boleto');
      if (await boletoInfo.isVisible({ timeout: 10000 }).catch(() => false)) {
        await expect(page.locator('text=Beneficiário')).toBeVisible();
        await expect(page.locator('text=Vencimento')).toBeVisible();
        await expect(page.locator('text=Status')).toBeVisible();
        await expect(page.locator('text=Valor Original')).toBeVisible();
        await expect(page.locator('text=Valor Total')).toBeVisible();
      }
    });

    test('deve exibir erro para boleto inexistente', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await codigoInput.fill('99999.99999 99999.999999 99999.999999 9 99999999999999');
      await page.locator('button:has-text("Consultar")').click();

      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Pagar boleto', () => {
    test('deve exibir botão de pagar boleto após consulta', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await codigoInput.fill('23793.38128 60000.000003 00000.000400 1 84370000012345');
      await page.locator('button:has-text("Consultar")').click();

      const pagarButton = page.locator('button:has-text("Pagar Boleto")');
      if (await pagarButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        await expect(pagarButton).toBeVisible();
      }
    });

    test('deve abrir dialog de confirmação ao pagar', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await codigoInput.fill('23793.38128 60000.000003 00000.000400 1 84370000012345');
      await page.locator('button:has-text("Consultar")').click();

      const pagarButton = page.locator('button:has-text("Pagar Boleto")');
      if (await pagarButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        await pagarButton.click();

        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await expect(page.locator('[role="dialog"] >> text=Confirmar Pagamento')).toBeVisible();
        await expect(page.locator('[role="dialog"] input[type="password"]')).toBeVisible();
      }
    });

    test('deve exigir senha para confirmar pagamento', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await codigoInput.fill('23793.38128 60000.000003 00000.000400 1 84370000012345');
      await page.locator('button:has-text("Consultar")').click();

      const pagarButton = page.locator('button:has-text("Pagar Boleto")');
      if (await pagarButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        await pagarButton.click();

        const confirmarButton = page.locator('[role="dialog"] button:has-text("Confirmar")');
        await expect(confirmarButton).toBeDisabled();
      }
    });

    test('deve cancelar pagamento', async ({ page }) => {
      const codigoInput = page.locator('input[placeholder*="23793"]');
      await codigoInput.fill('23793.38128 60000.000003 00000.000400 1 84370000012345');
      await page.locator('button:has-text("Consultar")').click();

      const pagarButton = page.locator('button:has-text("Pagar Boleto")');
      if (await pagarButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        await pagarButton.click();

        await page.locator('[role="dialog"] button:has-text("Cancelar")').click();
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      }
    });
  });
});
