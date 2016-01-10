let app = require('./app');
let request = require('supertest');


request(app)
    .get('/')
    .expect(200)
    .end((err) => {
      if (err) throw err;
      console.log('Done')
    });


describe('Requests to the root path', () => {
  it('Returns a 200 status code', (done) => {
    request(app)
        .get('/')
        .expect(200)
        .end((err) => {
          if (err) throw err;
          done();
        });
  })
});
