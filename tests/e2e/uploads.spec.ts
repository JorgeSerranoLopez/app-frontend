import { test, expect } from '@playwright/test';

test('Dashboard: navegar a Cotizar con IA y ver formulario', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Continuar como Invitado').click();
  await page.getByRole('button', { name: 'Cotizar con IA' }).click();
  await expect(page).toHaveURL(/.+/);
  await expect(page.getByRole('heading', { name: 'Análisis de Inventario Visual' })).toBeVisible();
  await expect(page.locator('label', { hasText: 'Origen' })).toBeVisible();
  await expect(page.locator('label', { hasText: 'Destino' })).toBeVisible();
});
