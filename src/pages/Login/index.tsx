import { toast } from "sonner"

import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(2, "A senha deve ter pelo menos 2 caracteres")
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      toast.success("Login bem-sucedido!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Tentativa falhou: " + error);
    }
  };

 return (
  <section className="form_page_container">
    <form onSubmit={handleSubmit(onSubmit)} className="form_card">
      <h1 className="form_title">Bem-vindo de volta!</h1>
      <p className="form_subtitle">Entre para gerir as suas importações.</p>
      
      <div className="input_group">
        <label htmlFor="email">E-mail</label>
        <input 
          id="email"
          type="email" 
          placeholder="seu-email@exemplo.com" 
        
          className={`input_field ${errors.email ? 'input_error' : ''}`}
          {...register('email')} 
        />
        {errors.email && <p className="error_message">{errors.email.message}</p>}
      </div>

      <div className="input_group">
        <label htmlFor="password">Senha</label>
        <input 
          id="password"
          type="password" 
          placeholder="Digite a sua senha" 
          className={`input_field ${errors.password ? 'input_error' : ''}`}
          {...register('password')} 
        />
        {errors.password && <p className="error_message">{errors.password.message}</p>}
      </div>
      
      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'A entrar...' : 'Entrar'}
      </button>

      
      <div className="register_link">
        Não tem conta? <a className="register_link_tag" href="/register">Cadastre-se</a>
      </div>
    </form>
  </section>
  );
};

export default Login;