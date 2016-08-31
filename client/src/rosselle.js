import angular from 'angular';
import router from 'angular-ui-router';
import components from './components';
import services from './services';
import ngDialog from 'ng-dialog';
import 'ng-dialog/css/ngDialog.css';
import 'ng-dialog/css/ngDialog-theme-default.css';
import 'angular-ui-router/release/stateEvents';

const app = angular.module('photoAlbum', [
  router,
  angular.module('ui.router.state.events').name,
  ngDialog,
  components,
  services]);

export default app;
