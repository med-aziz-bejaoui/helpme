import { test, expect } from '@playwright/test';


test.describe('Tests de la liste des utilisateurs', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('');
      await page.getByRole('link', { name: 'Connexion' }).click();
      await expect(page).toHaveURL(`/auth/login`);
      await page.getByPlaceholder('Entrez votre nom d\'utilisateur').fill('Jihedadmin');
      await page.getByPlaceholder('Entrez votre mot de passe').fill('Jihed123?');
      await page.getByRole('button', { name: 'Connexion' }).click();
      await expect(page).toHaveURL(`/dashboard`);
      await page.click("text=Gestion Utilisateurs");
      await page.click('a[href="/table/data-table"]');
    });
  
    test('Filtrage des utilisateurs par nom', async ({ page }) => {
      const nom = 'jihed';
      await page.fill('input[placeholder="Entrer Username"]', nom);
      await page.press('input[placeholder="Entrer Username"]', 'Enter');

      const userRows = page.locator('tr.mat-row');
      const userCount = await userRows.count();
  
      for (let i = 0; i < userCount; i++) {
        const userName = await userRows.nth(i).locator('.cdk-column-Nom').innerText();
        expect(userName.toLowerCase().startsWith(nom.toLowerCase())).toBeTruthy();

      };
    });
      test('Filtrage des utilisateurs par prenom', async ({ page }) => {
        const prenom = 'talbi';
        await page.fill('input[placeholder="Entrer Username"]', prenom);
        await page.press('input[placeholder="Entrer Username"]', 'Enter');
  
        const userRows = page.locator('tr.mat-row');
        const userCount = await userRows.count();
    
        for (let i = 0; i < userCount; i++) {
          const userFirstName = await userRows.nth(i).locator('.cdk-column-Pr-nom').innerText();
          expect(userFirstName.toLowerCase().startsWith(prenom.toLowerCase())).toBeTruthy();
        }
    });
    test('Filtrage des utilisateurs par email', async ({ page }) => {
      const email = 'talbijihed@gmail.com';
      await page.fill('input[placeholder="Entrer Username"]', email);
      await page.press('input[placeholder="Entrer Username"]', 'Enter');

      const userRows = page.locator('tr.mat-row');
      const userCount = await userRows.count();
  
      for (let i = 0; i < userCount; i++) {
        const userEmail = await userRows.nth(i).locator('.cdk-column-email').innerText();
        expect(userEmail.toLowerCase().startsWith(email.toLowerCase())).toBeTruthy();
      }
  });

  test('Sélection et modification d\'un utilisateur', async ({ page }) => {
    const selectElement = await page.locator('.mat-select-value');
    await selectElement.click();
    await page.waitForSelector('.mat-select-panel');
    const optionTen = await page.getByText('100');
    await optionTen.click();

    const userRow = page.locator('tr:has-text("agentCRM1")');
    await userRow.locator('mat-checkbox').click();
    const actionButtons = await page.locator('.action-buttons');

    // Sélectionner le premier bouton (bouton modifier)
    const modifierButton = await actionButtons.locator('button').nth(0);
  
    // Cliquer sur le bouton modifier
    await modifierButton.click();   
    await page.fill('input[placeholder="Entrer Nom"]', 'NouveauNom');
    await page.fill('input[placeholder="Entrer Prénom"]', 'NouveauPrenom');
    await page.fill('input[placeholder="Entrer Mot de passe"]', 'StrongPassword123!');

    const buttonMettreAJour = await page.getByRole('button', { name: 'Mettre à jour' });
    await buttonMettreAJour.click();

    await expect(userRow.locator('.cdk-column-Nom')).toHaveText('NouveauNom');
    await expect(userRow.locator('.cdk-column-Pr-nom')).toHaveText('NouveauPrenom');
  });

  
  });