import { toast } from "sonner"
import styles from './Login.module.css'; 
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // toast("exemplo")

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
      navigate(from, { replace: true });
    } catch (error) {
      toast("Tentativa falhou "+ error);
    }
  };

  return (
    <section className={styles.form_page_container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form_card}>
        <h1 className={styles.form_title}>Bem-vindo de volta!</h1>
        <p className={styles.form_subtitle}>Entre para gerir as suas importações.</p>
        
        <div className={styles.input_group}>
          <label htmlFor="email">E-mail</label>
          <input 
            id="email"
            type="email" 
            placeholder="seu-email@exemplo.com" 
            className={`${styles.input_field} ${errors.email ? styles.input_error : ''}`}
            {...register('email')} 
          />
          {errors.email && <p className={styles.error_message}>{errors.email.message}</p>}
        </div>

        <div className={styles.input_group}>
          <label htmlFor="password">Senha</label>
          <input 
            id="password"
            type="password" 
            placeholder="Digite a sua senha" 
            className={`${styles.input_field} ${errors.password ? styles.input_error : ''}`}
            {...register('password')} 
          />
          {errors.password && <p className={styles.error_message}>{errors.password.message}</p>}
        </div>
        
        <button type="submit" className={styles.btn} disabled={isSubmitting}>
          {isSubmitting ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
};

export default Login;