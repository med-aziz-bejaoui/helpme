import { test, expect } from '@playwright/test';
import config from './variables.json';


test.describe('Tests de la liste des utilisateurs', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('');
      await page.getByRole('link', { name: config.loginPage.loginButton }).click();
      await expect(page).toHaveURL(config.loginPage.loginurl);
      await page.getByPlaceholder(config.loginPage.usernamePlaceholder).fill(config.loginvalide.usernamevalide);
      await page.getByPlaceholder(config.loginPage.passwordPlaceholder).fill(config.loginvalide.passwordvalide);
      await page.getByRole('button', { name: config.loginPage.loginButton}).click();
      await expect(page).toHaveURL(config.loginvalide.dashboard);
      await page.click("text=Gestion Utilisateurs");
      await page.click('a[href="/table/data-table"]');
    });
  
    test('Filtrage des utilisateurs par nom', async ({ page }) => {

      const nom = 'jihed';
      await page.fill('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', nom);
      await page.press('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', 'Enter');

      const selectElement = await page.locator('.mat-select-value');
      await selectElement.click();
      await page.waitForSelector('.mat-select-panel');
      const optionTen = await page.getByText('100');
      await optionTen.click();

      const userRows = page.locator('tr.mat-row');
      const userCount = await userRows.count();
      
      for (let i = 0; i < userCount; i++) {
        const userName = await userRows.nth(i).locator('.cdk-column-fullName').innerText();
        const email = await userRows.nth(i).locator('.cdk-column-email').innerText();

        const containsFirstName = userName.toLowerCase().includes(nom.toLowerCase()) || 
        email.toLowerCase().includes(nom.toLowerCase());

        expect(containsFirstName).toBeTruthy();

      };
    });
      test('Filtrage des utilisateurs par prenom', async ({ page }) => {
        const prenom = 'talbi';
        await page.fill('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', prenom);
        await page.press('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', 'Enter');

        const selectElement = await page.locator('.mat-select-value');
        await selectElement.click();
        await page.waitForSelector('.mat-select-panel');
        const optionTen = await page.getByText('100');
        await optionTen.click();
  
        const userRows = page.locator('tr.mat-row');
        const userCount = await userRows.count();
    
        for (let i = 0; i < userCount; i++) {
          const userName = await userRows.nth(i).locator('.cdk-column-fullName').innerText();
          const email = await userRows.nth(i).locator('.cdk-column-email').innerText();

          const containsFirstName = userName.toLowerCase().includes(prenom.toLowerCase()) || 
          email.toLowerCase().includes(prenom.toLowerCase());

          expect(containsFirstName).toBeTruthy();
        }
    });
    test('Filtrage des utilisateurs par email', async ({ page }) => {
      const email = 'mohamed-aziz.bejaoui@enis.tn';
      await page.fill('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', email);
      await page.press('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', 'Enter');

      const selectElement = await page.locator('.mat-select-value');
      await selectElement.click();
      await page.waitForSelector('.mat-select-panel');
      const optionTen = await page.getByText('100');
      await optionTen.click();

      const userRows = page.locator('tr.mat-row');
      const userCount = await userRows.count();
  
      for (let i = 0; i < userCount; i++) {
        const userEmail = await userRows.nth(i).locator('.cdk-column-email').innerText();
        expect(userEmail.toLowerCase().startsWith(email.toLowerCase())).toBeTruthy();
      }
  });
  test('Filtrage des utilisateurs par rôle', async ({ page }) => {
    const role = 'Agent CRM';
    await page.fill('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', role);
    await page.press('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', 'Enter');

    const selectElement = await page.locator('.mat-select-value');
    await selectElement.click();
    await page.waitForSelector('.mat-select-panel');
    const optionTen = await page.getByText('100');
    await optionTen.click();

    const userRows = page.locator('tr.mat-row');
    const userCount = await userRows.count();

    for (let i = 0; i < userCount; i++) {
        const userRole = await userRows.nth(i).locator('.cdk-column-role').innerText();
        expect(userRole.toLowerCase()).toContain(role.toLowerCase());
    }
});


test('Modification du nom et prénom d\'un utilisateur', async ({ page }) => {
    const nomRecherche = 'Bejaoui';
    const nouveauNom = 'Doe';
    const nouveauPrenom = 'John';

    // Rechercher l'utilisateur par nom
    await page.fill('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', nomRecherche);
    await page.press('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', 'Enter');

    const userRows = page.locator('tr.mat-row');
    const userCount = await userRows.count();

    // Trouver l'utilisateur correspondant et cliquer sur "Détails"
    for (let i = 0; i < userCount; i++) {
        const userName = await userRows.nth(i).locator('.cdk-column-fullName').innerText();

        if (userName.toLowerCase().includes(nomRecherche.toLowerCase())) {
            // Cliquer sur le bouton "Détails"
            await userRows.nth(i).locator('button.btn.btn-infoo.me-2').click();

            // Cliquer sur le bouton "Modifier"
            await page.click('button.modifier-button');

            // Modifier le nom et le prénom
            await page.fill('input[name="firstName"]', nouveauPrenom);
            await page.fill('input[name="lastName"]', nouveauNom);

            // Cliquer sur "Mettre à jour"
            await page.click('button.mat-button.mat-primary');

       

            break;
        }
    }

    // Optionnel : Ajouter une vérification après mise à jour, en recherchant à nouveau l'utilisateur
    await page.fill('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', nouveauNom);
    await page.press('input[placeholder="Entrer Nom d\'utilisateur/Rôle"]', 'Enter');

    const updatedUserRows = page.locator('tr.mat-row');
    const updatedUserCount = await updatedUserRows.count();

    let userFound = false;
    for (let i = 0; i < updatedUserCount; i++) {
        const updatedUserName = await updatedUserRows.nth(i).locator('.cdk-column-fullName').innerText();

        if (updatedUserName.toLowerCase().includes(nouveauNom.toLowerCase()) && updatedUserName.toLowerCase().includes(nouveauPrenom.toLowerCase())) {
            userFound = true;
            break;
        }
    }

    expect(userFound).toBeTruthy();
})})
