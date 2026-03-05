import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api';
import { toast } from 'sonner';

interface ProcessoResponseDTO {
  id: string;
  numeroProcesso: string;
  fornecedor: string;
  produto: string;
  valorTotal: number;
  statusLogistico: string;
  statusPrazo: string;
  nomeUsuarioResponsavel: string;
  razaoSocialEmpresa: string;
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
}

    const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL' // Mude para 'USD' se o valorTotal for em dólares
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
            <p style={{ fontSize: '0.9rem' }}>Clique no botão acima para cadastrar o seu primeiro processo.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-color)', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-color-light)' }}>
                <th style={{ padding: '1rem' }}>Processo</th>
                <th>Fornecedor / Produto</th>
                <th>Empresa</th>
                <th>Responsável</th>
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {processos.map((proc) => (
                <tr key={proc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {proc.numeroProcesso}
                  </td>
                  <td>
                    <div>{proc.fornecedor}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-color-light)' }}>{proc.produto}</div>
                  </td>
                  <td>{proc.razaoSocialEmpresa}</td>
                  <td>{proc.nomeUsuarioResponsavel}</td>
                  <td style={{ fontWeight: '500' }}>{formatarMoeda(proc.valorTotal)}</td>
                  <td>
                    <span style={{ 
                      backgroundColor: 'var(--secondary-color)', 
                      color: 'var(--background-color)',
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {proc.statusLogistico}
                    </span>
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