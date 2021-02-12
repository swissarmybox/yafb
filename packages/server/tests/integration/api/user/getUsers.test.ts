import supertest from 'supertest';
import { parseCookie } from '../../../utils';

describe('GET /api/users', () => {
  const USERTABLE = 'users';
  const ADMIN_ROLE = 1;
  const USER_ROLE = 2;

  beforeEach(async () => {
    // @ts-ignore
    await global['infras'].db.resetTable(USERTABLE);
  });

  it('given no cookie, should fail to get users', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.get('/api/users').send();

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

  it('given cookie but incorrect role, should fail to get users', async () => {
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
      .get('/api/users')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(401);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 401,
      name: 'UNAUTHORIZED_ERROR',
      message: 'User is not authorized',
      isOperational: true,
    });
  });

  it('given cookie and correct role, should be able to get users', async () => {
    // Arrange
    const email = 'admin@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    // @ts-ignore
    const db = global['infras'].db;
    const admin = await db.findOne(USERTABLE, {
      where: {
        email,
      },
    });

    await db.updateOne(USERTABLE, {
      where: {
        id: admin.id,
      },
      data: {
        role_id: ADMIN_ROLE,
      },
    });

    await db.insertOne(USERTABLE, {
      data: {
        email: 'hello@world.com',
        role_id: USER_ROLE,
        salt: 'abcde',
        hashed_password: 'fghij',
      },
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .get('/api/users')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(200);
    expect(res2.body.status).toBe('success');
    expect(res2.body.data.length).toEqual(2);
    expect(res2.body.data[0]).toEqual(
      expect.objectContaining({
        id: 1,
        email: 'admin@email.com',
        role: 'admin',
      }),
    );
    expect(res2.body.data[1]).toEqual(
      expect.objectContaining({
        id: 2,
        email: 'hello@world.com',
        role: 'user',
      }),
    );
  });
});
