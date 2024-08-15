const User = require('../models/userModel');
const pool = require('../utils/database');

jest.mock('../utils/database');

describe('User Model', () => {

  describe('getAll', () => {
    it('devrait retourner tous les utilisateurs', async () => {
      const mockUsers = [
        { id_user: 1, name: 'John Doe', email: 'john@example.com', password: 'hashedpassword' },
        { id_user: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'hashedpassword' },
      ];
      pool.query.mockResolvedValue({ rows: mockUsers });

      const result = await User.getAll();

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM public."User"');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findByEmail', () => {
    it('devrait retourner un utilisateur basé sur l’email', async () => {
      const mockUser = { id_user: 1, name: 'John Doe', email: 'john@example.com', password: 'hashedpassword' };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.findByEmail('john@example.com');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM public."User" WHERE email = $1', ['john@example.com']);
      expect(result).toEqual(mockUser);
    });

    it('devrait retourner undefined si aucun utilisateur n’est trouvé', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await User.findByEmail('unknown@example.com');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM public."User" WHERE email = $1', ['unknown@example.com']);
      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('devrait retourner un utilisateur basé sur l’id', async () => {
      const mockUser = { id_user: 1, name: 'John Doe', email: 'john@example.com', password: 'hashedpassword' };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.findById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM public."User" WHERE id_user = $1', [1]);
      expect(result).toEqual(mockUser);
    });

    it('devrait retourner undefined si aucun utilisateur n’est trouvé', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await User.findById(999);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM public."User" WHERE id_user = $1', [999]);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('devrait créer un nouvel utilisateur et le retourner', async () => {
      const mockUser = { name: 'John Doe', email: 'john@example.com', password: 'hashedpassword' };
      const insertedUser = { id_user: 1, ...mockUser };
      pool.query.mockResolvedValue({ rows: [insertedUser] });

      const result = await User.create(mockUser);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO public."User" (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [mockUser.name, mockUser.email, mockUser.password]
      );
      expect(result).toEqual(insertedUser);
    });

    it('devrait lancer une erreur si la création échoue', async () => {
      const mockUser = { name: 'John Doe', email: 'john@example.com', password: 'hashedpassword' };
      const error = new Error('Test error');
      pool.query.mockRejectedValue(error);

      await expect(User.create(mockUser)).rejects.toThrow('Test error');
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO public."User" (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [mockUser.name, mockUser.email, mockUser.password]
      );
    });
  });

  describe('updatePassword', () => {
    it('devrait mettre à jour le mot de passe d’un utilisateur et le retourner', async () => {
      const mockUser = { id_user: 1, name: 'John Doe', email: 'john@example.com', password: 'newhashedpassword' };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.updatePassword('john@example.com', 'newhashedpassword');

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE public."User" SET password = $1 WHERE email = $2 RETURNING *',
        ['newhashedpassword', 'john@example.com']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('devrait supprimer un utilisateur et le retourner', async () => {
      const mockUser = { id_user: 1, name: 'John Doe', email: 'john@example.com', password: 'hashedpassword' };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.delete(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM public."User" WHERE id_user = $1 RETURNING *', [1]);
      expect(result).toEqual(mockUser);
    });
  });
});
