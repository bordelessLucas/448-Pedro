import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import Button from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../lib/auth';
import {
  HiUser,
  HiMail,
  HiShieldCheck,
  HiInformationCircle,
  HiCheckCircle,
  HiExclamationCircle,
  HiPencil,
  HiLockClosed,
  HiCalendar,
  HiFingerPrint,
} from 'react-icons/hi';
import './Profile.css';

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Editar nome
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');

  // Trocar senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isGoogleUser = currentUser?.providerData.some(p => p.providerId === 'google.com');

  const getUserInitials = () => {
    const name = currentUser?.displayName || currentUser?.email || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      setNameError('O nome não pode ser vazio.');
      return;
    }
    setSavingName(true);
    setNameError('');
    setNameSuccess('');
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      }
      setNameSuccess('Nome atualizado com sucesso!');
      setTimeout(() => setNameSuccess(''), 4000);
    } catch {
      setNameError('Erro ao atualizar nome. Tente novamente.');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Informe a senha atual.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    setSavingPassword(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('Usuário não encontrado.');

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setPasswordSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPasswordError('Senha atual incorreta.');
      } else {
        setPasswordError('Erro ao alterar senha. Tente novamente.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="profile-layout">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="profile-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="profile-main">
          <div className="profile-container">

            {/* Page header */}
            <div className="profile-page-header">
              <div>
                <h1 className="profile-page-title">Meu Perfil</h1>
                <p className="profile-page-subtitle">Gerencie suas informações pessoais e segurança</p>
              </div>
              <Button variant="outline" size="medium" onClick={() => navigate(-1)}>
                Voltar
              </Button>
            </div>

            {/* Avatar card */}
            <div className="profile-card profile-card--hero">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="avatar" />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="profile-avatar-badge">
                  {isGoogleUser ? (
                    <span className="profile-provider profile-provider--google">Google</span>
                  ) : (
                    <span className="profile-provider profile-provider--email">E-mail</span>
                  )}
                </div>
              </div>

              <div className="profile-hero-info">
                <h2 className="profile-hero-name">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuário'}
                </h2>
                <p className="profile-hero-email">
                  <HiMail className="profile-hero-icon" />
                  {currentUser?.email}
                </p>
                <div className="profile-hero-badges">
                  {currentUser?.emailVerified && (
                    <span className="profile-badge profile-badge--verified">
                      <HiCheckCircle /> E-mail verificado
                    </span>
                  )}
                  <span className="profile-badge profile-badge--active">
                    <HiShieldCheck /> Conta ativa
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-grid">

              {/* Informações da conta */}
              <div className="profile-card">
                <div className="profile-card__header">
                  <HiInformationCircle className="profile-card__header-icon" />
                  <h3 className="profile-card__title">Informações da Conta</h3>
                </div>
                <div className="profile-info-list">
                  <div className="profile-info-item">
                    <HiCalendar className="profile-info-icon" />
                    <div>
                      <span className="profile-info-label">Membro desde</span>
                      <span className="profile-info-value">
                        {formatDate(currentUser?.metadata.creationTime)}
                      </span>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <HiShieldCheck className="profile-info-icon" />
                    <div>
                      <span className="profile-info-label">Último acesso</span>
                      <span className="profile-info-value">
                        {formatDate(currentUser?.metadata.lastSignInTime)}
                      </span>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <HiFingerPrint className="profile-info-icon" />
                    <div>
                      <span className="profile-info-label">ID do usuário</span>
                      <span className="profile-info-value profile-info-value--mono">
                        {currentUser?.uid?.slice(0, 16)}…
                      </span>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <HiUser className="profile-info-icon" />
                    <div>
                      <span className="profile-info-label">Provedor</span>
                      <span className="profile-info-value">
                        {isGoogleUser ? 'Google' : 'E-mail e senha'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editar nome */}
              <div className="profile-card">
                <div className="profile-card__header">
                  <HiPencil className="profile-card__header-icon" />
                  <h3 className="profile-card__title">Editar Perfil</h3>
                </div>

                <div className="profile-form">
                  <div className="profile-form-group">
                    <label className="profile-form-label">Nome de exibição</label>
                    <input
                      type="text"
                      className="profile-form-input"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-form-label">E-mail</label>
                    <input
                      type="email"
                      className="profile-form-input profile-form-input--readonly"
                      value={currentUser?.email || ''}
                      readOnly
                    />
                    <span className="profile-form-hint">O e-mail não pode ser alterado</span>
                  </div>

                  {nameError && (
                    <div className="profile-alert profile-alert--error">
                      <HiExclamationCircle /> {nameError}
                    </div>
                  )}
                  {nameSuccess && (
                    <div className="profile-alert profile-alert--success">
                      <HiCheckCircle /> {nameSuccess}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="medium"
                    loading={savingName}
                    onClick={handleSaveName}
                    icon={<HiPencil />}
                    iconPosition="left"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>

              {/* Segurança / trocar senha */}
              <div className="profile-card profile-card--full">
                <div className="profile-card__header">
                  <HiLockClosed className="profile-card__header-icon" />
                  <h3 className="profile-card__title">Segurança</h3>
                </div>

                {isGoogleUser ? (
                  <div className="profile-google-notice">
                    <HiShieldCheck className="profile-google-notice__icon" />
                    <div>
                      <strong>Conta vinculada ao Google</strong>
                      <p>A sua senha é gerenciada pelo Google. Para alterá-la, acesse as configurações da sua conta Google.</p>
                    </div>
                  </div>
                ) : (
                  <div className="profile-password-form">
                    <div className="profile-password-grid">
                      <div className="profile-form-group">
                        <label className="profile-form-label">Senha atual</label>
                        <input
                          type="password"
                          className="profile-form-input"
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Nova senha</label>
                        <input
                          type="password"
                          className="profile-form-input"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Confirmar nova senha</label>
                        <input
                          type="password"
                          className="profile-form-input"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>

                    {passwordError && (
                      <div className="profile-alert profile-alert--error">
                        <HiExclamationCircle /> {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="profile-alert profile-alert--success">
                        <HiCheckCircle /> {passwordSuccess}
                      </div>
                    )}

                    <Button
                      variant="primary"
                      size="medium"
                      loading={savingPassword}
                      onClick={handleChangePassword}
                      icon={<HiLockClosed />}
                      iconPosition="left"
                    >
                      Alterar Senha
                    </Button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
