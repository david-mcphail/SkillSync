import { test, expect } from '@playwright/test';

test.describe('Tags Page', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // Navigate to Skills Configuration -> Tags
        await page.getByRole('button', { name: 'Skills Configuration' }).click();
        await page.getByRole('button', { name: 'Tags' }).click();
        await expect(page).toHaveURL(/.*skills-configuration\/tags/);
    });

    test('should display existing tags', async ({ page }) => {
        // Check for at least one tag chip
        await expect(page.locator('.MuiChip-root').first()).toBeVisible();
    });

    test('should add a new tag with description', async ({ page }) => {
        // Open Add Tag dialog
        await page.getByRole('button', { name: 'Add Tag' }).click();

        // Fill form
        await page.getByLabel('Tag Name').fill('New Test Tag');
        await page.getByLabel('Description').fill('Test Description');

        // Save
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        // Verify new tag is visible
        await expect(page.getByText('New Test Tag')).toBeVisible();
        await expect(page.getByText('Test Description')).toBeVisible();
    });

    test('should delete a tag', async ({ page }) => {
        // Add a tag to delete
        await page.getByRole('button', { name: 'Add Tag' }).click();
        await page.getByLabel('Tag Name').fill('Delete Me');
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(page.getByText('Delete Me')).toBeVisible();

        // Handle confirmation dialog
        page.on('dialog', dialog => dialog.accept());

        // Delete
        const tagCard = page.locator('.MuiCardContent-root').filter({ hasText: 'Delete Me' });
        await tagCard.getByRole('button').click();

        // Verify deleted
        await expect(page.getByText('Delete Me')).not.toBeVisible();
    });
});
