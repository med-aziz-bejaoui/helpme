import { test, expect } from '@playwright/test';

const fields = [
  'Nom d\'utilisateur',
  'Prénom',
  'Nom de famille',
  'Email',
  'Numéro de téléphone',
  'Adresse principale',
  'Entrez votre nouveau mot de passe'
];
test.beforeEach(async ({ page }) => {
  await page.goto('');

});
test.describe('login', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('link', { name: 'Connexion' }).click();
    await expect(page).toHaveURL(`/auth/login`);
  });
  test('Connexion réussie avec des identifiants valides', async ({ page }) => {
    // create a new todo locator
    await page.getByPlaceholder('Entrez votre nom d\'utilisateur').fill('Jihedadmin');
    await page.getByPlaceholder('Entrez votre mot de passe').fill('Jihed123?');
    await page.getByRole('button', { name: 'Connexion' }).click();
    await expect(page).toHaveURL(`/dashboard`);

  })
  test('Échec de connexion avec un mot de passe incorrect', async ({ page }) => {
    // create a new todo locator
    await page.getByPlaceholder('Entrez votre nom d\'utilisateur').fill('Jihedadmin');
    await page.getByPlaceholder('Entrez votre mot de passe').fill('invalidPassword');
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeEnabled();

    await page.getByRole('button', { name: 'Connexion' }).click();

    const errorMessageElement = await page.locator('div.text-danger');
    
    // Vérification du contenu de l'élément
    const errorMessage = await errorMessageElement.textContent();
    await expect(errorMessage).toContain('Le nom de l\'utilisateur ou le mot de passe est incorrect');

  })
  test('Échec de connexion avec un champ mot de passe vide', async ({ page }) => {
    // create a new todo locator
    await page.getByPlaceholder('Entrez votre mot de passe').click();

    await page.getByPlaceholder('Entrez votre nom d\'utilisateur').fill('Jihedadmin');
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeDisabled();

    const errorMessageElement = await page.locator('div.text.text-danger.mt-1.ng-star-inserted');

    // Obtenir le texte de l'élément
    const errorMessage = await errorMessageElement.textContent();
  
    // Vérifier que le texte de l'élément est celui attendu
    await expect(errorMessage).toContain('Le mot de passe est requis');    
    // Vérification du contenu de l'élément
    

  })
  test('Échec de connexion avec un champ nom d\'utilisateur vide', async ({ page }) => {
    // create a new todo locator
    await page.getByPlaceholder('Entrez votre nom d\'utilisateur').click();
    await page.getByPlaceholder('Entrez votre mot de passe').fill("Jihed123?");
    await page.locator('span').filter({ hasText: 'Connexion' }).click();
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeDisabled();

    const errorMessageElement = await page.locator('div.text.text-danger.mt-1.ng-star-inserted');

    // Obtenir le texte de l'élément
    const errorMessage = await errorMessageElement.textContent();
  
    // Vérifier que le texte de l'élément est celui attendu
    await expect(errorMessage).toContain('Le nom d\'utilisateur est requis');    
    // Vérification du contenu de l'élément
    

  })})
  test.describe('signup', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'Créer Compte' }).click();
      await expect(page).toHaveURL(`/signup`);
    });
    test.only('Inscription avec des données valides', async ({ page }) => {
      page.setDefaultTimeout(3000000);

      // Remplir chaque champ avec des données valides
      const fieldsData = {
        'Nom d\'utilisateur': 'johndoe9',
        'Prénom': 'John',
        'Nom de famille': 'Doe',
        'Email': 'john.doe9@example.com',
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
  


      await page.locator('input[name="photoFile"]').setInputFiles('D:\\eminem-a-k-a-marshall-bruce-mathers-iii-attends-a-ceremony-news-photo-1698936282.jpg');

      await page.locator('input[name="cinFile"]').setInputFiles('D:\\images.jpeg');


      await page.getByText('Acceptez les termes et la').click();
      
      await page.getByText('S\'inscrire').click();

      await expect(page).toHaveURL(`/Plans`);
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

      await page.check('input#enableStripePass');

      await page.locator('input[id="phoneNumber"]').fill(fieldsData['Numéro de téléphone']);

  // Sélectionner le bouton par son attribut data-testid
      const subscribeButton = page.locator('[data-testid="hosted-payment-submit-button"]');
  // Cliquer sur le bouton
      await subscribeButton.click();
      await expect(page).toHaveURL(`/auth/login`);

      /*const submitButton = page.locator('a.login100-form-btn.btn-primary:has-text("S\'inscrire")');
      await submitButton.click();*/
  
      // Vérifier la réussite de l'inscription (vous devrez ajuster cette vérification en fonction de votre site)
      /*const successMessageLocator = page.locator('text="Inscription réussie!"');
      await expect(successMessageLocator).toBeVisible();*/
    });
    test('Vérifier les champs obligatoires', async ({ page }) => {

  
      for (const placeholder of fields) {
        const input = page.locator(`input[placeholder="${placeholder}"]`);
        await input.fill('a'); // Remplir avec une chaîne non vide
      }
  
      // Supprimer le contenu de chaque champ
      for (const placeholder of fields) {
        const input = page.locator(`input[placeholder="${placeholder}"]`);
        await input.fill(''); // Supprimer le contenu
      }

      const errorMessages = [
        'Le nom d\'utilisateur est requis.',
        'Le prénom est requis.',
        'Le nom de famille est requis.',
        'L\'email est requis.',
        'Le numéro de téléphone est requis.',
        'Adresse est requise.',
        'Le mot de passe est requis.'
      ];
  
      for (const errorMessage of errorMessages) {
        const errorLocator = page.locator(`text=${errorMessage}`);
        await expect(errorLocator).toBeVisible();
      }
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
  });










