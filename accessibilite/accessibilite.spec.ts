import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Pages publiques (accessibles sans authentification)
const pages = [
    { name: "Accueil", path: "/" },
    { name: "Inscription", path: "/register" },
    { name: "Connexion", path: "/login" },
    { name: "Pilotes", path: "/driverList" },
    { name: "Circuit", path: "/circuit" },
    { name: "Classements", path: "/standings" },
    { name: "Boutique", path: "/shop" },
];

test.describe('Conformité RGAA', () => {
    for (const { name, path } of pages) {
        test(`${name} (${path}) ne doit avoir aucune violation RGAA détectable`, async ({ page }) => {
            await page.goto(path);

            // Neutralise transitions/animations CSS : sinon axe peut scanner une
            // frame intermédiaire (ex. pilule de nav en cours de transition) et
            // remonter un faux contraste insuffisant → test instable.
            await page.addStyleTag({
                content: `*, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                }`,
            });

            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['RGAAv4'])
                .analyze();

            expect(accessibilityScanResults.violations).toEqual([]);
        });
    }
});
