import supertest from 'supertest';
import { parseCookie } from '../../utils';

describe('GET /auth/profile', () => {
  const USERTABLE = 'users';

  beforeEach(async () => {
    // @ts-ignore
    await global['infras'].db.resetTable(USERTABLE);
  });

  it('given no cookie, should fail to get profile', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.get('/auth/profile').send();

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('failure');
    expect(res.body.error).toEqual({
      code: 400,
      name: 'TOKEN_INVALID_ERROR',
      message: 'JWT token not found',
      isOperational: true,
    });
  });

  it('given cookie, should be able to get profile', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);
    const res = await request.post('/auth/register').send({
      email: 'user@email.com',
      password: '123456',
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .get('/auth/profile')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(200);
    expect(res2.body.status).toBe('success');
    expect(res2.body.data).toEqual(
      expect.objectContaining({
        email: 'user@email.com',
        role: 'user',
      }),
    );
  });
});
