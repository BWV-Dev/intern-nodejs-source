export class UserModel {
  id: number;
  name: string;
  userName: string;
  email: string;
  password: string;
  role: number;
  status: string;
  lastLoginAt?: Date;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}
