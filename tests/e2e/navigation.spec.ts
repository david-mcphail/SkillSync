import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should display sidebar and navigate between pages', async ({ page }) => {
        // Set viewport to desktop size
        await page.setViewportSize({ width: 1280, height: 720 });

        // Wait for the layout to load
        await expect(page.getByRole('navigation')).toBeVisible();

        // Verify sidebar items
        console.log('Checking for Dashboard button...');
        await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();

        console.log('Checking for My Profile button...');
        await expect(page.getByRole('button', { name: 'My Profile' })).toBeVisible();

        // Navigate to Profile via sidebar
        console.log('Navigating to Profile...');
        await page.getByRole('button', { name: 'My Profile' }).click();
        await expect(page).toHaveURL(/.*profile/);

        // Verify sidebar is still present on Profile
        console.log('Checking sidebar on Profile page...');
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();

        // Navigate back to Dashboard via sidebar
        console.log('Navigating back to Dashboard...');
        await page.getByRole('button', { name: 'Dashboard' }).click();
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should logout via sidebar', async ({ page }) => {
        // Set viewport to desktop size
        await page.setViewportSize({ width: 1280, height: 720 });

        // Click Sign Out
        await page.getByRole('button', { name: 'Sign Out' }).click();
        await expect(page).toHaveURL(/.*login/);
    });
});
