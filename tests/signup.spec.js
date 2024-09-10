import { test, expect } from '@playwright/test';
import config from './variables.json';

test.describe('signup', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('');
      await page.getByRole('link', { name: 'Créer Compte' }).click();
      await expect(page).toHaveURL(`/signup`);
    });
    test('Inscription avec des données valides', async ({ page }) => {
      page.setDefaultTimeout(3000000);

      // Remplir chaque champ avec des données valides
      const fieldsData = {
        'Nom d\'utilisateur': 'AZIZZZ',
        'Prénom': 'Aziz',
        'Nom de famille': 'Bejaoui',
        'Email': 'Mohamed-Aziz28@enis.tn',
        'Numéro de téléphone': '58959397',
        'Adresse principale': 'Tunis,Tunisie',
        'Entrez votre nouveau mot de passe': 'StrongPassword123!',
        'Confirmez votre nouveau mot de passe': 'StrongPassword123!'

      };
  
      for (const [placeholder, data] of Object.entries(fieldsData)) {
        const input = page.locator(`input[placeholder="${placeholder}"]`);
        await input.fill(data);
      }
  
      // Sélectionner le sexe
      const selectSexe = page.locator('select[name="sexe"]');
      await selectSexe.selectOption({ label: 'HOMME' });
  
      // Sélectionner le groupe sanguin
      const selectGroupSanguin = page.locator('select[name="groupSanguin"]');
      await selectGroupSanguin.selectOption({ label: 'A+' });
  


      await page.locator('input[name="photoFile"]').setInputFiles('./tmp/eminem.jpg');

      await page.locator('input[name="cinFile"]').setInputFiles('./tmp/CIN.jpeg');

                                                                                                                                                                   
      await page.getByText('Acceptez les termes et la').click();
      
      await page.getByText('S\'inscrire').click();



      await expect(page).toHaveURL(`/Plans`);
      const alertLocator = page.locator('div[role="alert"]');
      await expect(alertLocator).toBeVisible({ timeout: 10000 });
      await expect(alertLocator).toHaveText('Inscription réussie ! Merci !');

      await page.click('button:has-text("Sélectionner")');
      await page.fill('input#email', fieldsData.Email);

      const cardNumber = '4242424242424242';
      await page.fill('input#cardNumber', cardNumber);
      
      const cardExpiry = '0631';
      await page.fill('input#cardExpiry', cardExpiry);

      const cardCvc = '294';
      await page.fill('input#cardCvc', cardCvc);

      await page.fill('input#billingName', fieldsData.Prénom+fieldsData['Nom de famille']);

      const billingCountry = 'TN';
      await page.selectOption('select#billingCountry', billingCountry);
      
  
    
     // await page.check('input#enableStripePass');
     await page.getByLabel('Securely save my information').click();

     //await page.locator('input[id="phoneNumber"]').fill(fieldsData['Numéro de téléphone']);
     const phoneNumber = fieldsData['Numéro de téléphone'];

     await page.fill('#phoneNumber', phoneNumber);
  // Sélectionner le bouton par son attribut data-testid
      const subscribeButton = page.locator('[data-testid="hosted-payment-submit-button"]');
  // Cliquer sur le bouton
      await subscribeButton.click();

               /*const submitButton  = page.locator('a.login100-form-btn.btn-primary:has-text("S\'inscrire")');
      await submitButton.click();*/
  
      // Vérifier la réussite de l'inscription (vous devrez ajuster cette vérification en fonction de votre site)
      /*const successMessageLocator = page.locator('text="Inscription réussie!"');
      await expect(successMessageLocator).toBeVisible();*/
    });

    test('Vérifier les messages d\'erreur pour les données invalides', async ({ page }) => {
      // Remplir chaque champ avec des données invalides
      const fieldsData = [
        { placeholder: 'Nom d\'utilisateur', invalidData: 'abc' },
        { placeholder: 'Prénom', invalidData: '12' },
        { placeholder: 'Nom de famille', invalidData: '345' },
        { placeholder: 'Email', invalidData: 'invalidemail.com' },
        { placeholder: 'Numéro de téléphone', invalidData: '12345' },
        { placeholder: 'Entrez votre nouveau mot de passe', invalidData: 'passwor' },
        { placeholder: 'Confirmez votre nouveau mot de passe', invalidData: 'passwo' }

      ];
  
      for (const { placeholder, invalidData } of fieldsData) {
        const input = page.locator(`input[placeholder="${placeholder}"]`);
        await input.fill(invalidData);
      }
  
    
  
      // Vérifier les messages d'erreur
      const errorMessages = [
        'Doit contenir entre 4 et 12 caractères alphanumériques.',
        'Doit contenir entre 3 et 20 caractères alphabétiques.',
        'Doit contenir entre 3 et 20 caractères alphabétiques.',
        'Veuillez entrer une adresse email valide.',
        'Doit contenir 8 chiffres.',
        'Doit contenir plus de 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.',
        'Les mots de passe ne correspondent pas.'
      ];
  
      for (const errorMessage of errorMessages) {
        const errorLocator = page.locator(`text=${errorMessage}`).first();
        await expect(errorLocator).toBeVisible();
      }
    });
    test('Inscription avec un nom d\'utilisateur et un e-mail déjà existants', async ({ page }) => {

      // Remplir chaque champ avec des données valides
      const fieldsData = {
        'Nom d\'utilisateur': 'johndoe10',
        'Prénom': 'John',
        'Nom de famille': 'Doe',
        'Email': 'john.doe10@example.com',
        'Numéro de téléphone': '58959397',
        'Adresse principale': '123 Rue de la Paix',
        'Entrez votre nouveau mot de passe': 'StrongPassword123!',
        'Confirmez votre nouveau mot de passe': 'StrongPassword123!'

      };
  
      for (const [placeholder, data] of Object.entries(fieldsData)) {
        const input = page.locator(`input[placeholder="${placeholder}"]`);
        await input.fill(data);
      }
  
      // Sélectionner le sexe
      const selectSexe = page.locator('select[name="sexe"]');
      await selectSexe.selectOption({ label: 'HOMME' });
  
      // Sélectionner le groupe sanguin
      const selectGroupSanguin = page.locator('select[name="groupSanguin"]');
      await selectGroupSanguin.selectOption({ label: 'A+' });
  


      await page.locator('input[name="photoFile"]').setInputFiles('./tmp/eminem.jpg');

      await page.locator('input[name="cinFile"]').setInputFiles('./tmp/CIN.jpeg');


      await page.getByText('Acceptez les termes et la').click();
      
      await page.getByText('S\'inscrire').click();

      const alertLocator = page.locator('div[role="alert"]');

      // Attendre et vérifier que l'alerte avec le message attendu est visible
      await expect(alertLocator).toBeVisible({ timeout: 10000 });

      // Vérifier le contenu de l'alerte
      await expect(alertLocator).toHaveText("Le nom d'utilisateur ou l'e-mail est déjà utilisé. Veuillez en choisir un autre.");

     
    
    });
  });