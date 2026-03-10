
# 📦 Import Control - Web UI

<img width="948" height="504" alt="image" src="https://github.com/user-attachments/assets/59f91c31-e817-4dc8-bab4-2861d0779651" />


![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)

Interface de usuário (SPA) para o sistema de gestão de processos de importação. Este frontend foi construído com foco em **Clean Code**, alta performance de renderização e forte tipagem estática para garantir resiliência na comunicação com a API RESTful.

## 🚀 Tecnologias Utilizadas

A stack foi escolhida para garantir manutenção facilitada e uma experiência de usuário fluida:

* **React 18 + Vite:** Base da aplicação, garantindo um ambiente de desenvolvimento ultra-rápido.
* **TypeScript:** Tipagem estática baseada nos DTOs do backend para evitar erros em tempo de execução.
* **React Hook Form:** Gerenciamento de formulários complexos com alta performance, evitando re-renderizações desnecessárias e "estado espaguete".
* **React Router Dom:** Gerenciamento de rotas dinâmicas (ex: rotas parametrizadas para criação/edição `/:id`).
* **Axios:** Cliente HTTP configurado para requisições assíncronas (com suporte futuro a Interceptors para JWT).
* **Sonner:** Biblioteca de toasts para feedback visual imediato (sucesso/erro) nas ações do usuário.

## ✨ Funcionalidades da Interface

- [x] **Dashboard Dinâmico:** Tabela responsiva exibindo a listagem de processos com formatação automática de moedas (USD/BRL) e tags de status condicionais.
- [x] **Formulário Inteligente (Single Source of Truth):** O mesmo componente (`NovoProcesso`) lida com a Criação (POST) e Edição (PUT) mapeando os dados a partir da URL.
- [x] **Validação de Inputs:** Regras de negócio aplicadas no front, com inputs tipados para números e datas (formato ISO).
- [ ] **Filtros e Pesquisa:** (Em breve) Busca em tempo real de invoices e fornecedores.

## 🛠️ Como executar o projeto localmente

### Pré-requisitos
* Node.js (v18 ou superior)
* NPM ou Yarn
* A API Backend (Spring Boot) rodando localmente na porta 8080 (ou URL configurada).

### Passo a passo

1. **Clone o repositório:**
   ```bash
   Instale as dependências:

2. **Bash**
npm install
Configure as Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e aponte para a sua API local:

3. **Snippet de código**
VITE_API_URL=http://localhost:8080
Inicie o servidor de desenvolvimento:

Bash
npm run dev
A aplicação estará acessível no seu navegador em http://localhost:5173.
   git clone https://github.com/Klaudio0707/ImportControl-web
   cd import-control-frontend
