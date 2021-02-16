import supertest from 'supertest';
import { parseCookie } from '../utils';

describe('POST /auth/logout', () => {
  const USERTABLE = 'users';

  beforeEach(async () => {
    // @ts-ignore
    await global['infras'].db.resetTable(USERTABLE);
  });

  it('given no cookie, should successfully logout', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.post('/auth/logout').send();

    // Assert
    const jwtCookie = parseCookie(res.header);
    expect(jwtCookie.length).toBe(0);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      data: null,
    });
  });
});
