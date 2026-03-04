## Loja de peças para motos - Binho Motos

Projeto em Next.js com painel administrativo, catálogo de produtos e integração de pagamento via Mercado Pago (PIX, débito e crédito via Checkout Pro).

### Requisitos

- Node.js 18+
- SQLite (já embarcado, não precisa instalar servidor)

### Configuração inicial

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env.local` na raiz do projeto com:

```bash
MP_ACCESS_TOKEN=SEU_TOKEN_MERCADO_PAGO
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@sualoja.com
ADMIN_PASSWORD=senha-forte-aqui
ADMIN_JWT_SECRET=um-segredo-bem-grande-e-unico
```

3. Gere o banco de dados SQLite com Prisma:

```bash
npx prisma db push
```

4. Rode o projeto:

```bash
npm run dev
```

### Funcionalidades principais

- **Landing page** com destaque para serviços, orçamento e catálogo.
- **Catálogo de produtos**: lista de peças de motos cadastradas no banco.
- **Pagamento Mercado Pago**: criação de preferência de pagamento (Checkout Pro) aceitando PIX, débito e crédito.
- **Painel administrador**:
  - Login protegido por e-mail/senha.
  - Cadastro, edição, listagem e remoção de produtos.

### Onde editar

- **Landing / catálogo**: `src/app/page.tsx`
- **Painel admin**: rotas em `src/app/admin/*`
- **API produtos/admin**: `src/app/api/admin/*`
- **API checkout**: `src/app/api/checkout/route.ts`
- **Modelos do banco**: `prisma/schema.prisma`

# Moto Peças (Loja + Orçamento + Admin)

Site profissional para venda de peças de motos, com:

- **Landing page** + catálogo de produtos
- **Orçamento online** (`/orcamento`) com painel admin (`/admin/orcamentos`)
- **Carrinho** (`/carrinho`)
- **Checkout Mercado Pago (Checkout Pro)** com **Pix / débito / crédito**
- **Painel de administrador** (`/admin`) com **CRUD de produtos**
- **Webhook Mercado Pago** para atualizar status do pedido

## Rodar localmente

1) Instale dependências:

```bash
npm install
```

2) Configure variáveis de ambiente:

- Copie `.env.example` → `.env`
- Preencha `AUTH_SECRET` (uma string longa)
- Preencha `MERCADOPAGO_ACCESS_TOKEN`
- (Opcional) ajuste `APP_URL` (padrão `http://localhost:3000`)

3) Banco de dados (SQLite) + seed do admin:

> O seed cria o primeiro admin usando `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env`.

```bash
npm run db:migrate
```

4) Rodar o servidor:

```bash
npm run dev
```

Acesse:

- **Site**: `http://localhost:3000`
- **Admin**: `http://localhost:3000/admin`

## Integração Mercado Pago

- Checkout criado em `src/app/api/checkout/create-preference/route.ts`
- Webhook em `src/app/api/mercadopago/webhook/route.ts`

Em produção, configure o `APP_URL` com o domínio público do seu site, e registre o webhook no Mercado Pago (ou use a `notification_url` gerada no preference).
