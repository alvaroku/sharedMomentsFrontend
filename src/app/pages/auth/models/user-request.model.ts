export interface UserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  dateOfBirth: Date;
  roleId?: string;
}

