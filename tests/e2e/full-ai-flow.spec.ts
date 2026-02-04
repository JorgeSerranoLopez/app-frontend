import { test, expect } from '@playwright/test';

test('Flujo completo IA: registrar, subir archivo y guardar', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page).toHaveTitle(/MudanzaApp/i);
  await page.getByRole('button', { name: 'Registro' }).click();
  await page.getByPlaceholder('Ej. Alejandro Pérez').fill('QA AI');
  await page.getByPlaceholder('nombre@ejemplo.com').fill(`qa_ai_${Date.now()}@example.com`);
  await page.getByPlaceholder('••••••••').fill('Abcdef1!');
  await page.getByRole('button', { name: 'Crear Cuenta' }).click();

  await page.getByRole('button', { name: 'Cotizar con IA' }).click();

  const selects = page.locator('select');
  await selects.nth(0).selectOption('Las Condes');
  await selects.nth(1).selectOption('Vitacura');

  const fileInput = page.locator('input[type="file"]');
  const payload = {
    name: 'inventario.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-image-content')
  };
  await fileInput.setInputFiles(payload);

  await expect(page.getByText('Analizado con Éxito')).toBeVisible({ timeout: 8000 });
  await page.getByRole('button', { name: /Confirmar Inventario/ }).click();

  await expect(page.getByText('Historial de Actividad')).toBeVisible();
  await expect(page.getByText('Bandeja Vacía')).toBeHidden();
  await expect(page.getByText('Las Condes')).toBeVisible();
  await expect(page.getByText('Vitacura')).toBeVisible();
});
