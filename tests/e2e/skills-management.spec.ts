import { test, expect } from '@playwright/test';

test.describe.skip('Skills Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // Navigate to Skills Management
        await page.getByRole('button', { name: 'Skills Management' }).click();
        await expect(page).toHaveURL(/.*skills-management/);
    });

    test('should add, edit, and delete a category', async ({ page }) => {
        // Add Category
        await page.getByRole('button', { name: 'Add Category' }).click();
        await page.getByLabel('Category Name').fill('New Test Category');
        await page.getByLabel('Description').fill('Description for test category');
        await page.getByRole('button', { name: 'Save' }).click();

        // Verify added
        await expect(page.getByText('New Test Category')).toBeVisible();
        await expect(page.getByText('Description for test category')).toBeVisible();

        // Edit Category
        // Find the list item containing the text and click the edit button within it
        const listItem = page.locator('li').filter({ hasText: 'New Test Category' });
        await listItem.getByRole('button', { name: 'edit' }).click();

        await expect(page.getByLabel('Category Name')).toHaveValue('New Test Category');
        await page.getByLabel('Category Name').fill('Updated Category Name');
        await page.getByRole('button', { name: 'Save' }).click();

        // Verify updated
        await expect(page.getByText('Updated Category Name')).toBeVisible();
        await expect(page.getByText('New Test Category')).not.toBeVisible();

        // Delete Category
        page.on('dialog', dialog => dialog.accept()); // Handle confirmation dialog
        const updatedListItem = page.locator('li').filter({ hasText: 'Updated Category Name' });
        await updatedListItem.getByRole('button', { name: 'delete' }).click();

        // Verify deleted
        await expect(page.getByText('Updated Category Name')).not.toBeVisible();
    });
});
