import template from './userAuth.html';

export default {
  template,
  bindings: {
    success: '&'
  },
  controller
};

function controller() {
  this.action = 'signin';
}
