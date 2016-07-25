import '../src/lib/setup-mongoose';
import chai from 'chai';
// import chaiHttp from 'chai-http';
import app from '../src/lib/app';
import token from '../src/lib/token';
import User from '../src/models/user';
import supertest from 'supertest';

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
      adminUser.roles.push('admin');
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
        .send(mockTheater)
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
          assert.propertyVal(result, 'name', testData.name);
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
      testData.name = 'newtest';
      request
        .put(`${url}/${testData.id}`)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .send(testData)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, '_id', testData.id);
          assert.propertyVal(result, 'name', testData.name);
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
              assert.propertyVal(getResult, 'msg', 'Resource with this ID not found');
              done();
            });
        });
    });
  });

  describe('show endpoint', () => {
    const url = '/api/show';
    const testData = {
      attendanceTotal: 30,
      dateTime: new Date(),
      admissionsTotal: 400,
      seats: 30,
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
          assert.propertyVal(result, 'seats', testData.seats);
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
      testData.seats = 40;
      request
        .put(`${url}/${testData.id}`)
        .set('authorization', `Bearer ${testAdmin.token}`)
        .send(testData)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          const result = JSON.parse(res.text);
          assert.isObject(result);
          assert.propertyVal(result, '_id', testData.id);
          assert.propertyVal(result, 'seats', testData.seats);
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
              assert.propertyVal(getResult, 'msg', 'Resource with this ID not found');
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
      .delete(`/api/users/${testUser1.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

  after('delete testAdmin', (done) => {
    request
      .delete(`/api/users/${testAdmin.id}`)
      .set('authorization', `Bearer ${testAdmin.token}`)
      .end(done);
  });

});
