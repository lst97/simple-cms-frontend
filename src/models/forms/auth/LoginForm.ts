export interface LoginFormParams {
  email: string;
  password: string;
}

export class LoginForm {
  email: string;
  password: string;

  constructor({ email, password }: LoginFormParams) {
    this.email = email;
    this.password = password;
  }
}
