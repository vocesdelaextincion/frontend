import { Plan, Role } from './enums';

export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  plan: Plan;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
