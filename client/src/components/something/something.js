import template from './something.html';
import style from './something.scss';

export default {
  template,
  controller() {
    this.style = style;
  },
};
