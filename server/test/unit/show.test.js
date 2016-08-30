const Show = require('../../src/models/show');
const mongoose = require('mongoose');

describe('Show model', () => {
  it('requires name', done => {
    const show = new Show();
    show.validate()
      .then(() => done('expected error'))
      .catch(() => done());
  });

  it('validates with required fields', done => {
    const show = new Show({title: 'Test', year:2010, location:'Portland'});
    show.validate()
    .then(done)
    .catch(done);
  });

  after('remove mongoose model', () => {
    delete mongoose.connection.models['Show'];
  });

});
