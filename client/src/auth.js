
auth.$inject=['$rootScope', 'userService','ngDialog', '$state'];

export default function auth($rootScope, userService, ngDialog, $state) {
  $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {


    if(toState.data && toState.data.requiresAuth && !userService.isAuthed()) {

      event.preventDefault();
      const dialog = ngDialog.open({
        template: '<user-auth success="success(response)"></user-auth>',
        plain: true,
        controller: ['$scope', ($scope) => {
          $scope.success = () => {
            dialog.close();
            return $state.go(toState.name, toParams);
          };
        }]
      });
      dialog.closePromise
        .catch(err => alert('Login Failed\n\n' + err));
    }
  });
}
