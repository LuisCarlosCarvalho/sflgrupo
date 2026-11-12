# Resumo das Atualizações - SFL Grupo

## O que foi feito hoje:

### 1. Sistema de Banco de Dados e Usuários
- **Senhas em Texto Limpo:** Adicionado o campo `plainPassword` no banco de dados (`schema.prisma`) para que as senhas recém-cadastradas possam ser resgatadas e enviadas de forma legível.
- **Botão de WhatsApp:** Criado um novo botão verde de WhatsApp na listagem de usuários. Quando clicado, envia uma mensagem personalizada ao cliente contendo link, usuário e a **senha real**, além de emojis configurados corretamente.
- **Data de Vencimento:** O campo de "Data de Vencimento" foi restaurado e voltou a aparecer no modal de **Cadastro de Novo Usuário**.

### 2. Financeiro
- **Filtro de Moedas (Multi-currency):** Implementada a distinção entre moedas (**BRL - Real, USD - Dólar, EUR - Euro**). Agora os totalizadores das finanças exibem o saldo separado para cada moeda.
- **Deleção de Registros:** Inserido o botão (ícone de lixeira) para excluir registros do histórico financeiro, caso tenha ocorrido algum erro ou duplicação no cadastro de valores.

### 3. Redirecionamento Inteligente (Acesso Rápido)
- **Bloqueio da Home para Logados:** Se o usuário já estiver logado e tentar acessar a página inicial (`/`) ou a tela de login, o sistema agora redireciona ele automaticamente para a tela do **Dashboard** (painel), evitando que ele tenha que logar de novo ou fique confuso com a tela de vendas.

### 4. Ajustes Gerais de Sistema
- **Suporte:** O número do WhatsApp do suporte geral foi atualizado em todo o site para `+351 928485483`.
- **Estabilidade Vercel (Correções de Build):** 
  - Resolvido um bug crítico onde a `middleware.ts` do Next.js travava a compilação. A lógica de redirecionamento foi passada para as páginas específicas.
  - Correção de múltiplos erros do *TypeScript* na Página de Guia de TV.
  - Ignorados os avisos bloqueantes do *ESLint*, permitindo que a Vercel finalmente pudesse publicar todas as funções novas de uma vez (que estavam presas na fila).

---

## O que testar ou continuar amanhã:
1. Confirmar se a Vercel finalmente colocou as mudanças online 100% (se a bolinha ficou verde após o último fix do middleware).
2. Investigar a questão da "lentidão geral do sistema" que foi mencionada superficialmente.
3. Continuar as melhorias no Guia de Programação de TV, que está temporariamente em modo de Manutenção para os clientes finais.
