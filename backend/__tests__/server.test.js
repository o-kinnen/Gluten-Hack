const request = require('supertest');
const http = require('http');
const app = require('../app');  // Assurez-vous que le chemin vers app.js est correct
const server = require('../server');  // Assurez-vous que le chemin vers server.js est correct

describe('Test d\'intégration pour server.js', () => {

  let testServer;

  beforeAll((done) => {
    testServer = server.listen(done); // Démarre le serveur avant les tests
  });

  afterAll((done) => {
    testServer.close(done); // Ferme le serveur après les tests
  });

  it('devrait répondre à une requête GET sur la racine avec un statut 404', async () => {
    const response = await request(testServer).get('/');
    expect(response.status).toBe(404);
  });

  it('devrait lancer le serveur et écouter sur le bon port', (done) => {
    const port = app.get('port');
    expect(port).toBe(parseInt(process.env.PORT || '3000', 10));

    testServer.on('listening', () => {
      const address = testServer.address();
      const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
      expect(bind).toContain(port);
      done();
    });
  });

  it('devrait gérer l\'erreur EADDRINUSE (adresse déjà utilisée)', (done) => {
    const server2 = http.createServer(app);

    server2.on('error', (error) => {
      expect(error.code).toBe('EADDRINUSE');
      done();
    });

    server2.listen(app.get('port'), () => {
      server2.close();
    });
  });

  it('devrait gérer l\'erreur EACCES (privilèges élevés requis)', (done) => {
    const server3 = http.createServer(app);

    server3.on('error', (error) => {
      expect(error.code).toBe('EACCES');
      done();
    });

    server3.listen(1);  // Écoute sur le port 1, qui nécessite des privilèges élevés
  });
});
