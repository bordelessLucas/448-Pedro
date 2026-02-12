# Firebase Storage - Configuração CORS

## Problema
O Firebase Storage está bloqueando uploads do localhost devido a políticas CORS.

## Solução Rápida: Configurar Regras de Segurança

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com/
- Selecione seu projeto: **pedro-47afa**

### 2. Configure as Regras do Storage
1. No menu lateral, clique em **Storage**
2. Clique na aba **Rules**
3. Substitua as regras por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura e escrita para usuários autenticados
    match /reports/{reportId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                  && request.resource.size < 10 * 1024 * 1024; // Limite de 10MB
    }
  }
}
```

4. Clique em **Publicar**

### 3. Verificar se o Storage está habilitado
- Certifique-se de que o Firebase Storage está ativado no seu projeto
- Se não estiver, clique em **Get Started** na página do Storage

---

## Solução Avançada: Configurar CORS (Se ainda houver problemas)

### Pré-requisitos
- Instalar [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### Passos

1. **Autenticar com Google Cloud:**
```bash
gcloud auth login
```

2. **Definir o projeto:**
```bash
gcloud config set project pedro-47afa
```

3. **Aplicar configuração CORS:**
```bash
gsutil cors set cors.json gs://pedro-47afa.firebasestorage.app
```

4. **Verificar se foi aplicado:**
```bash
gsutil cors get gs://pedro-47afa.firebasestorage.app
```

---

## Solução Temporária Implementada

O código foi atualizado para:
- ✅ Salvar o relatório mesmo que algumas imagens falhem
- ✅ Mostrar quais imagens falharam no upload
- ✅ Permitir editar o relatório depois para adicionar imagens
- ✅ Logs detalhados no console para debug

---

## Testando

1. Tente criar um novo relatório
2. Mesmo que o upload de imagens falhe, o relatório será salvo
3. Um alerta mostrará quais categorias de imagens falharam
4. Você pode adicionar as imagens depois (funcionalidade de edição)

---

## Próximos Passos

1. Configure as regras do Storage (Solução 1)
2. Se ainda houver problemas, configure CORS (Solução 2)
3. Após configurar, teste novamente o upload de imagens

---

## Suporte

Se continuar tendo problemas, verifique:
- ✅ Firebase Storage está habilitado
- ✅ Usuário está autenticado (logged in)
- ✅ Regras de segurança estão corretas
- ✅ Bucket name está correto: `pedro-47afa.firebasestorage.app`
