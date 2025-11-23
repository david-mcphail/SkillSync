import { test, expect } from '@playwright/test';

test.describe('Skill Taxonomy & Data Entry', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // Navigate to profile
        await page.getByRole('button', { name: 'View Profile' }).click();
        await expect(page).toHaveURL(/.*profile/);
    });

    test('should display skills grouped by taxonomy', async ({ page }) => {
        // Wait for loading
        await expect(page.locator('.MuiSkeleton-root').first()).not.toBeVisible({ timeout: 10000 });

        // Check for taxonomy category cards
        await expect(page.getByText('Application Development', { exact: true })).toBeVisible();
        await expect(page.getByText('Platform Engineering', { exact: true })).toBeVisible();

        // Click on a category to drill down
        await page.getByText('Application Development', { exact: true }).click();

        // Check for subcategories in detailed view
        await expect(page.getByText('Frontend Frameworks', { exact: true })).toBeVisible();

        // Check for back button and navigate back
        await page.getByRole('button').filter({ has: page.locator('svg[data-testid="ArrowBackIcon"]') }).click();

        // Verify back to overview
        await expect(page.getByText('Skills Overview')).toBeVisible();
    });

    test('should add a new skill using the 3-step workflow', async ({ page }) => {
        // Wait for loading
        await expect(page.locator('.MuiSkeleton-root').first()).not.toBeVisible({ timeout: 10000 });

        // Step 1: Select Category (Drill down first)
        await page.getByText('Project and Client Delivery').click();

        // Open modal (now inside the category view)
        await page.getByRole('button', { name: 'Add Skill' }).click();
        await expect(page.getByText('Add New Skill')).toBeVisible();

        // Step 2: Select Skill (Category is pre-selected, so we start at step 2)
        console.log('Waiting for "Search for a skill in" text...');
        await expect(page.getByText('Search for a skill in', { exact: false })).toBeVisible();

        console.log('Waiting for skill input...');
        // Try using placeholder as it might be more robust
        const skillInput = page.getByPlaceholder('e.g. React, Kubernetes...');
        await expect(skillInput).toBeVisible();

        console.log('Filling skill input...');
        await skillInput.click();
        await skillInput.fill('Jira');
        await expect(page.getByText('Tools', { exact: true })).toBeVisible();
    });
});
