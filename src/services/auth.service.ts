import { api } from "../config/api";

export const authService = {
  async login(login: string, senha: string): Promise<string> {
    const response = await api.post('/login', { login, senha });
    console.log(response);
    return response.data.token;
  }
};