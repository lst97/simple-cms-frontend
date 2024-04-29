export interface RegistrationFormParams {
  username: string;
  email: string;
  password: string;
  image?: string;
}

export class RegistrationForm {
  username: string;
  email: string;
  password: string;
  image?: string;

  constructor({ username, email, password, image }: RegistrationFormParams) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.image = image;
  }
}
