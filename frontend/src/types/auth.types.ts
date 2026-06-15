import { User } from "lucide-react";

export interface User {
  id : string;
  name : string;
  email : string;
  avatar?: string;
}
export interface AuthState {
  user : User | null;
  isAuthenticated : boolean;

  login: (user: User) => void ;
  logout: () => void;
}

