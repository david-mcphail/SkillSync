import { test, expect } from '@playwright/test';

test.describe('Skills Master List', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // Navigate to Skills Configuration
        await page.getByRole('button', { name: 'Skills Configuration' }).click();
    });

    test('should navigate to Skills Master List', async ({ page }) => {
        // Click on Skills card
        await page.getByRole('button', { name: 'Skills Master list of all skills' }).click();
        await expect(page).toHaveURL(/.*skills-configuration\/skills/);
        await expect(page.getByRole('heading', { name: 'Skills Master List' })).toBeVisible();
    });

    test('should display skills table', async ({ page }) => {
        await page.goto('/skills-configuration/skills');

        // Check table headers
        await expect(page.getByRole('cell', { name: 'Skill Name' })).toBeVisible();
        await expect(page.getByRole('cell', { name: 'Category' })).toBeVisible();

        // Check for specific skills
        await expect(page.getByRole('cell', { name: 'React', exact: true })).toBeVisible();
        await expect(page.getByRole('cell', { name: 'Application Development' }).first()).toBeVisible();
    });

    test('should filter skills', async ({ page }) => {
        await page.goto('/skills-configuration/skills');

        // Search for "React"
        await page.getByPlaceholder('Search skills...').fill('React');

        // Should see React
        await expect(page.getByRole('cell', { name: 'React', exact: true })).toBeVisible();

        // Should not see Java (assuming Java is in the list but filtered out)
        await expect(page.getByRole('cell', { name: 'Java', exact: true })).not.toBeVisible();
    });
});
