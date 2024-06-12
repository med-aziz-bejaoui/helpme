import { test, expect } from '@playwright/test';
import config from './variables.json';


const { usernamePlaceholder, passwordPlaceholder, loginButton } = config.loginPage;

  test.describe('login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('');
      await page.getByRole('link', { name: loginButton }).click();
      await expect(page).toHaveURL(`/auth/login`);
    });
    test.only('Connexion réussie avec des identifiants valides', async ({ page }) => {
        const { usernamevalide, passwordvalide,success } = config.loginvalide;
        // create a new todo locator
      await page.getByPlaceholder(usernamePlaceholder).fill(usernamevalide);
      await page.getByPlaceholder(passwordPlaceholder).fill(passwordvalide);
      await page.getByRole('button', { name: loginButton }).click();
      await expect(page).toHaveURL(dashboard);
  
    })
    test('Échec de connexion avec un mot de passe incorrect', async ({ page }) => {
      // create a new todo locator
      const { usernamevalide, passwordinvalide,erreurmessagelocator,erreurmessagevalue} = config.loginpassinvalide;

      await page.getByPlaceholder(usernamePlaceholder).fill(usernamevalide);
      await page.getByPlaceholder(passwordPlaceholder).fill(passwordinvalide);
      await expect(page.getByRole('button', { name: loginButton })).toBeEnabled();
  
      await page.getByRole('button', { name: loginButton }).click();
  
      const errorMessageElement = await page.locator(erreurmessagelocator);
      
      // Vérification du contenu de l'élément
      const errorMessage = await errorMessageElement.textContent();
      await expect(errorMessage).toContain(erreurmessagevalue);
  
    })
    test('Échec de connexion avec un champ mot de passe vide', async ({ page }) => {
      // create a new todo locator
      const { usernamevalide,erreurmessagelocator, erreurmessagevalue} = config.loginpassvide;

      await page.getByPlaceholder(passwordPlaceholder).click();
  
      await page.getByPlaceholder(usernamePlaceholder).fill(usernamevalide);
      await expect(page.getByRole('button', { name: loginButton })).toBeDisabled();
  
      const errorMessageElement = await page.locator(erreurmessagelocator);
  
      // Obtenir le texte de l'élément
      const errorMessage = await errorMessageElement.textContent();
    
      // Vérifier que le texte de l'élément est celui attendu
      await expect(errorMessage).toContain(erreurmessagevalue);    
      // Vérification du contenu de l'élément
      
  
    })
    test('Échec de connexion avec un champ nom d\'utilisateur vide', async ({ page }) => {
      // create a new todo locator
      const { passwordvalide,erreurmessagelocator, erreurmessagevalue} = config.loginuservide;

      await page.getByPlaceholder(usernamePlaceholder).click();
      await page.getByPlaceholder(passwordPlaceholder).fill(passwordvalide);
      await page.locator('span').filter({ hasText: loginButton }).click();
      await expect(page.getByRole('button', { name: loginButton })).toBeDisabled();
  
      const errorMessageElement = await page.locator(erreurmessagelocator);
  
      // Obtenir le texte de l'élément
      const errorMessage = await errorMessageElement.textContent();
    
      // Vérifier que le texte de l'élément est celui attendu
      await expect(errorMessage).toContain(erreurmessagevalue);    
      // Vérification du contenu de l'élément
      
  
    })});