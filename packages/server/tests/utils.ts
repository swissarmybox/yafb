export function parseCookie(header: { [key: string]: any }): string {
  const setCookie: string[] = header['set-cookie'] || [];
  if (setCookie.length === 0) {
    return '';
  }

  const jwtCookieString = setCookie.find((el: string) => {
    if (el.indexOf('jwt') === 0) {
      return el;
    }
  });

  if (!jwtCookieString) {
    return '';
  }

  const cookieArr = jwtCookieString
    .split(';')
    .map((el: string) => el.split('='))
    .filter((el: string[]) => el.length === 2)
    .find((el: string[]) => el[0] === 'jwt');

  if (!cookieArr) {
    return '';
  }

  return cookieArr[1];
}
