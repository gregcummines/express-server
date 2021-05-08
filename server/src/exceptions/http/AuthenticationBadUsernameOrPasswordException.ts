import HttpException from './HttpException';

class AuthenticationBadUsernameOrPasswordException extends HttpException {
  constructor() {
    super(401, 'Incorrect username or password');
  }
}

export default AuthenticationBadUsernameOrPasswordException;