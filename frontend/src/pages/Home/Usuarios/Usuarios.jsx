import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../../../services/usuariosService';

const initialForm = {
  nome: '',
  email: '',
  senha: '',
  foto: '',
};

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [formData, setFormData] = useState(initialForm);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUsuarios();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEditModal = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      foto: usuario.foto || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingUser) {
        const payload = {
          ...formData,
          senha: formData.senha || undefined,
        };
        await updateUsuario(editingUser.id, payload);
      } else {
        await createUsuario(formData);
      }

      closeModal();
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm('Deseja realmente excluir este usuário?');

    if (!confirmar) {
      return;
    }

    try {
      await deleteUsuario(id);
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao excluir usuário');
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchUsuarios();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getUsuario(searchId);
      setUsers(response.data ? [response.data] : []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Usuário não encontrado');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={styles.headerRow}>
        <div>
          <p style={styles.sectionLabel}>Gestão</p>
          <h1 style={styles.title}>Usuários</h1>
        </div>

        <button style={styles.primaryButton} onClick={openCreateModal}>
          <Plus size={18} />
          Novo usuário
        </button>
      </div>

      <div style={styles.searchRow}>
        <input
          type="number"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={(event) => setSearchId(event.target.value)}
          style={styles.searchInput}
        />
        <button style={styles.searchButton} onClick={handleSearchById}>
          <Search size={16} />
          Buscar
        </button>
      </div>

      {loading && <div style={styles.message}>Carregando usuários...</div>}

      {error && <div style={styles.message}>Ops! {error}</div>}

      {!loading && !error && users.length === 0 && (
        <div style={styles.emptyState}>Nenhum usuário encontrado.</div>
      )}

      {!loading && !error && users.length > 0 && (
        <ul style={styles.userList}>
          {users.map((user) => (
            <li key={user.id} style={styles.userCard}>
              <div style={styles.userHeader}>
                <div style={styles.avatar}>{user.nome?.charAt(0)?.toUpperCase() || 'U'}</div>
                <div style={styles.userInfo}>
                  <strong style={styles.userName}>{user.nome}</strong>
                  <span style={styles.userEmail}>{user.email}</span>
                </div>
              </div>

              <div style={styles.metaRow}>
                <span style={styles.badge}>ID #{user.id}</span>
                <div style={styles.actionGroup}>
                  <button style={styles.iconButton} onClick={() => openEditModal(user)} aria-label="Editar usuário">
                    <Pencil size={16} />
                  </button>
                  <button style={styles.iconButtonDanger} onClick={() => handleDelete(user.id)} aria-label="Excluir usuário">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editingUser ? 'Editar usuário' : 'Criar usuário'}</h2>
              <button style={styles.closeButton} onClick={closeModal} aria-label="Fechar modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.fieldLabel}>
                Nome
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </label>

              <label style={styles.fieldLabel}>
                E-mail
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </label>

              <label style={styles.fieldLabel}>
                Senha {editingUser ? '(opcional para manter a atual)' : ''}
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  style={styles.input}
                  {...(!editingUser ? { required: true } : {})}
                />
              </label>

              <label style={styles.fieldLabel}>
                URL da foto
                <input
                  type="text"
                  name="foto"
                  value={formData.foto}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="https://..."
                />
              </label>

              <div style={styles.footerButtons}>
                <button type="button" style={styles.secondaryButton} onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" style={styles.primaryButton}>
                  {editingUser ? 'Salvar alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  sectionLabel: {
    margin: '0 0 6px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.72rem',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: 'var(--text-primary)',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--primary-color), #4f46e5)',
    color: '#fff',
    padding: '0.8rem 1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1 1 220px',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.85rem 1.2rem',
    border: 'none',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontWeight: 600,
  },
  userList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '16px',
  },
  userCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1rem 1.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary-color), #a78bfa)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.2rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  userName: {
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
  },
  userEmail: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  badge: {
    background: 'var(--badge-bg)',
    color: 'var(--primary-color)',
    padding: '0.45rem 0.7rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  actionGroup: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    border: 'none',
    borderRadius: '10px',
    background: '#f5f3ff',
    color: '#4f46e5',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  iconButtonDanger: {
    border: 'none',
    borderRadius: '10px',
    background: '#fee2e2',
    color: '#b91c1c',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    margin: '2rem 0',
    fontSize: '1rem',
  },
  emptyState: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'var(--card-bg)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '560px',
    padding: '1.5rem',
    border: '1px solid var(--border-color)',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.25)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  modalTitle: {
    margin: 0,
    color: 'var(--text-primary)',
    fontSize: '1.5rem',
  },
  closeButton: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  fieldLabel: {
    display: 'grid',
    gap: '8px',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '0.8rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  footerButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  secondaryButton: {
    border: '1px solid var(--border-color)',
    background: 'transparent',
    color: 'var(--text-primary)',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default Usuarios;