import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_URL_API || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    },
});

export const buscarCondicoesPagamento = async () => {
  const response = await api.get('/condicoes/PAGAMENTO'); // Ajuste para o seu endpoint real no Java
  return response.data;
};


api.interceptors.request.use(
    (config) => {
       
        const rotasPublicas = ['/login', '/usuarios/cadastrar'];

        if (config.url && !rotasPublicas.includes(config.url)) {
            const token = localStorage.getItem('@ImportControl:token');
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);