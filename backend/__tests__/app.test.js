const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Test d\'intégration pour l\'application', () => {

  let token;

  beforeAll(() => {
    // Générer un token JWT valide pour les tests d'authentification
    token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('devrait gérer une requête POST à /users/register', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({ name: 'Test', email: 'newuser@example.com', password: 'password123' });
    
    console.log(response.body); // Vérifier la réponse pour le débogage
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Utilisateur enregistré avec succès');
  });

  it('devrait gérer une requête POST à /products/add', async () => {
    const response = await request(app)
      .post('/products/add')
      .set('Cookie', `token=${token}`)  // Ajouter le token JWT
      .send({ name: 'TestProduct', code_barre: '123456789', gluten: false });
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('devrait gérer une requête GET à /products/check/:barcode', async () => {
    const response = await request(app)
      .get('/products/check/123456789')
      .set('Cookie', `token=${token}`);  // Ajouter le token JWT
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'TestProduct');
  });

  it('devrait gérer une requête GET à /api/restaurants', async () => {
    const response = await request(app)
      .get('/api/restaurants?location=Brussels');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('restaurants');
  });

  // Ajoutez d'autres tests d'intégration selon vos besoins
});


