import supertest from 'supertest';
import { parseCookie } from '../../../utils';

describe('POST /api/todos', () => {
  const USER_TABLE = 'users';
  const TODO_TABLE = 'todos';

  beforeEach(async () => {
    // @ts-ignore
    const db = global['infras'].db;

    await db.resetTable(TODO_TABLE);
    await db.resetTable(USER_TABLE);
  });

  it('given no cookie, should fail to create todo', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.post('/api/todos').send();

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

  it('given cookie but wrong todo data, should fail to create todo', async () => {
    // Arrange
    const email = 'user@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .post('/api/todos')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send({
        titlexyz: 'Todo 1',
        description: 'Todo 1',
      });

    // Assert
    expect(res2.status).toBe(400);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 400,
      name: 'INVALID_PARAMETER_ERROR',
      message: '"title" is required',
      isOperational: true,
    });
  });

  it('given cookie, should be able to create todo', async () => {
    // Arrange
    const email = 'user@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .post('/api/todos')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send({
        title: 'Todo 1',
        description: 'Todo 1',
      });

    // Assert
    expect(res2.status).toBe(200);
    expect(res2.body).toEqual({
      status: 'success',
      data: 1,
    });

    // @ts-ignore
    const db = global['infras'].db;

    const user = await db.findOne(USER_TABLE, {
      where: {
        email,
      },
    });

    const todo = await db.findOne(TODO_TABLE, {
      where: {
        id: res2.body.data,
      },
    });

    expect(todo).toEqual(
      expect.objectContaining({
        title: 'Todo 1',
        description: 'Todo 1',
        user_id: user.id,
        done: false,
      }),
    );
  });
});
