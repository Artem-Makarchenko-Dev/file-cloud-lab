export interface AuthUser {
  id: number;
  email: string;
  roleId: number;
  permissions: string[];
}
