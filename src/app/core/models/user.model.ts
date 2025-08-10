export interface User {
  id: number;
  name?: string;
  email: string;
  role: string;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export const DEFAULT_AVATAR = 'assets/avatar-placeholder.png'; 