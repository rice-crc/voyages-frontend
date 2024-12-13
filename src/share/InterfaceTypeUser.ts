export interface User {
    email: string;
    userName: string;
    token: string;
}

export interface AuthState {
    user: User | null;
}
