import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should redirect to login when accessing protected route', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/.*login/);
    });

    test('should login successfully and redirect to dashboard', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('test@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.getByText('Welcome back, test')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('test@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // Logout
        await page.getByRole('button', { name: 'Sign Out' }).click();
        await expect(page).toHaveURL(/.*login/);
    });
});
