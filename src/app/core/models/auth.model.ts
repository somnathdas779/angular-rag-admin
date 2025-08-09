export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}


export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  token: string;
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
} 