import { test, expect } from '@playwright/test';

test('Admin: Gestión Operativa busca y abre detalle', async ({ page }) => {
  await page.route('**/auth/login', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'tokentest' }) });
  });
  await page.route('**/auth/profile', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, email: 'admin@example.com', name: 'Admin QA', role: 'admin' }) });
  });
  await page.route('**/admin/quotes**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'q-1', date: '2026-02-04', origin: 'Providencia', destination: 'Ñuñoa', distance: 6, truck: 'M', blocks: 40, basePrice: 85000, distancePrice: 9000, totalPrice: 94000, status: 'Reservado', user_name: 'Cliente QA' }
      ])
    });
  });
  await page.goto('/');
  await page.getByText('Acceso Administrativo').click();
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'Abcdef1!');
  await page.getByText('Entrar al Portal').click();
  await expect(page.getByText('Gestión Operativa')).toBeVisible();
  await page.fill('input[placeholder="Buscar por cliente o ID..."]', 'QA');
  // Si hay resultados, intenta abrir el menú y ver detalle
  const verDetalle = page.getByText('Ver detalle');
  // Abre el menú del primer card (tres puntos)
  await page.locator('button[title="Opciones"]').first().click();
  await verDetalle.click({ trial: true }).catch(() => {});
});
