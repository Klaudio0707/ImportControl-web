import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

const processoSchema = z.object({
  // Dados do Processo
  numeroProcesso: z.string().min(1, "Obrigatório"),
  identificadorInvoice: z.string().min(1, "Obrigatório"),
  fornecedor: z.string().min(1, "Obrigatório"),
  produto: z.string().min(1, "Obrigatório"),
  quantidade: z.number().positive("Deve ser > 0"),
  preco: z.number().positive("Deve ser > 0"),
  previsaoEmbarque: z.string().min(1, "Data é obrigatória"),
  unidadeMedida: z.string().min(1, "Selecione"),
  statusProcesso: z.string().min(1, "Selecione"),
  statusPagamento: z.string().min(1, "Selecione"),
  
  // Dados da Condição (A lógica "Smart" que você criou)
  descricaoCondicao: z.string().min(1, "Ex: Net 30"),
  diasPrazoCondicao: z.number().min(0, "Mínimo 0 dias")
});


type ProcessoFormData = z.infer<typeof processoSchema>;

const NovoProcesso = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProcessoFormData>({
    resolver: zodResolver(processoSchema),
    defaultValues: {
        statusProcesso: "EM_TRANSITO", 
        statusPagamento: "PENDENTE",
        unidadeMedida: "UN"
    }
  });

const onSubmit = async (data: ProcessoFormData) => {
    try {
      // Montamos o Payload Complexo para o Java
      const payload = {
        numeroProcesso: data.numeroProcesso,
        identificadorInvoice: data.identificadorInvoice,
        fornecedor: data.fornecedor,
        produto: data.produto,
        quantidade: data.quantidade,
        preco: data.preco,
        previsaoEmbarque: data.previsaoEmbarque,
        unidadeMedida: data.unidadeMedida,
        statusProcesso: data.statusProcesso,
        statusPagamento: data.statusPagamento,
        usuarioId: user?.id || 1,
        
        // Aqui enviamos a condição para o seu Service.buscarOuCriar
        condicaoPagamento: {
          descricao: data.descricaoCondicao,
          diasPrazo: data.diasPrazoCondicao,
          usuario: { id: user?.id || 1 }
        }
      };
      await api.post('/processos', payload);
      toast.success("Importação e Condição processadas com sucesso!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Erro no POST:", error.response?.data);
      toast.error("Falha ao salvar. Verifique a estrutura do DTO no Java.");
    }
  };

  return (
    <section className="form_page_container">
      <form onSubmit={handleSubmit(onSubmit)} className="form_card" style={{ maxWidth: '800px' }}>
        <h1 className="form_title">Novo Processo</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          <div className="input_group">
            <label>Número do Processo</label>
            <input className="input_field" {...register('numeroProcesso')} />
            {errors.numeroProcesso && <p className="error_message">{errors.numeroProcesso.message}</p>}
          </div>

          <div className="input_group">
            <label>Invoice</label>
            <input className="input_field" {...register('identificadorInvoice')} />
          </div>

          <div className="input_group">
            <label>Fornecedor</label>
            <input className="input_field" {...register('fornecedor')} />
          </div>

          <div className="input_group">
            <label>Produto</label>
            <input className="input_field" {...register('produto')} />
          </div>

          <div className="input_group">
            <label>Quantidade</label>
            <input type="number" step="0.01" className="input_field" {...register('quantidade', { valueAsNumber: true })} />
          </div>

          <div className="input_group">
            <label>Preço Unitário (USD)</label>
            <input type="number" step="0.01" className="input_field" {...register('preco', { valueAsNumber: true })} />
          </div>

          <div className="input_group">
            <label>Previsão de Embarque</label>
            <input type="date" className="input_field" {...register('previsaoEmbarque')} />
            {errors.previsaoEmbarque && <p className="error_message">{errors.previsaoEmbarque.message}</p>}
          </div>

          <div className="input_group">
            <label>Unidade de Medida</label>
            <select className="input_field" {...register('unidadeMedida')}>
              <option value="UN">UNIDADE</option>
              <option value="KG">KG</option>
               <option value="CX">CAIXA</option>
              <option value="L">Litro</option>
              <option value="TON">TONELADA</option>
            </select>
          </div>

          <div className="input_group">
            <label>Status Logístico</label>
            <select className="input_field" {...register('statusProcesso')}>
              <option value="CRIADO">Criado</option>
              <option value="AGUARDANDO_EMBARQUE">Aguardando Embarque</option>
              <option value="EM_TRANSITO">Em Trânsito</option>
              <option value="LIBERADO">Liberado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="DESEMBARCADO">Desembarcado</option>
              <option value="ENTREGUE">Entregue</option>
            </select>
          </div>

          <div className="input_group">
            <label>Status Financeiro</label>
            <select className="input_field" {...register('statusPagamento')}>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
               <option value="ATRASADO">Atrasado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div className="input_group">
           <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--primary-color)' }}>Financeiro & Condição</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="input_group">
                <label>Status Pagamento</label>
                <select className="input_field" {...register('statusPagamento')}>
                    <option value="PENDENTE">Pendente</option>
                    <option value="PAGO">Pago</option>
                </select>
            </div>
            <div className="input_group">
                <label>Condição (Nome)</label>
                <input className="input_field" {...register('descricaoCondicao')} placeholder="Ex: Net 30" />
            </div>
            <div className="input_group">
                <label>Dias de Prazo</label>
                <input type="number" className="input_field" {...register('diasPrazoCondicao', { valueAsNumber: true })} />
            </div>
          </div>
        </div>
          </div>

        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>Cancelar</button>
          <button type="submit" className="btn" style={{ flex: 1 }} disabled={isSubmitting}>
            {isSubmitting ? 'Gravando...' : 'Gravar Processo'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default NovoProcesso;