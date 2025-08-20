import { registerUser, loginUser, verifyToken } from '../../../src/lambdas/auth/auth.service';

describe('Auth Service with DynamoDB', () => {
  it('should register and login user', async () => {
    const user = await registerUser(
      'testuser',
      'password123',
      'Test User',
      'AuthorName',
      'test@example.com',
    );
    expect(user.username).toBe('testuser');

    const token = await loginUser('testuser', 'password123');
    expect(typeof token).toBe('string');

    const decoded: any = verifyToken(token);
    expect(decoded.username).toBe('testuser');
    expect(decoded.publishName).toBe('AuthorName');
  });

  it('should fail login with wrong password', async () => {
    await expect(loginUser('testuser', 'wrongpassword')).rejects.toThrow();
  });
});
