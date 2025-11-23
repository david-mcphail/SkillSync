import { test, expect } from '@playwright/test';

test.describe('User Profile Feature', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should navigate to profile from dashboard', async ({ page }) => {
        await page.getByRole('button', { name: 'View Profile' }).click();
        await expect(page).toHaveURL(/.*profile/);
        await expect(page.getByText('Jane Doe')).toBeVisible();
        await expect(page.getByText('Senior Frontend Engineer')).toBeVisible();
    });

    test('should display skills with proficiency', async ({ page }) => {
        await page.goto('/profile');

        // Wait for loading to finish (skeleton to disappear)
        await expect(page.locator('.MuiSkeleton-root').first()).not.toBeVisible({ timeout: 10000 });

        await expect(page.getByText('Skills Inventory')).toBeVisible();
        await expect(page.getByText('React')).toBeVisible();
        await expect(page.getByText('Frontend')).toBeVisible();
    });
});
