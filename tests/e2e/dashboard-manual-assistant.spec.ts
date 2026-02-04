import { test, expect } from '@playwright/test';

test('Dashboard: navegar a Manual y ver formulario', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Continuar como Invitado').click();
  await page.getByRole('button', { name: 'Manual' }).click();
  await expect(page).toHaveURL(/.+/);
  await expect(page.locator('label', { hasText: 'Origen' })).toBeVisible();
  await expect(page.locator('label', { hasText: 'Destino' })).toBeVisible();
  await expect(page.getByText('Finalizar Cotización')).toBeVisible();
});
