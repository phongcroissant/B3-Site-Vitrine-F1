import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Page principale — RGAA', () => {
    test('ne doit avoir aucune violation RGAA détectable', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['RGAAv4'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

test.describe('Page principale — WCAG', () => {
    test('ne doit avoir aucune violation WCAG 2.x A et AA détectable', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

test.describe('Formulaire de contact — WCAG', () => {
    test('ne doit avoir aucune violation WCAG une fois le formulaire affiché', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Show Form' }).click();
        await page.locator('#contact-form-section').waitFor();

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .include('#contact-form-section')
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});