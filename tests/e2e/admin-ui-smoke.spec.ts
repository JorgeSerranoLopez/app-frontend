import { test, expect } from '@playwright/test';

test('Admin UI: navegación y menús con datos mockeados', async ({ page }) => {
  await page.route('**/admin/quotes**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'q-1', date: '2026-02-04', origin: 'Providencia', destination: 'Ñuñoa', distance: 6, truck: 'M', blocks: 40, basePrice: 85000, distancePrice: 9000, totalPrice: 94000, status: 'Reservado', user_name: 'Cliente QA' }
      ])
    });
  });
  await page.route('**/admin/users**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 10, name: 'Admin QA', email: 'adminqa@example.com', role: 'admin' },
        { id: 11, name: 'Usuario QA', email: 'userqa@example.com', role: 'client' }
      ])
    });
  });

  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('mudanza_token', 'testtoken');
    localStorage.setItem('mudanza_current_user', JSON.stringify({ id: '1', name: 'Admin', email: 'admin@example.com', password: '', history: [], isAdmin: true }));
  });
  await page.reload();

  await page.locator('button[title="Gestión Cotizaciones"]').click();
  await expect(page.getByText('Gestión Operativa')).toBeVisible();
  await expect(page.getByText('Providencia')).toBeVisible();
  await expect(page.getByText('Ñuñoa')).toBeVisible();
  await page.locator('button[title="Opciones"]').first().click();
  await expect(page.getByRole('button', { name: 'Marcar Completado' })).toBeVisible();

  await page.locator('button[title="Gestión Usuarios"]').click();
  await expect(page.getByText('Directorio de Usuarios')).toBeVisible();
  await page.locator('input[placeholder="Buscar por nombre o email..."]').fill('admin');
  await expect(page.getByRole('button', { name: 'Configurar' }).first()).toBeVisible();
});
