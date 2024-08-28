import { test, expect } from '@playwright/test';
import config from './variables.json';


test.describe('Tests de l\'interface d\'ajout d\'un agent CRM', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('');
      await page.getByRole('link', { name: config.loginPage.loginButton }).click();
      await expect(page).toHaveURL(config.loginPage.loginurl);
      await page.getByPlaceholder(config.loginPage.usernamePlaceholder).fill(config.loginvalide.usernamevalide);
      await page.getByPlaceholder(config.loginPage.passwordPlaceholder).fill(config.loginvalide.passwordvalide);
      await page.getByRole('button', { name: config.loginPage.loginButton}).click();
      await expect(page).toHaveURL(config.loginvalide.dashboard);
      await page.click(config.gestionutilisateur);
      await page.click(config.createaccount)
    });


    test('Ajouter un nouvel agent CRM', async ({ page }) => {
      const {
        username,
        email,
        password,
        confirmPassword,
        lastName,
        firstName,
        address,
        phoneNumber
      } = config.agencrmexemple;
    
      const {
        username: usernamePlaceholder,
        email: emailPlaceholder,
        password: passwordPlaceholder,
        confirmPassword: confirmPasswordPlaceholder,
        lastName: lastNamePlaceholder,
        firstName: firstNamePlaceholder,
        address: addressPlaceholder,
        phoneNumber: phoneNumberPlaceholder,
        submit : submit
      } = config.agencrmplaceholders;
    
      await page.fill(`input[placeholder="${usernamePlaceholder}"]`, username);
      await page.fill(`input[placeholder="${emailPlaceholder}"]`, email);
      await page.fill(`input[placeholder="${passwordPlaceholder}"]`, password);
      await page.fill(`input[placeholder="${confirmPasswordPlaceholder}"]`, confirmPassword);
      await page.fill(`input[placeholder="${lastNamePlaceholder}"]`, lastName);
      await page.fill(`input[placeholder="${firstNamePlaceholder}"]`, firstName);
      await page.fill(`input[placeholder="${addressPlaceholder}"]`, address);
      await page.fill(`input[placeholder="${phoneNumberPlaceholder}"]`, phoneNumber);
      await page.selectOption('#roles', { value: 'Agent CRM' });

      // Soumettre le formulaire
      page.click(submit);

  
      // Vérifier que l'agent a été ajouté avec succès
      const successMessage = page.locator('div[role="alert"]');
      await expect(successMessage).toBeVisible();
      await expect(successMessage).toHaveText('Inscription réussie ! Merci !');

      await page.click("text=Gestion Utilisateurs");
      await page.click('a[href="/table/data-table"]');

      const selectElement = await page.locator('.mat-select-value');
      await selectElement.click();
      await page.waitForSelector('.mat-select-panel');
      const optionTen = await page.getByText('100');
      await optionTen.click();

      const userRows = page.locator('tr.mat-row');
      const userCount = await userRows.count();
  
      let userFound = false;

      const userName = await userRows.nth(userCount-1).locator('.cdk-column-fullName').innerText();
      const userEmail = await userRows.nth(userCount-1).locator('.cdk-column-email').innerText();
      if (userName === lastName+' '+firstName && userEmail === email) {
        userFound = true;
        }
      expect(userFound).toBeTruthy();
    });


    test('Ajouter un agent CRM déjà existant et vérifier l\'alerte d\'erreur', async ({ page }) => {

  
      // Remplir le formulaire avec un agent déjà existant
      const {
        username,
        email,
        password,
        confirmPassword,
        lastName,
        firstName,
        address,
        phoneNumber
      } = config.agencrmexemple;
    
      const {
        username: usernamePlaceholder,
        email: emailPlaceholder,
        password: passwordPlaceholder,
        confirmPassword: confirmPasswordPlaceholder,
        lastName: lastNamePlaceholder,
        firstName: firstNamePlaceholder,
        address: addressPlaceholder,
        phoneNumber: phoneNumberPlaceholder,
        submit :submit
      } = config.agencrmplaceholders;
    
      await page.fill(`input[placeholder="${usernamePlaceholder}"]`, username);
      await page.fill(`input[placeholder="${emailPlaceholder}"]`, email);
      await page.fill(`input[placeholder="${passwordPlaceholder}"]`, password);
      await page.fill(`input[placeholder="${confirmPasswordPlaceholder}"]`, confirmPassword);
      await page.fill(`input[placeholder="${lastNamePlaceholder}"]`, lastName);
      await page.fill(`input[placeholder="${firstNamePlaceholder}"]`, firstName);
      await page.fill(`input[placeholder="${addressPlaceholder}"]`, address);
      await page.fill(`input[placeholder="${phoneNumberPlaceholder}"]`, phoneNumber);
      await page.selectOption('#roles', { value: 'Agent CRM' });

      // Soumettre le formulaire
      page.click(submit);
  
      // Vérifier que l'alerte d'erreur s'affiche
      const errorMessage = page.locator('div[role="alert"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText("Le nom d'utilisateur ou l'e-mail est déjà utilisé. Veuillez en choisir un autre.");
    });
 
  
    test('Création d\'un compte admin avec des données valides', async ({ page }) => {
      const {
        username,
        email,
        password,
        confirmPassword,
        lastName,
        firstName,
        address,
        phoneNumber
      } = config.Adminexemple;
    
      const {
        username: usernamePlaceholder,
        email: emailPlaceholder,
        password: passwordPlaceholder,
        confirmPassword: confirmPasswordPlaceholder,
        lastName: lastNamePlaceholder,
        firstName: firstNamePlaceholder,
        address: addressPlaceholder,
        phoneNumber: phoneNumberPlaceholder,
        submit : submit
      } = config.adminplaceholders;
    
      await page.fill(`input[placeholder="${usernamePlaceholder}"]`, username);
      await page.fill(`input[placeholder="${emailPlaceholder}"]`, email);
      await page.fill(`input[placeholder="${passwordPlaceholder}"]`, password);
      await page.fill(`input[placeholder="${confirmPasswordPlaceholder}"]`, confirmPassword);
      await page.fill(`input[placeholder="${lastNamePlaceholder}"]`, lastName);
      await page.fill(`input[placeholder="${firstNamePlaceholder}"]`, firstName);
      await page.fill(`input[placeholder="${addressPlaceholder}"]`, address);
      await page.fill(`input[placeholder="${phoneNumberPlaceholder}"]`, phoneNumber);
      await page.selectOption('#roles', { value: 'Admin' });

      // Soumettre le formulaire
      page.click(submit);

  
      // Attendre la confirmation de la création du compte
      await page.waitForSelector('div[role="alert"]');
  
      // Vérifier si l'alerte de confirmation s'affiche avec le bon message
      const alertMessage = await page.innerText('div[role="alert"]');
      expect(alertMessage).toContain('Inscription réussie ! Merci !');
  
      await page.click("text=Gestion Utilisateurs");
      await page.click('a[href="/table/data-table"]');

      const selectElement = await page.locator('.mat-select-value');
      await selectElement.click();
      await page.waitForSelector('.mat-select-panel');
      const optionTen = await page.getByText('100');
      await optionTen.click();

      const userRows = page.locator('tr.mat-row');
      const userCount = await userRows.count();
  
      let userFound = false;

      const userName = await userRows.nth(userCount-1).locator('.cdk-column-username').innerText();
      const userEmail = await userRows.nth(userCount-1).locator('.cdk-column-email').innerText();
      if (userName === username && userEmail === email) {
        userFound = true;
        }
      expect(userFound).toBeTruthy();
    });
    test('Tentative de création d\'un compte admin avec des données déjà existantes', async ({ page }) => {
      const {
        username,
        email,
        password,
        confirmPassword,
        lastName,
        firstName,
        address,
        phoneNumber
      } = config.Adminexemple;
    
      const {
        username: usernamePlaceholder,
        email: emailPlaceholder,
        password: passwordPlaceholder,
        confirmPassword: confirmPasswordPlaceholder,
        lastName: lastNamePlaceholder,
        firstName: firstNamePlaceholder,
        address: addressPlaceholder,
        phoneNumber: phoneNumberPlaceholder,
        submit : submit
      } = config.adminplaceholders;
    
      await page.fill(`input[placeholder="${usernamePlaceholder}"]`, username);
      await page.fill(`input[placeholder="${emailPlaceholder}"]`, email);
      await page.fill(`input[placeholder="${passwordPlaceholder}"]`, password);
      await page.fill(`input[placeholder="${confirmPasswordPlaceholder}"]`, confirmPassword);
      await page.fill(`input[placeholder="${lastNamePlaceholder}"]`, lastName);
      await page.fill(`input[placeholder="${firstNamePlaceholder}"]`, firstName);
      await page.fill(`input[placeholder="${addressPlaceholder}"]`, address);
      await page.fill(`input[placeholder="${phoneNumberPlaceholder}"]`, phoneNumber);
      await page.selectOption('#roles', { value: 'Admin' });

      // Soumettre le formulaire
      page.click(submit);
  
      // Attendre l'apparition de l'alerte indiquant que le compte existe déjà
      await page.waitForSelector('div[role="alert"]');
  
      // Vérifier si l'alerte de compte déjà existant s'affiche avec le bon message
      const alertMessage = await page.innerText('div[role="alert"]');
      expect(alertMessage).toContain('Le nom d\'utilisateur ou l\'e-mail est déjà utilisé. Veuillez en choisir un autre.');
  });
  
    // (Facultatif) Ajoutez d'autres cas de test pour gérer différents scénarios
  });