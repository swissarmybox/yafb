import morgan from 'morgan';
import json from 'morgan-json';

export function createHTTPLogger(httpLoggerFn: (meta: any) => void) {
  const format = json({
    method: ':method',
    url: ':url',
    status: ':status',
    contentLength: ':res[content-length]',
    responseTime: ':response-time',
  });

  return morgan(format, {
    stream: {
      write: (message) => {
        const { method, url, status, contentLength, responseTime } = JSON.parse(
          message,
        );

        httpLoggerFn({
          timestamp: new Date().toString(),
          method,
          url,
          status,
          contentLength,
          responseTime: responseTime,
        });
      },
    },
  });
}
