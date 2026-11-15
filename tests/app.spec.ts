import { test, expect } from '@playwright/test';

// Evita superar el límite de peticiones de la API pública durante la automatización.
test.beforeEach(async ({ page }) => {
  let nextRequest = Date.now();
  await page.route('**/api/**', async route => {
    const wait = Math.max(0, nextRequest - Date.now());
    nextRequest = Math.max(Date.now(), nextRequest) + 650;
    await new Promise(resolve => setTimeout(resolve, wait));
    await route.continue();
  });
});

test('login, guard, catálogos, reparto completo y cierre de sesión con API real', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => { if (!request.url().includes('avatar')) console.log('Error de red:', request.url(), request.failure()?.errorText); });
  page.on('response', response => { if (response.url().includes('/api/') && response.status() >= 400) console.log('Error API:', response.status(), response.url()); });
  await page.goto('/episodios/1');
  await expect(page).toHaveURL(/login/);
  await page.getByLabel('Usuario', { exact: true }).fill('admin');
  await page.getByLabel('Contraseña', { exact: true }).fill('incorrecta');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page.getByRole('alert')).toContainText('incorrectos');
  await page.getByLabel('Contraseña', { exact: true }).fill('admin123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(/episodios\/1$/);
  await expect(page.getByRole('heading', { name: 'Pilot.' })).toBeVisible({ timeout: 45000 });
  await expect(page.locator('app-character-card')).toHaveCount(19);
  await page.locator('app-character-card').first().click();
  await expect(page.getByRole('heading', { name: 'Rick Sanchez.' })).toBeVisible();
  await expect(page.getByText('Última ubicación')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Rick Sanchez.' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByText('Personajes').click();
  await expect(page.locator('app-character-card')).toHaveCount(20);
  await page.getByRole('link', { name: 'Siguiente →' }).click();
  await expect(page).toHaveURL(/personajes\?page=2/);
  await expect(page.locator('app-character-card').first()).toContainText('Aqua Morty');
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByText('Episodios').click();
  await expect(page.locator('.episode-card')).toHaveCount(20);
  await page.getByRole('link', { name: 'Siguiente →' }).click();
  await expect(page).toHaveURL(/episodios\?page=2/);
  await expect(page.locator('.episode-card').first()).toContainText('The Wedding Squanchers');
  await page.getByRole('link', { name: 'Siguiente →' }).click();
  await expect(page.locator('.episode-card')).toHaveCount(11);
  await expect(page.getByRole('link', { name: 'Siguiente →' })).toHaveAttribute('aria-disabled', 'true');
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/login$/);
  await page.goto('/personajes/1');
  await expect(page).toHaveURL(/login/);
  expect(errors).toEqual([]);
});

test('móvil, imágenes y mensaje recuperable de error', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByLabel('Usuario', { exact: true }).fill('admin');
  await page.getByLabel('Contraseña', { exact: true }).fill('admin123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page.locator('.episode-card')).toHaveCount(20, { timeout: 45000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByText('Personajes').click();
  await expect(page.locator('app-character-card')).toHaveCount(20);
  await expect.poll(() => page.locator('.portrait img').first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.route('**/api/episode/999999', route => route.fulfill({ status: 404, contentType: 'application/json', body: '{"error":"Episode not found"}' }));
  await page.goto('/episodios/999999');
  await expect(page.getByRole('alert')).toContainText('No pudimos encontrar');
  await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
});
