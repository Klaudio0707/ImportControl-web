import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api';
import { toast } from 'sonner';

interface ProcessoResponseDTO {
  id: string;
  numeroProcesso: string;
  identificadorInvoice: string;
  fornecedor: string;
  produto: string;
  quantidade: number;
  unidadeMedida: string;
  preco: number;
  valorTotal: number;
  valorTotalReal: number; 
  taxaCambio: number;     
  statusLogistico: string;
  statusFinanceiro: string;
  statusPrazo: string;
  nomeUsuarioResponsavel: string;
  razaoSocialEmpresa: string;
  condicaoPagamento: string;
}

const Dashboard = () => {
  const [processos, setProcessos] = useState<ProcessoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    buscarProcessos();
  }, []);

  const buscarProcessos = async () => {
    try {
      const response = await api.get('/processos/lista');
      setProcessos(response.data);
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      toast.error("Falha ao carregar os dados. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, numeroProcesso: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o processo ${numeroProcesso}?`)) {
      return;
    }

    try {
      await api.delete(`/processos/${id}`);
      setProcessos(processos.filter(p => p.id !== id));
      toast.success("Processo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir o processo. Verifique as dependências.");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/process/${id}`); 
  };

  const formatarMoeda = (valor: number, moeda: 'BRL' | 'USD') => {
    if (valor == null) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda
    }).format(valor);
  };

  return (
    <section className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="form_title" style={{ textAlign: 'left' }}>Painel de Importações</h1>
        <button className="btn" onClick={() => navigate('/process')}>
          + Novo Processo
        </button>
      </div>

      <div className="form_card" style={{ maxWidth: '100%', padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-color-light)' }}>Carregando dados da nuvem...</p>
        ) : processos.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-color-light)' }}>
            <p>Nenhum processo de importação encontrado.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-color)', minWidth: '1100px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-color-light)' }}>
                <th style={{ padding: '1rem' }}>Processo / Invoice</th>
                <th>Fornecedor / Produto</th>
                <th>Qtd / Preço Un.</th>
                <th>Pagamento (Prazo)</th>
                <th>Valores (USD / BRL)</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {processos.map((proc) => (
                <tr key={proc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{proc.numeroProcesso}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-color-light)' }}>Inv: {proc.identificadorInvoice || 'N/A'}</div>
                  </td>
                  
                  <td>
                    <div style={{ fontWeight: '500' }}>{proc.fornecedor}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-color-light)' }}>{proc.produto}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '500' }}>
                      {proc.quantidade} <span style={{ fontSize: '0.8rem', color: 'var(--text-color-light)' }}>{proc.unidadeMedida}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>{formatarMoeda(proc.preco, 'USD')} / un</div>
                  </td>

                  <td>
                    <div>{proc.condicaoPagamento}</div>
                    <div style={{ fontSize: '0.8rem', color: proc.statusPrazo?.includes('ATRASADO') ? 'red' : 'var(--text-color-light)' }}>
                      {proc.statusPrazo}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {formatarMoeda(proc.valorTotal, 'USD')}
                    </div>
                    {proc.valorTotalReal ? (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-color-light)', marginTop: '2px' }}>
                        {formatarMoeda(proc.valorTotalReal, 'BRL')} 
                        <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>(Tx: {proc.taxaCambio})</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#ff9800', marginTop: '2px' }}>Câmbio pendente</div>
                    )}
                  </td>

                  <td>
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{
                        backgroundColor: proc.statusFinanceiro === 'PAGO' ? '#d4edda' : '#fff3cd',
                        color: proc.statusFinanceiro === 'PAGO' ? '#155724' : '#856404',
                        padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                      }}>
                        {proc.statusFinanceiro || 'PENDENTE'}
                      </span>
                    </div>
                    <div>
                      <span style={{ 
                        backgroundColor: 'var(--secondary-color)', color: 'var(--background-color)',
                        padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                      }}>
                        {proc.statusLogistico}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(proc.id)}
                      style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', 
                        color: '#4dabf7', marginRight: '10px', fontSize: '1.2rem' 
                      }}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(proc.id, proc.numeroProcesso)}
                      style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', 
                        color: '#fa5252', fontSize: '1.2rem' 
                      }}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default Dashboard;