import { test, expect } from '@playwright/test';

test('Flujo completo Manual: registrar, cotizar y guardar', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page).toHaveTitle(/MudanzaApp/i);
  await page.getByRole('button', { name: 'Registro' }).click();
  await page.getByPlaceholder('Ej. Alejandro Pérez').fill('QA User');
  await page.getByPlaceholder('nombre@ejemplo.com').fill(`qa_${Date.now()}@example.com`);
  await page.getByPlaceholder('••••••••').fill('Abcdef1!');
  await page.getByRole('button', { name: 'Crear Cuenta' }).click();

  await expect(page.getByText('Historial de Actividad')).toBeVisible();
  await expect(page.getByText('Bandeja Vacía')).toBeVisible();

  await page.getByRole('button', { name: 'Manual' }).click();

  const selects = page.locator('select');
  await selects.nth(0).selectOption('Providencia');
  await selects.nth(1).selectOption('Ñuñoa');

  await page.getByRole('button', { name: 'Caja Standard' }).click();

  await page.getByRole('button', { name: 'Finalizar Cotización' }).click();

  await expect(page.getByRole('heading', { name: 'Tu Mudanza Ideal' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar y Reservar' }).click();

  await expect(page.getByText('Historial de Actividad')).toBeVisible();
  await expect(page.getByText('Bandeja Vacía')).toBeHidden();
  await expect(page.getByText('Providencia')).toBeVisible();
  await expect(page.getByText('Ñuñoa')).toBeVisible();
});
