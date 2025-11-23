import { test, expect } from '@playwright/test';

test.describe('SkillSync Application', () => {
    test('should load landing page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/SkillSync/);
        await expect(page.getByRole('heading', { name: 'SkillSync' })).toBeVisible();
        await expect(page.getByText('Democratizing Internal Talent')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Get Started' }).click();
        await expect(page).toHaveURL(/.*login/);
        await expect(page.getByRole('heading', { name: 'SkillSync' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    });

    test('should display login form', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByLabel('Email Address')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    });
});
