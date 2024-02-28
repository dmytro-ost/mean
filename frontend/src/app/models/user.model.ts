export interface User {
  email: string;
  password: string;
  role: string;
}

export interface UserInfo {
  _id: string;
  role: string;
  email: string;
  created_date: string;
}

export interface UserRole {
  role: string;
  description: string;
}
