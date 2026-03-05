import { api } from "../config/api";

export const authService = {
  async login(email: string, senha: string): Promise<string> {
    const response = await api.post('/login', { email, senha });
    console.log(response);
      console.log(email, senha);
    return response.data.token;
  }
};