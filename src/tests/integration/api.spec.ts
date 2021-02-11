import request from 'supertest';
import app from '@server';

describe('GET /random-url', () => {
  it('should return 404', done => {
    request(app).get('/random-url').expect(404, done);
  });
});
