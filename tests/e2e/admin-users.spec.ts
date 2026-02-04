import { test, expect } from '@playwright/test';

test('Admin: Directorio de Usuarios busca y abre menú', async ({ page }) => {
  await page.route('**/auth/login', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'tokentest' }) });
  });
  await page.route('**/auth/profile', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, email: 'admin@example.com', name: 'Admin QA', role: 'admin' }) });
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
  await page.getByText('Acceso Administrativo').click();
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'Abcdef1!');
  await page.getByText('Entrar al Portal').click();
  await expect(page.getByText('Gestión Operativa')).toBeVisible();
  await page.locator('button[title="Gestión Usuarios"]').click();
  await expect(page.getByText('Directorio de Usuarios')).toBeVisible();
  // Si ya estamos en directorio, usar el buscador
  const search = page.locator('input[placeholder="Buscar por nombre o email..."]');
  await search.fill('admin');
  await expect(page.getByRole('button', { name: 'Configurar' }).first()).toBeVisible();
});
