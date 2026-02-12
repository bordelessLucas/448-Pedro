# Firebase Rules - Configuração Completa

## 🔴 Erro: Missing or insufficient permissions

Este erro ocorre quando as regras do **Firestore** não estão configuradas corretamente.

---

## ✅ Solução: Configurar Regras do Firestore e Storage

### 1️⃣ Configurar Regras do Firestore (Banco de Dados)

#### Acesse o Firebase Console:
1. Vá para: https://console.firebase.google.com/
2. Selecione seu projeto: **pedro-47afa**
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Rules**

#### Cole estas regras:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para relatórios de inspeção
    match /inspectionReports/{reportId} {
      // Permitir leitura de relatórios apenas para o usuário que criou
      allow read: if request.auth != null 
                  && request.auth.uid == resource.data.userId;
      
      // Permitir criação de relatórios para usuários autenticados
      allow create: if request.auth != null 
                    && request.auth.uid == request.resource.data.userId;
      
      // Permitir atualização apenas do próprio relatório
      allow update: if request.auth != null 
                    && request.auth.uid == resource.data.userId;
      
      // Permitir exclusão apenas do próprio relatório
      allow delete: if request.auth != null 
                    && request.auth.uid == resource.data.userId;
    }
    
    // Negar acesso a outros documentos por padrão
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Clique em **Publicar**

---

### 2️⃣ Configurar Regras do Storage (Imagens)

#### Acesse o Storage:
1. No menu lateral, clique em **Storage**
2. Clique na aba **Rules**

#### Cole estas regras:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Regras para imagens de relatórios
    match /reports/{reportId}/{allPaths=**} {
      // Permitir leitura para usuários autenticados
      allow read: if request.auth != null;
      
      // Permitir upload para usuários autenticados
      // Limite de 10MB por arquivo
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      
      // Permitir exclusão
      allow delete: if request.auth != null;
    }
  }
}
```

3. Clique em **Publicar**

---

## 🔍 Verificações Importantes

### Verifique se o Firestore está habilitado:
1. Vá em **Firestore Database**
2. Se não estiver ativado, clique em **Create Database**
3. Escolha **Start in production mode**
4. Selecione a localização (ex: `southamerica-east1` - São Paulo)

### Verifique se o Storage está habilitado:
1. Vá em **Storage**
2. Se não estiver ativado, clique em **Get Started**
3. Aceite as regras padrão (você irá alterá-las depois)

---

## 🧪 Testando

Após configurar as regras:

1. **Faça logout e login novamente** no sistema
2. Tente criar um novo relatório
3. Verifique o console do navegador (F12) para ver os logs
4. Deve aparecer:
   - `Current user: [seu-user-id]`
   - `User email: [seu-email]`
   - `Report created with ID: [report-id]`

---

## ⚠️ Regras de Desenvolvimento vs Produção

### Para Desenvolvimento (Temporário - NÃO usar em produção):

Se você quiser testar rapidamente sem restrições:

**Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **IMPORTANTE:** Essas regras permitem qualquer operação para usuários autenticados. Use apenas para testes!

---

## 🆘 Problemas Comuns

### 1. "Missing or insufficient permissions"
- ✅ Verifique se está logado no sistema
- ✅ Verifique se as regras do Firestore estão publicadas
- ✅ Tente fazer logout e login novamente

### 2. "CORS policy" no Storage
- ✅ Verifique se as regras do Storage estão publicadas
- ✅ Use o arquivo `cors.json` e o comando `gsutil`

### 3. Nenhum relatório aparece na listagem
- ✅ Verifique se o relatório foi criado no Firestore
- ✅ Verifique se o `userId` está correto
- ✅ Veja os logs no console

---

## 📝 Checklist Final

- [ ] Firestore Database está habilitado
- [ ] Regras do Firestore foram publicadas
- [ ] Storage está habilitado
- [ ] Regras do Storage foram publicadas
- [ ] Usuário está autenticado (logado)
- [ ] Console mostra logs sem erros

---

## 🚀 Após Configurar

Tente criar um relatório novamente. Deve funcionar! 🎉
