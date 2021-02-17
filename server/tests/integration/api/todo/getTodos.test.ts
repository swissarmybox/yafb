import supertest from 'supertest';
import { parseCookie } from '../../utils';

describe('GET /api/todos', () => {
  const USER_TABLE = 'users';
  const TODO_TABLE = 'todos';

  beforeEach(async () => {
    // @ts-ignore
    const db = global['infras'].db;

    await db.resetTable(TODO_TABLE);
    await db.resetTable(USER_TABLE);
  });

  it('given no cookie, should fail to get todos', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.get('/api/todos').send();

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

  it('given cookie, should be able to get todos', async () => {
    // Arrange
    const email = 'user@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    // @ts-ignore
    const db = global['infras'].db;

    const user = await db.findOne(USER_TABLE, {
      where: {
        email,
      },
    });

    await db.insertOne(TODO_TABLE, {
      data: {
        title: 'Todo 1',
        description: 'Todo 1',
        user_id: user.id,
      },
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .get('/api/todos')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(200);
    expect(res2.body.status).toBe('success');
    expect(res2.body.data.length).toEqual(1);
    expect(res2.body.data[0]).toEqual(
      expect.objectContaining({
        id: 1,
        title: 'Todo 1',
        description: 'Todo 1',
        done: false,
      }),
    );
  });
});
