# Field Audit System - BOA

Sistema web moderno e funcional para auditorias em campo, substituindo processos manuais.

## 🚀 Funcionalidades

### ✅ Implementadas

- **Autenticação Completa**
  - Login com email/senha
  - Login com Google
  - Registro de novos usuários
  - Recuperação de senha
  - Proteção de rotas

- **Dashboard**
  - Estatísticas de auditorias
  - Ações rápidas
  - Lista de auditorias recentes
  - Design moderno e responsivo

- **Sistema de Auditoria**
  - Listagem de relatórios de inspeção
  - Criação de novos relatórios
  - Formulário completo baseado em padrões industriais
  - Upload de múltiplas imagens por categoria
  - Avaliações dimensionais, visuais e de embalagem
  - Registro de defeitos
  - Medidas dimensionais (comprimento, largura, espessura, esquadro)

- **Componentes Reutilizáveis**
  - Button component com múltiplas variantes
  - Header com menu de perfil
  - Sidebar com navegação
  - Layout responsivo

## 🛠️ Tecnologias

- **React 19** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Firebase** - Backend as a Service
  - Authentication
  - Firestore Database
  - Storage
- **React Router DOM** - Roteamento
- **React Icons** - Biblioteca de ícones

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Firebase

## ⚙️ Configuração

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/
│   ├── Header/
│   └── Sidebar/
├── contexts/           # Context API
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   └── useAuth.ts
├── lib/                # Configurações de bibliotecas
│   ├── firebase.ts
│   ├── auth.ts
│   ├── firestore.ts
│   └── storage.ts
├── pages/              # Páginas da aplicação
│   ├── Login/
│   ├── Register/
│   ├── Dashboard/
│   └── Auditoria/
├── routes/             # Configuração de rotas
│   ├── AppRoutes.tsx
│   ├── ProtectedRoute.tsx
│   └── paths.ts
└── services/           # Serviços e APIs
    ├── authService.ts
    └── reportService.ts
```

## 🎨 Design System

- **Cor Principal**: Laranja (#ff6b35)
- **Tipografia**: System fonts
- **Layout**: Clean e moderno
- **Responsivo**: Mobile-first

## 📝 Formulário de Inspeção

O formulário de inspeção inclui:

### Informações Básicas
- Data da inspeção
- Fornecedor/Fábrica
- Número do pedido
- Pilhas
- Tipo de pinho (100%, Combi Pine, Combi Euca)
- Local da inspeção
- Item inspecionado

### Avaliações
- Avaliação dimensional
- Avaliação visual
- Avaliação de embalagem
- Tratamento do lote

### Defeitos
Lista completa de 18 tipos de defeitos com quantidades

### Registros Dimensionais
- Comprimento (9 medidas)
- Largura (9 medidas)
- Espessura (9 medidas)
- Esquadro (9 medidas)

### Imagens (Total: até 52 imagens)
- Comprimento: 4 imagens
- Largura: 4 imagens
- Espessura: 4 imagens
- Esquadro: 4 imagens
- Face: 8 imagens
- Contra face: 8 imagens
- Palete: 2-3 imagens
- Pintura: 2-3 imagens
- Defeitos de construção: 4-6 imagens
- Carimbos: 2-3 imagens
- Bordas: 4-6 imagens
- Altura/Suportes: 2-4 imagens

## 🔐 Segurança

- Autenticação via Firebase
- Rotas protegidas
- Validação de formulários
- Upload seguro de imagens

## 📱 Funcionalidades Futuras

- [ ] Modo offline
- [ ] Geração de PDF
- [ ] Compartilhamento de relatórios
- [ ] Versionamento de relatórios
- [ ] Notificações
- [ ] Busca e filtros avançados
- [ ] Dashboard analytics

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com a equipe.

## 📄 Licença

Propriedade de BOA - Todos os direitos reservados.
