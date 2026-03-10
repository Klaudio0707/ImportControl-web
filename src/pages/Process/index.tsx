import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import { api } from '../../config/api';
import { toast } from 'sonner';


interface ProcessoFormulario {
  numeroProcesso: string;
  identificadorInvoice: string;
  fornecedor: string;
  produto: string;
  quantidade: number;
  preco: number;
  previsaoEmbarque: string;
  unidadeMedida: string;
  statusProcesso: string;
  statusPagamento: string;
  descricaoCondicao: string;
  diasPrazoCondicao: number;
}

const NovoProcesso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingForm, setLoadingForm] = useState(false); // Evita conflito de nome com o form

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProcessoFormulario>({
    defaultValues: {
      unidadeMedida: 'UN',
      statusProcesso: 'EM_TRANSITO',
      statusPagamento: 'PENDENTE',
      quantidade: 0,
      preco: 0,
      diasPrazoCondicao: 0
    }
  });


  useEffect(() => {
    if (id) {
      buscarProcessoParaEdicao(id);
    }
  }, [id]);

  const buscarProcessoParaEdicao = async (processoId: string) => {
    try {
      setLoadingForm(true);
      const response = await api.get(`/processos/${processoId}`);
      const dadosBanco = response.data;
      
     
      reset({
        numeroProcesso: dadosBanco.numeroProcesso || '',
        identificadorInvoice: dadosBanco.identificadorInvoice || '',
        fornecedor: dadosBanco.fornecedor || '',
        produto: dadosBanco.produto || '',
        quantidade: dadosBanco.quantidade || 0,
        preco: dadosBanco.preco || 0,
        previsaoEmbarque: dadosBanco.previsaoEmbarque ? dadosBanco.previsaoEmbarque.split('T')[0] : '',
        unidadeMedida: dadosBanco.unidadeMedida || 'UN',
        statusProcesso: dadosBanco.statusLogistico || 'EM_TRANSITO',
        statusPagamento: dadosBanco.statusFinanceiro || 'PENDENTE',
        descricaoCondicao: typeof dadosBanco.condicaoPagamento === 'string' ? dadosBanco.condicaoPagamento : '',
        diasPrazoCondicao: 0 
      });
    } catch (error) {
      console.error("Erro ao carregar processo para edição:", error);
      toast.error("Processo não encontrado.");
      navigate('/dashboard');
    } finally {
      setLoadingForm(false);
    }
  };

  
  const onSubmit = async (data: ProcessoFormulario) => {
    try {
      
      const payload = {
        numeroProcesso: data.numeroProcesso,
        identificadorInvoice: data.identificadorInvoice,
        fornecedor: data.fornecedor,
        produto: data.produto,
        quantidade: Number(data.quantidade), 
        preco: Number(data.preco),           
        previsaoEmbarque: data.previsaoEmbarque,
        unidadeMedida: data.unidadeMedida,
        statusProcesso: data.statusProcesso,
        statusPagamento: data.statusPagamento,
        usuarioId: 1, 
        condicaoPagamento: {
          descricao: data.descricaoCondicao,
          diasPrazo: Number(data.diasPrazoCondicao)
        }
      };

      if (id) {
        await api.put(`/processos/${id}`, payload);
        toast.success("Processo atualizado com sucesso!");
      } else {
        await api.post('/processos', payload);
        toast.success("Processo criado com sucesso!");
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar. Verifique os dados.");
    }
  };

  return (
    <section className="container" style={{ padding: '2rem' }}>
      <h1 className="form_title">{id ? 'Editar Processo' : 'Novo Processo'}</h1>
      
      {loadingForm && id ? (
        <p style={{ textAlign: 'center', color: 'var(--text-color-light)' }}>Carregando dados da nuvem...</p>
      ) : (
       
        <form onSubmit={handleSubmit(onSubmit)} className="form_card">
          
          <div className="input_group" style={{ marginBottom: '1rem' }}>
            <label>Número do Processo</label>
            <input 
              type="text" 
              className="input_field" 
              {...register('numeroProcesso', { required: "Número é obrigatório" })} 
              disabled={!!id} 
            />
            {errors.numeroProcesso && <p className="error_message" style={{ color: 'red', fontSize: '0.8rem' }}>{errors.numeroProcesso.message}</p>}
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

          <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--primary-color)' }}>Financeiro & Condição</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              
              <div className="input_group">
                <label>Status Pagamento</label>
                <select className="input_field" {...register('statusPagamento')}>
                  <option value="PENDENTE">Pendente</option>
                  <option value="PAGO">Pago</option>
                  <option value="ATRASADO">Atrasado</option>
                  <option value="CANCELADO">Cancelado</option>
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

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>Cancelar</button>
            <button type="submit" className="btn" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Gravando...' : 'Gravar Processo'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default NovoProcesso;