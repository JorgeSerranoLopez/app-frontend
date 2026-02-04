import { test, expect } from '@playwright/test';

test('Autenticación invitado y navegación al dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/MudanzaApp/i);
  await page.getByText('Continuar como Invitado').click();
  await expect(page.getByRole('button', { name: 'Cotizar con IA' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Manual' })).toBeVisible();
});

test('Dashboard: abrir Manual y ver formulario', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Continuar como Invitado').click();
  await page.getByRole('button', { name: 'Manual' }).click();
  await expect(page.locator('label', { hasText: 'Origen' })).toBeVisible();
  await expect(page.locator('label', { hasText: 'Destino' })).toBeVisible();
});
