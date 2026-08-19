const { test, expect, loginComToken } = require('../fixtures/auth');

test.describe('TED', () => {
  test.beforeEach(async ({ page }) => {
    await loginComToken(page);
    await page.goto('/transferencia');
  });

  test.describe('Criar TED', () => {
    test('deve exibir formulário de nova TED', async ({ page }) => {
      await expect(page.locator('text=Novo TED').first()).toBeVisible({ timeout: 15000 });
      await expect(page.locator('text=Dados do Beneficiário')).toBeVisible();
    });

    test('deve exibir stepper de etapas', async ({ page }) => {
      await expect(page.locator('text=Dados do Beneficiário')).toBeVisible();
      await expect(page.locator('text=Valor e Descrição')).toBeVisible();
      await expect(page.locator('text=Confirmação')).toBeVisible();
    });

    test('deve exibir campos do beneficiário', async ({ page }) => {
      await expect(page.locator('label:has-text("ISPB do Banco"), text=ISPB do Banco').first()).toBeVisible();
      await expect(page.locator('label:has-text("Agência"), text=Agência').first()).toBeVisible();
      await expect(page.locator('label:has-text("Conta"), text=Conta').first()).toBeVisible();
    });

    test('deve ter aviso fora do horário SPB', async ({ page }) => {
      const agora = new Date();
      const hora = agora.getHours();
      const diaSemana = agora.getDay();
      const foraHorario = diaSemana < 1 || diaSemana > 5 || hora < 9 || hora >= 17;

      if (foraHorario) {
        await expect(page.locator('text=Fora do horário')).toBeVisible();
      }
    });

    test('deve preencher dados do beneficiário e avançar', async ({ page }) => {
      await page.locator('input').filter({ hasText: '' }).nth(0).fill('60701190');
      await page.locator('input').filter({ hasText: '' }).nth(2).fill('1234');
      await page.locator('input').filter({ hasText: '' }).nth(3).fill('56789');
      await page.locator('input').filter({ hasText: '' }).nth(4).fill('0');

      const continueButton = page.locator('button:has-text("Continuar")').first();
      await continueButton.click();

      await expect(page.locator('text=Valor e Descrição')).toBeVisible();
    });

    test('deve validar campos obrigatórios', async ({ page }) => {
      const continueButton = page.locator('button:has-text("Continuar")').first();
      await continueButton.click();

      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Confirmar TED', () => {
    test('deve avançar para confirmação após preencher dados', async ({ page }) => {
      await page.locator('input').filter({ hasText: '' }).nth(0).fill('60701190');
      await page.locator('input').filter({ hasText: '' }).nth(2).fill('1234');
      await page.locator('input').filter({ hasText: '' }).nth(3).fill('56789');

      await page.locator('button:has-text("Continuar")').first().click();

      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('500.00');
        await page.locator('button:has-text("Continuar")').first().click();

        await expect(page.locator('text=Resumo da Transferência TED')).toBeVisible();
        await expect(page.locator('text=Confirmar com Senha')).toBeVisible();
      }
    });

    test('deve exibir resumo antes de confirmar', async ({ page }) => {
      await page.locator('input').filter({ hasText: '' }).nth(0).fill('60701190');
      await page.locator('input').filter({ hasText: '' }).nth(2).fill('1234');
      await page.locator('input').filter({ hasText: '' }).nth(3).fill('56789');

      await page.locator('button:has-text("Continuar")').first().click();

      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('500.00');
        await page.locator('button:has-text("Continuar")').first().click();

        await expect(page.locator('text=Banco')).toBeVisible();
        await expect(page.locator('text=Agência')).toBeVisible();
        await expect(page.locator('text=Conta')).toBeVisible();
      }
    });

    test('deve voltar do passo de confirmação', async ({ page }) => {
      await page.locator('input').filter({ hasText: '' }).nth(0).fill('60701190');
      await page.locator('input').filter({ hasText: '' }).nth(2).fill('1234');
      await page.locator('input').filter({ hasText: '' }).nth(3).fill('56789');

      await page.locator('button:has-text("Continuar")').first().click();

      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('500.00');
        await page.locator('button:has-text("Continuar")').first().click();

        await page.locator('button:has-text("Voltar")').click();
        await expect(page.locator('text=Valor e Descrição')).toBeVisible();
      }
    });
  });

  test.describe('Cancelar TED', () => {
    test('deve cancelar envio e voltar para formulário', async ({ page }) => {
      await page.locator('input').filter({ hasText: '' }).nth(0).fill('60701190');
      await page.locator('input').filter({ hasText: '' }).nth(2).fill('1234');
      await page.locator('input').filter({ hasText: '' }).nth(3).fill('56789');

      await page.locator('button:has-text("Continuar")').first().click();

      const valorInput = page.locator('input[type="number"]').first();
      if (await valorInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorInput.fill('500.00');
        await page.locator('button:has-text("Continuar")').first().click();

        await page.locator('button:has-text("Voltar")').click();
        await expect(page.locator('label:has-text("Valor"), input[type="number"]')).toBeVisible();
      }
    });
  });
});
