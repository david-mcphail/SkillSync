import { test, expect } from '@playwright/test';

test.describe('Profile Page Tags', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email Address').fill('jane.doe@example.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // Navigate to Profile using sidebar
        await page.getByRole('button', { name: 'My Profile' }).click();
        await expect(page).toHaveURL(/.*profile/);
    });

    test('should display Tags card in Skills Overview', async ({ page }) => {
        // Expect 10 cards (9 categories + 1 tags)
        // Note: This assumes TAXONOMY has 9 items. If it changes, this test needs update.
        // We can just check for the Tags card specifically.

        // Expect a card with heading "Tags"
        await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();
    });

    test('should display tags details when clicked', async ({ page }) => {
        await page.getByText('Tags', { exact: true }).click();
        // Should see "Certified", "Mentor" etc.
        await expect(page.getByText('Certified')).toBeVisible();
        await expect(page.getByText('Mentor')).toBeVisible();
    });
});
