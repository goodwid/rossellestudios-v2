configRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$transitionsProvider'];
// const view = ['$stateParams', sP => {
//   return sP.view;
// }];

export default function configRoutes($stateProvider, $urlRouterProvider, $transitionsProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        header: { component: 'pageTitle' },
        main: { component: 'something' }
      }
    });
  $urlRouterProvider.otherwise('/');
  $transitionsProvider.onStart({
    to: state => !!(state.data && state.data.requiresAuth)
  }, ($state) => {
    $state.$to().name;
    // console.log(name);
  });
}

// onStart.$inject = ['userService'];
//
// function onStart(userService) {
//   return userService.isAuthed();
// }
