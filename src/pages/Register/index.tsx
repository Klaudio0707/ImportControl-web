import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../config/api';
import { toast } from "sonner"
import { useAuth } from '../../contexts/AuthContext';


const registroSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(3, "A senha deve ter pelo menos 3 caracteres"),
  confirmar_senha: z.string().min(3, "Confirme sua senha"),
  cnpj: z.string().length(14, "O CNPJ deve ter exatamente 14 números"),
  acesso: z.enum(["ADMIN", "USER"])
}).refine((data) => data.senha === data.confirmar_senha, {
  message: "As senhas não coincidem!",
  path: ["confirmar_senha"] 
});

type RegistroFormData = z.infer<typeof registroSchema>;

const Registro = () => {
  const navigate = useNavigate();
const { signIn } = useAuth ();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: { acesso: "USER" }
  });

const onSubmit = async (data: RegistroFormData) => {
    try {
     
      const { confirmar_senha, ...payloadParaOJava } = data;

      await api.post('/usuarios/cadastrar', payloadParaOJava);
      
      toast.success("Conta criada com sucesso! Redirecionando...");
      
      await signIn(data.email, data.senha);
      
      navigate('/dashboard', { replace: true });

    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar conta. Verifique os dados ou se o CNPJ é válido.");
    }
  };

  return (
    <section className="form_page_container">
      <form onSubmit={handleSubmit(onSubmit)} className="form_card" style={{ maxWidth: '500px' }}>
        <h1 className="form_title">Criar Conta</h1>
        <p className="form_subtitle">Cadastre sua empresa para começar a importar.</p>
        
        <div className="input_group">
          <label htmlFor="nome">Nome Completo</label>
          <input 
            id="nome" type="text" placeholder="Seu nome" 
            className={`input_field ${errors.nome ? 'input_error' : ''}`}
            {...register('nome')} 
          />
          {errors.nome && <p className="error_message">{errors.nome.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="email">E-mail</label>
          <input 
            id="email" type="email" placeholder="seu-email@exemplo.com" 
            className={`input_field ${errors.email ? 'input_error' : ''}`}
            {...register('email')} 
          />
          {errors.email && <p className="error_message">{errors.email.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="senha">Senha</label>
          <input 
            id="senha" type="password" placeholder="Crie uma senha forte" 
            className={`input_field ${errors.senha ? 'input_error' : ''}`}
            {...register('senha')} 
          />
          {errors.senha && <p className="error_message">{errors.senha.message}</p>}
        </div>
         <div className="input_group">
          <label htmlFor="confirmar_senha">Redigite sua senha!</label>
          <input 
            id="confirmar_senha" type="password" placeholder="Confirme sua senha" 
            className={`input_field ${errors.confirmar_senha ? 'input_error' : ''}`}
            {...register('confirmar_senha')}
          />
          {errors.confirmar_senha && <p className="error_message">{errors.confirmar_senha.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="cnpj">CNPJ (Apenas números)</label>
          <input 
            id="cnpj" type="text" placeholder="Ex: 06990590000123" 
            className={`input_field ${errors.cnpj ? 'input_error' : ''}`}
            {...register('cnpj')} 
          />
          {errors.cnpj && <p className="error_message">{errors.cnpj.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="acesso">Nível de Acesso</label>
          <select 
            id="acesso" 
            className={`input_field ${errors.acesso ? 'input_error' : ''}`}
            {...register('acesso')}
          >
            <option value="USER">Usuário Padrão</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {errors.acesso && <p className="error_message">{errors.acesso.message}</p>}
        </div>
        
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-color-light)' }}>
          Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>Faça o Login</Link>
        </div>
      </form>
    </section>
  );
};

export default Registro;