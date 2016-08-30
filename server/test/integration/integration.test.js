require ('../../src/lib/setup-mongoose');
const chai = require('chai');
const app = require('../../src/lib/app');
const token = require('../../src/lib/token');
const User = require('../../src/models/user');
const supertest = require('supertest');

// chai.use(chaiHttp);

const assert = chai.assert;
// const request = chai.request(app);
const request = supertest(app);


const testAdmin = {
  username: 'testAdmin',
  password: 'chai',
};

const testUser1 = {
  username: 'testUser1',
  password: 'test1',
};

const mockShow = {
  title: 'testShow'
};


describe('integration', () => {
  describe('user creation', () => {
    before('create testAdmin user', (done) => {
      const adminUser = new User(testAdmin);
      adminUser.generateHash(adminUser.password);
      return adminUser
        .save()
        .then(newUser => {
          token.sign(newUser);
          testAdmin.id = newUser.id;
          done();
        });
    });

    before('get token for testAdmin', (done) => {
      request
        .post('/signin')
        .send(testAdmin)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          testAdmin.token = result.returnedToken;
          done();
        });
    });

    it('create testUser1', (done) => {
      request
        .post('/signup')
        .send(testUser1)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          assert.property(result, 'returnedToken');
          assert.property(result, 'id');
          testUser1.token = result.returnedToken;
          testUser1.id = result.id;
          done();
        });
    });
  });

  describe('artwork endpoint', () => {
    const url = '/api/artwork';
    const testData = {
      title: 'testTitle',
      url: 'testUrl',
    };

    before('creating mock show entry', (done) => {
      request
        .post('/api/show')
        .set('authorization', `Bearer ${testAdmin.token}`)
        .send(mockShow)
        .end((err, res) => {
          if (err) return done(err);
          const result = JSON.parse(res.text);
          mockShow.id = result._id;
          testData.show = result._id;
          done();
        });
    });

    it(`POST to ${url} completes with id`, (done) => {
      request
        .post(url)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .send(testData)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          testData.id = result._id; // eslint-disable-line
          assert.property(result, '_id');
          assert.propertyVal(result, 'title', testData.title);
          done();
        });
    });

    it(`GET to ${url}/:id shows new data`, (done) => {
      request
        .get(`${url}/${testData.id}`)
        .expect('Content-type', /json/)
        .expect(/_id/)
        .expect(200, done);
        // .end((err, res) => {
        //   assert.equal(res.statusCode, 200);
        //   const result = JSON.parse(res.text);
        //   assert.isObject(result);
        //   assert.propertyVal(result, '_id', testData.id);
        //   done();
        // });
    });

    it(`PUT to ${url}/:id returns modified data`, (done) => {
      testData.title = 'newtest';
      request
        .put(`${url}/${testData.id}`)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .send(testData)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, '_id', testData.id);
          assert.propertyVal(result, 'title', testData.title);
          done();
        });
    });

    it(`DELETE to ${url}/:id by authorized user completes`, (done) => {
      request
        .delete(`${url}/${testData.id}`)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          assert.propertyVal(result, '_id', testData.id);
          request
            .get(`${url}/${testData.id}`)
            .end((err, res) => { // eslint-disable-line
              const getResult = JSON.parse(res.text);
              assert.propertyVal(getResult, 'msg', 'No artwork found');
              done();
            });
        });
    });
  });

  describe('show endpoint', () => {
    const url = '/api/show';
    const testData = {
      title: 'testShow'
    };

    it(`POST to ${url} completes with id`, (done) => {
      request
        .post(url)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .send(testData)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          testData.id = result._id; // eslint-disable-line
          assert.property(result, '_id');
          assert.propertyVal(result, 'title', testData.title);
          done();
        });
    });

    it(`GET to ${url}/:id shows new data`, (done) => {
      request
        .get(`${url}/${testData.id}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, '_id', testData.id);
          done();
        });
    });

    it(`PUT to ${url}/:id returns modified data`, (done) => {
      testData.title = 'foobar';
      request
        .put(`${url}/${testData.id}`)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .send(testData)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, '_id', testData.id);
          assert.propertyVal(result, 'title', testData.title);
          done();
        });
    });

    it(`DELETE to ${url}/:id by authorized user completes`, (done) => {
      request
        .delete(`${url}/${testData.id}`)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .end((err, res) => {
          const result = JSON.parse(res.text);
          assert.propertyVal(result, '_id', testData.id);
          request
            .get(`${url}/${testData.id}`)
            .end((err, res) => { // eslint-disable-line
              const getResult = JSON.parse(res.text);
              assert.propertyVal(getResult, 'msg', 'No show found');
              done();
            });
        });
    });

  }); // describe

  after('delete mockShow', done => {
    request
      .delete(`/api/show/${mockShow.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

  after('delete testuser1', (done) => {
    request
      .delete(`/users/${testUser1.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

  after('delete testAdmin', (done) => {
    request
      .delete(`/users/${testAdmin.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

});
