export interface IAuthContext {
  token: string | null;
  signIn: (newToken: string) => void;
  signOut: () => void;
}