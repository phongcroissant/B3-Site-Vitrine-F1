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