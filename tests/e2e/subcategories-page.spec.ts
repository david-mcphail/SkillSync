import { test, expect } from '@playwright/test';

test.describe('Subcategories Page', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // Navigate to Skills Configuration -> Subcategories
        await page.getByRole('button', { name: 'Skills Configuration' }).click();
        await page.getByRole('button', { name: 'Subcategories' }).click();
        await expect(page).toHaveURL(/.*skills-configuration\/subcategories/);
    });

    test('should display existing subcategories', async ({ page }) => {
        // Check for at least one subcategory card
        await expect(page.locator('.MuiCard-root').first()).toBeVisible();
    });

    test('should add a new subcategory', async ({ page }) => {
        // Open Add Subcategory dialog
        await page.getByRole('button', { name: 'Add Subcategory' }).click();

        // Fill form
        await page.getByLabel('Subcategory Name').fill('New Test Subcategory');
        await page.getByLabel('Parent Category').click();
        await page.getByRole('option').first().click(); // Select first available category

        // Save
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        // Verify new subcategory is visible
        await expect(page.getByText('New Test Subcategory')).toBeVisible();
    });
});
