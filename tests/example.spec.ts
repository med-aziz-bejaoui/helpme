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
    test('Inscription avec des données valides', async ({ page }) => {
      page.setDefaultTimeout(3000000);

      // Remplir chaque champ avec des données valides
      const fieldsData = {
        'Nom d\'utilisateur': 'johndoe16',
        'Prénom': 'John',
        'Nom de famille': 'Doe',
        'Email': 'john.doe16@example.com',
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
  


      await page.locator('input[name="photoFile"]').setInputFiles('../photos/eminem.jpg');

      await page.locator('input[name="cinFile"]').setInputFiles('../photos/CIN.jpeg');


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

      await page.check('input#enableStripePass');

      await page.locator('input[id="phoneNumber"]').fill(fieldsData['Numéro de téléphone']);

  // Sélectionner le bouton par son attribut data-testid
      const subscribeButton = page.locator('[data-testid="hosted-payment-submit-button"]');
  // Cliquer sur le bouton
      await subscribeButton.click();

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
    test.only('Inscription avec un nom d\'utilisateur et un e-mail déjà existants', async ({ page }) => {

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
  


      await page.locator('input[formcontrolname="photoFile"]').setInputFiles('../photos/eminem.jpg');

      await page.locator('input[name="cinFile"]').setInputFiles('../photos/CIN.jpeg');


      await page.getByText('Acceptez les termes et la').click();
      
      await page.getByText('S\'inscrire').click();

      const alertLocator = page.locator('div[role="alert"]');

      // Attendre et vérifier que l'alerte avec le message attendu est visible
      await expect(alertLocator).toBeVisible({ timeout: 10000 });

      // Vérifier le contenu de l'alerte
      await expect(alertLocator).toHaveText("Le nom d'utilisateur ou l'e-mail est déjà utilisé. Veuillez en choisir un autre.");

     
    
    });
  });
  test.describe('Tests de la liste des utilisateurs', () => {
    test.beforeEach(async ({ page }) => {
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
  

  test.describe('Tests de l\'interface d\'ajout d\'un agent CRM', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'Connexion' }).click();
      await expect(page).toHaveURL(`/auth/login`);
      await page.getByPlaceholder('Entrez votre nom d\'utilisateur').fill('Jihedadmin');
      await page.getByPlaceholder('Entrez votre mot de passe').fill('Jihed123?');
      await page.getByRole('button', { name: 'Connexion' }).click();
      await expect(page).toHaveURL(`/dashboard`);
      await page.click("text=Gestion Utilisateurs");
      await page.click('a[href="/table/data-table"]');
      await page.click("text=Créer compte Agent CRM")
    

    });


    test('Ajouter un nouvel agent CRM', async ({ page }) => {
      const username = 'agen16';
      const email = 'emailagent16@example.com';
      const mot_de_passe = 'Forzalaroma12@';
      const nom = 'bejaoui';
      const prenom = 'aziz';
      const adresse = 'Tunis';
      const num_tel = '58959397';




      // Remplir le formulaire
      await page.fill('input[placeholder="Nom d\'Utilisateur"]', username);
      await page.fill('input[placeholder="Email"]', email);
      await page.fill('input[placeholder="Entrez Mot de passe"]', mot_de_passe);
      await page.fill('input[placeholder="Confirmez mot de passe"]', mot_de_passe);
      await page.fill('input[placeholder="Nom"]', nom);
      await page.fill('input[placeholder="Prénom"]', prenom);
      await page.fill('input[placeholder="adresse"]', adresse);
      await page.fill('input[placeholder="Numéro de téléphone"]', num_tel);
    

      // Soumettre le formulaire
      page.click("div.container-login100-form-btn a.login100-form-btn.btn-primary");

  
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

      const userName = await userRows.nth(userCount-1).locator('.cdk-column-username').innerText();
      const userEmail = await userRows.nth(userCount-1).locator('.cdk-column-email').innerText();
      if (userName === username && userEmail === email) {
        userFound = true;
        }
      expect(userFound).toBeTruthy();
    });


    test('Ajouter un agent CRM déjà existant et vérifier l\'alerte d\'erreur', async ({ page }) => {

  
      // Remplir le formulaire avec un agent déjà existant
      const username = 'agen15';
      const email = 'emailagent15@example.com';
      const mot_de_passe = 'Forzalaroma12@';
      const nom = 'bejaoui';
      const prenom = 'aziz';
      const adresse = 'Tunis';
      const num_tel = '58959397';
  
      await page.fill('input[placeholder="Nom d\'Utilisateur"]', username);
      await page.fill('input[placeholder="Email"]', email);
      await page.fill('input[placeholder="Entrez Mot de passe"]', mot_de_passe);
      await page.fill('input[placeholder="Confirmez mot de passe"]', mot_de_passe);
      await page.fill('input[placeholder="Nom"]', nom);
      await page.fill('input[placeholder="Prénom"]', prenom);
      await page.fill('input[placeholder="adresse"]', adresse);
      await page.fill('input[placeholder="Numéro de téléphone"]', num_tel);
  
      // Soumettre le formulaire
      page.click("div.container-login100-form-btn a.login100-form-btn.btn-primary");
  
      // Vérifier que l'alerte d'erreur s'affiche
      const errorMessage = page.locator('div[role="alert"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText("Le nom d'utilisateur ou l'e-mail est déjà utilisé. Veuillez en choisir un autre.");
    });
  });

  test.describe('Tests de la création d\'un compte admin', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'Connexion' }).click();
      await expect(page).toHaveURL(`/auth/login`);
      await page.getByPlaceholder('Entrez votre nom d\'utilisateur').fill('Jihedadmin');
      await page.getByPlaceholder('Entrez votre mot de passe').fill('Jihed123?');
      await page.getByRole('button', { name: 'Connexion' }).click();
      await expect(page).toHaveURL(`/dashboard`);
      await page.click("text=Gestion Utilisateurs");
      await page.click('a.slide-item[href="/charts/chartlist"]');

    });
  
    test('Création d\'un compte admin avec des données valides', async ({ page }) => {
      const username = 'admin1';
      const email = 'admin1@example.com';
      const password = 'Forzalaroma12@';
      const firstName = 'John';
      const lastName = 'Doe';
      const address = 'Tunis';
      const phoneNumber = '58959397';
  
      // Remplir les champs du formulaire avec des données valides
      await page.fill('input[placeholder="Nom d\'Utilisateur"]', username);
      await page.fill('input[placeholder="Email"]', email);
      await page.fill('input[placeholder="Entrez Mot de passe"]', password);
      await page.fill('input[placeholder="Confirmez mot de passe"]', password);
      await page.fill('input[placeholder="Nom"]', firstName);
      await page.fill('input[placeholder="Prénom"]', lastName);
      await page.fill('input[placeholder="adresse"]', address);
      await page.fill('input[placeholder="Numéro de téléphone"]', phoneNumber);
  
      // Soumettre le formulaire
      page.click("div.container-login100-form-btn a.login100-form-btn.btn-primary");
  
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
      const username = 'admin1';
      const email = 'admin1@example.com';
      const password = 'Forzalaroma12@';
      const firstName = 'John';
      const lastName = 'Doe';
      const address = 'Tunis';
      const phoneNumber = '58959397';
  
      // Remplir les champs du formulaire avec des données déjà existantes
      await page.fill('input[placeholder="Nom d\'Utilisateur"]', username);
      await page.fill('input[placeholder="Email"]', email);
      await page.fill('input[placeholder="Entrez Mot de passe"]', password);
      await page.fill('input[placeholder="Confirmez mot de passe"]', password);
      await page.fill('input[placeholder="Nom"]', firstName);
      await page.fill('input[placeholder="Prénom"]', lastName);
      await page.fill('input[placeholder="adresse"]', address);
      await page.fill('input[placeholder="Numéro de téléphone"]', phoneNumber);
  
      // Soumettre le formulaire
      await page.click("div.container-login100-form-btn a.login100-form-btn.btn-primary");
  
      // Attendre l'apparition de l'alerte indiquant que le compte existe déjà
      await page.waitForSelector('div[role="alert"]');
  
      // Vérifier si l'alerte de compte déjà existant s'affiche avec le bon message
      const alertMessage = await page.innerText('div[role="alert"]');
      expect(alertMessage).toContain('Le nom d\'utilisateur ou l\'e-mail est déjà utilisé. Veuillez en choisir un autre.');
  });
  
    // (Facultatif) Ajoutez d'autres cas de test pour gérer différents scénarios
  });










