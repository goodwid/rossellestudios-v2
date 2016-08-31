userService.$inject = ['tokenService', '$http', 'apiUrl'];

export default function userService(token, $http, apiUrl) {

  const current = token.get();
  if (current) {
    $http.get(`${apiUrl}/verify`)
      .catch(() => token.remove());
  }

  return {
    isAuthed() {
      return !!token.get();
    },
    logout() {
      token.remove();
    },
    signin(credentials){
      return $http.post(`${apiUrl}/signin`, credentials)
        .then(result => {
          token.set(result.data.token);
        })
        .catch(err => {
          throw err.data;
        });
    },
    signup(credentials) {
      return $http.post(`${apiUrl}/signup`, credentials)
        .then(result => {
          token.set(result.data.token);
        })
        .catch(err => {
          throw err.data;
        });
    }
  };
}
