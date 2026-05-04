# 🎨 GUIA VISUAL: Fluxos e Diagramas do Projeto

Este documento contém diagramas visuais e fluxos para entender melhor como tudo se conecta.

---

## 📊 1. Arquitetura Geral do Projeto

```
┌─────────────────────────────────────────────────────────────────┐
│                    NAVEGADOR DO USUÁRIO                        │
│                      (Frontend - React)                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓  ↑
                 Requisições / Respostas
                            ↓  ↑
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app/page.tsx (Páginas renderizadas no servidor)         │  │
│  │  - Página inicial                                        │  │
│  │  - Página de produtos                                   │  │
│  │  - Carrinho                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app/api/ (Rotas de API)                                │  │
│  │  - POST /api/admin/produtos (criar)                     │  │
│  │  - GET /api/admin/produtos (listar)                     │  │
│  │  - DELETE /api/admin/produtos/[id]                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  context/CartContext.tsx (Estado Global)                │  │
│  │  - Compartilha carrinho entre componentes                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓  ↑
                    Consultas / Updates
                            ↓  ↑
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Banco PostgreSQL)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  products (Tabela de Produtos)                          │  │
│  │  ┌─────┬──────────┬────────┬────────────┬──────────────┐ │  │
│  │  │ id  │  name    │ price  │ category   │ stock        │ │  │
│  │  ├─────┼──────────┼────────┼────────────┼──────────────┤ │  │
│  │  │ uuid│ Anel     │ 189.90 │ Anéis      │ 10           │ │  │
│  │  │ uuid│ Colar    │ 249.90 │ Colares    │ 8            │ │  │
│  │  │ uuid│ Anel Masc│ 199.90 │ Masculino  │ 6            │ │  │
│  │  └─────┴──────────┴────────┴────────────┴──────────────┘ │  │
│  │                                                          │  │
│  │  orders (Tabela de Pedidos)                            │  │
│  │  ┌─────┬────────┬────────┬──────────┬────────────────┐ │  │
│  │  │ id  │user_id │ items  │ total    │ status         │ │  │
│  │  ├─────┼────────┼────────┼──────────┼────────────────┤ │  │
│  │  │ uuid│ uuid   │ jsonb  │ 439.80   │ pending / paid │ │  │
│  │  └─────┴────────┴────────┴──────────┴────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 2. Fluxo de Uma Compra Completa

```
PASSO 1: Usuário Navega
┌──────────────────────┐
│  Abre navegador      │
│  Vai para /produtos  │
└──────────────────────┘
            ↓
┌──────────────────────────────────────────────┐
│  Next.js processa: app/produtos/page.tsx    │
│  Busca produtos no Supabase                 │
│  Retorna HTML renderizado                   │
└──────────────────────────────────────────────┘
            ↓
PASSO 2: Vê Categorias (Hardcoded)
┌──────────────────────────────────────────────┐
│  ['Anéis', 'Colares', 'Pulseiras',          │
│   'Brincos', 'Tornozeleiras', 'Masculino']  │
│  .map(cat => <Link to={...}/>)               │
│  Renderiza 6 cartões de categoria            │
└──────────────────────────────────────────────┘
            ↓
PASSO 3: Filtra por Categoria
┌──────────────────────────────────────────────┐
│  Clica em "Tornozeleiras"                    │
│  URL: /produtos?categoria=tornozeleiras     │
└──────────────────────────────────────────────┘
            ↓
PASSO 4: Filtra Produtos
┌──────────────────────────────────────────────┐
│  Query: categoria = "Tornozeleiras"          │
│  SELECT * FROM products                      │
│  WHERE category = 'Tornozeleiras'            │
│  Retorna apenas tornozeleiras                │
└──────────────────────────────────────────────┘
            ↓
PASSO 5: Clica em Produto
┌──────────────────────────────────────────────┐
│  Componente ProductCard.tsx                  │
│  Mostra: nome, foto, preço                   │
│  Botão "Adicionar ao Carrinho"               │
└──────────────────────────────────────────────┘
            ↓
PASSO 6: Adiciona ao Carrinho
┌──────────────────────────────────────────────┐
│  Clica botão                                 │
│  Chama: useCart().add(product)               │
│  CartContext atualiza estado                 │
│  React re-renderiza página                   │
│  Ícone de carrinho atualiza contador         │
└──────────────────────────────────────────────┘
            ↓
PASSO 7: Vai para Checkout
┌──────────────────────────────────────────────┐
│  app/checkout/page.tsx                       │
│  Lê produtos do CartContext                  │
│  Mostra: itens, preço total, forma pagamento│
└──────────────────────────────────────────────┘
            ↓
PASSO 8: Processa Pagamento
┌──────────────────────────────────────────────┐
│  POST /api/pagamento/processar               │
│  Dados: items, endereço, método pagamento   │
│  MercadoPago processa pagamento              │
│  Se OK: retorna transactionId                │
└──────────────────────────────────────────────┘
            ↓
PASSO 9: Cria Pedido
┌──────────────────────────────────────────────┐
│  INSERT INTO orders VALUES (...)             │
│  - items: array de CartItem                  │
│  - total: soma de preços                     │
│  - status: 'pending' → 'paid'                │
│  - timestamp: data do pedido                 │
└──────────────────────────────────────────────┘
            ↓
PASSO 10: Confirmação
┌──────────────────────────────────────────────┐
│  Redireciona para /obrigado                  │
│  CartContext é limpo: clearCart()            │
│  Usuário vê mensagem de sucesso              │
│  Email de confirmação é enviado              │
└──────────────────────────────────────────────┘
```

---

## 🧬 3. Fluxo de Tipos: Como TypeScript Valida

```
┌─ DESENVOLVIMENTO ─┐
│                   │
│  TS File:         │
│  ┌──────────────┐ │
│  │ types/...tsx │ │
│  └──────────────┘ │
│         ↓         │
│  TypeScript       │
│  Compiler (tsc)   │
│         ↓         │
│  ┌──────────────┐ │
│  │ Verifica:    │ │
│  │ - Types OK?  │ │
│  │ - Props OK?  │ │
│  │ - Funções OK?│ │
│  └──────────────┘ │
│         ↓ ↓       │
│      SIM  NÃO     │
│        ↓   ↓      │
│    OK   ERRO!     │
│        ↓   ↓      │
│     ↓───STOP      │
│     ↓             │
│  Compila para     │
│  JavaScript       │
│     ↓             │
│  Next.js          │
│  bundla .js       │
│     ↓             │
└────────────────────┘
         ↓
    ┌────────────────┐
    │ RUNTIME        │
    │ (Navegador/    │
    │ Node.js)       │
    │ Executa .js    │
    └────────────────┘
```

### Exemplo Prático

```
CÓDIGO ESCRITO:
───────────────────────────────────────
const produto: Product = {
  id: "123",
  name: "Anel",
  price: 189.90,
  category: "Tornozeleiras"  ← TypeScript valida aqui!
}
───────────────────────────────────────

TypeScript verifica:
✓ category é do tipo Categoria?
  type Categoria = 'Anéis' | 'Colares' | ... | 'Tornozeleiras'

✓ SIM! 'Tornozeleiras' está na lista
  → Compila com sucesso ✅

✗ Se fosse "Sapatos":
  → ERRO: Type '"Sapatos"' is not assignable to type 'Categoria'
  → Não compila ❌

(Nota: Erro é detectado em desenvolvimento, não em runtime!)
```

---

## 📦 4. Fluxo de Dados no CartContext

```
INÍCIO
  ↓
┌────────────────────────────────────────┐
│  Usuario clica "Adicionar ao Carrinho" │
└────────────────────────────────────────┘
  ↓
┌────────────────────────────────────────────────────────────┐
│  ProductCard.tsx chama:                                    │
│  const { add } = useCart()                                 │
│  add(product)                                              │
└────────────────────────────────────────────────────────────┘
  ↓
┌────────────────────────────────────────────────────────────┐
│  CartContext.tsx - função add():                           │
│                                                            │
│  const add = (product: Product) => {                       │
│    setItems(prev => {                                      │
│      // Procura produto no carrinho                        │
│      const existing = prev.find(                           │
│        i => i.product.id === product.id                    │
│      )                                                     │
│                                                            │
│      if (existing) {                                       │
│        // Se existe, aumenta quantidade                    │
│        return prev.map(i =>                                │
│          i.product.id === product.id                       │
│            ? { ...i, quantity: i.quantity + 1 }           │
│            : i                                             │
│        )                                                   │
│      }                                                     │
│                                                            │
│      // Se não existe, adiciona novo                       │
│      return [...prev, { product, quantity: 1 }]           │
│    })                                                      │
│  }                                                         │
└────────────────────────────────────────────────────────────┘
  ↓
┌────────────────────────────────────────────────────────────┐
│  React detecta mudança de estado:                          │
│  setItems(novoArray)                                       │
│                                                            │
│  Estado anterior:                                          │
│  [{ product: Anel1, quantity: 1 }]                         │
│                                                            │
│  Estado novo:                                              │
│  [                                                         │
│    { product: Anel1, quantity: 1 },                        │
│    { product: Tornozeleira1, quantity: 1 }  ← NOVO!       │
│  ]                                                         │
└────────────────────────────────────────────────────────────┘
  ↓
┌────────────────────────────────────────────────────────────┐
│  React Re-renderiza:                                       │
│  - Componentes que usam useCart() são re-renderizados      │
│  - total = 189.90 + 129.90 = 319.80                        │
│  - count = 1 + 1 = 2                                       │
│  - Ícone do carrinho mostra "2 itens"                      │
│  - Página de carrinho mostra ambos produtos                │
└────────────────────────────────────────────────────────────┘
```

---

## 🗂️ 5. Estrutura de Pastas e Responsabilidades

```
aguaesal-shop/
│
├── 📄 types/index.ts
│   └── Define TODOS os tipos compartilhados
│       - Product, CartItem, Order, Categoria
│       - Importado por: Context, Components, API
│       - NUNCA muda? Ninguém consegue criar produto errado
│
├── 📁 context/
│   └── CartContext.tsx
│       - Gerencia estado global do carrinho
│       - useCart() pode ser usado em qualquer componente
│       - Em memória (se recarregar página, limpa)
│
├── 📁 app/
│   │
│   ├── page.tsx (Página inicial)
│   │   └── Mostra: Hero, Categorias, Destaques
│   │       Busca produtos no Supabase
│   │
│   ├── produtos/page.tsx (Listagem com filtros)
│   │   └── Filtra por categoria: ?categoria=Anéis
│   │
│   ├── carrinho/page.tsx (Ver itens do carrinho)
│   │   └── Lê CartContext, mostra totais
│   │
│   ├── checkout/page.tsx (Pagamento)
│   │   └── Chama API de pagamento
│   │
│   ├── api/
│   │   ├── admin/produtos/route.ts
│   │   │   └── POST: criar produto
│   │   │       DELETE: remover produto
│   │   │       GET: listar (com filtros)
│   │   │
│   │   ├── admin/login/route.ts
│   │   │   └── POST: fazer login admin
│   │   │       Salva cookie: admin_auth=true
│   │   │
│   │   └── pagamento/processar/route.ts
│   │       └── POST: processa pagamento MercadoPago
│   │
│   └── admin/
│       ├── login/page.tsx (Tela de login)
│       ├── produtos/page.tsx (Gerenciar produtos)
│       │   ├── Listagem
│       │   ├── Editar
│       │   └── Deletar
│       └── pedidos/page.tsx (Ver pedidos)
│
├── 📁 components/
│   ├── ProductCard.tsx (Cartão de um produto)
│   │   └── Props: product
│   │       Chama: add(product) via useCart()
│   │
│   ├── ProductForm.tsx (Formulário criar/editar)
│   │   └── Valida tipos antes de enviar
│   │
│   ├── Header.tsx (Navbar com carrinho)
│   │   └── Mostra: logo, menu, total
│   │
│   └── Footer.tsx (Rodapé)
│
├── 📁 lib/
│   ├── supabase-server.ts
│   │   └── Cria client Supabase (server-side)
│   │
│   ├── supabase.ts
│   │   └── Cria client Supabase (client-side)
│   │
│   └── infinitepay.ts
│       └── Integração com gateway pagamento
│
├── 📄 supabase-schema.sql
│   └── Script SQL:
│       - CREATE TABLE products
│       - CREATE TABLE orders
│       - INSERT dados exemplo
│       - CREATE POLICIES (segurança)
│
├── 📄 tsconfig.json
│   └── Configuração TypeScript:
│       - strict: true (modo rigoroso)
│       - paths: @/* (atalhos imports)
│
├── 📄 next.config.ts
│   └── Configuração Next.js
│
└── 📄 package.json
    └── Dependências:
        - next, react
        - @supabase/supabase-js
        - tailwindcss
```

---

## 🔐 6. Fluxo de Segurança

```
┌─────────────────────────────────────────────────────────┐
│                  ACESSO PÚBLICO                         │
│  - Ver produtos                                         │
│  - Filtrar por categoria                                │
│  - Adicionar ao carrinho                                │
│  - Fazer pedido                                         │
│  - Ver histórico pedidos (com autenticação Supabase)   │
└─────────────────────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────────────┐
│          ACESSO RESTRITO (ADMIN)                        │
│                                                         │
│  1. Usuário tenta acessar /admin/produtos               │
│  2. Checa: tem cookie admin_auth=true?                 │
│     ✓ SIM → permite acesso                             │
│     ✗ NÃO → redireciona para /admin/login              │
│                                                         │
│  3. No login:                                           │
│     - POST /api/admin-login                            │
│     - Valida credenciais (email/senha)                 │
│     - Se OK: salva cookie admin_auth=true              │
│     - Se NOK: retorna erro 401                         │
│                                                         │
│  4. Ao criar produto:                                  │
│     - POST /api/admin/produtos                         │
│     - Verifica: admin_auth=true?                       │
│       ✓ SIM → insere no banco                          │
│       ✗ NÃO → retorna erro 401 Unauthorized            │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 7. Validação em 3 Camadas

```
CAMADA 1: TypeScript (Tempo de compilação)
┌──────────────────────────────────────────┐
│  type Categoria = 'Anéis' | 'Colares'... │
│  const categoria: Categoria = "Sapatos"   │
│                                          │
│  ❌ ERRO em desenvolvimento               │
│  "Type 'Sapatos' not assignable"         │
│                                          │
│  Benefício: Errro ANTES de rodar!        │
└──────────────────────────────────────────┘
                    ↓
CAMADA 2: Banco de Dados (Inserção)
┌──────────────────────────────────────────┐
│  CHECK constraint                        │
│  category IN (                           │
│    'Anéis', 'Colares', ..., 'Masculino' │
│  )                                       │
│                                          │
│  INSERT com "Sapatos"                    │
│  ❌ ERRO: violates check constraint      │
│                                          │
│  Benefício: Protege integridade dados   │
└──────────────────────────────────────────┘
                    ↓
CAMADA 3: Application Logic (Runtime)
┌──────────────────────────────────────────┐
│  if (product.category === 'Anéis') {     │
│    // mostrar filtro específico          │
│  } else if (...) {                       │
│    // outros filtros                     │
│  } else {                                │
│    // nunca chega aqui!                  │
│  }                                       │
│                                          │
│  Benefício: Lógica segura sem surpresas  │
└──────────────────────────────────────────┘

RESULTADO: Categoria inválida nunca consegue entrar no sistema!
```

---

## 🎯 8. Como Adicionar Categorias (Fluxo Visual)

```
ANTES (4 categorias):
┌──────────────────────────────────────────┐
│ const categorias = [                     │
│   'Anéis',                               │
│   'Colares',                             │
│   'Pulseiras',                           │
│   'Brincos'                              │
│ ]                                        │
└──────────────────────────────────────────┘

DEPOIS (6 categorias):
┌──────────────────────────────────────────────────┐
│ const categorias = [                             │
│   'Anéis',                                       │
│   'Colares',                                     │
│   'Pulseiras',                                   │
│   'Brincos',                                     │
│   'Tornozeleiras',  ← NOVO!                      │
│   'Masculino'       ← NOVO!                      │
│ ]                                                │
└──────────────────────────────────────────────────┘

IMPACTO NOS 3 ARQUIVOS:

┌─────────────────────────────────────────────────────────┐
│ 1. types/index.ts                                       │
│    ─────────────────────────────────────────────────── │
│    type Categoria = 'Anéis' | ... | 'Tornozeleiras'    │
│    e 'Masculino'                                        │
│                                                         │
│    Benefício: TypeScript valida em desenvolvimento      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 2. app/page.tsx                                         │
│    ─────────────────────────────────────────────────── │
│    {['Anéis', ..., 'Tornozeleiras', 'Masculino']...}   │
│                                                         │
│    Benefício: Categorias aparecem na página            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 3. supabase-schema.sql                                  │
│    ─────────────────────────────────────────────────── │
│    CHECK (category IN (..., 'Tornozeleiras',           │
│    'Masculino'))                                        │
│                                                         │
│    Benefício: Banco aceita/rejeita as novas categorias │
└─────────────────────────────────────────────────────────┘
                            ↓
RESULTADO:
- ✅ TypeScript feliz
- ✅ Página mostra 6 categorias
- ✅ Banco valida novas categorias
- ✅ Usuário pode filtrar por "Tornozeleiras" e "Masculino"
```

---

## 📈 9. Performance: Renderização Página Inicial

```
1. Usuário acessa: https://aguaesal-shop.com
   ↓
2. Next.js roda: app/page.tsx (no servidor!)
   ├─ Chama: getFeaturedProducts()
   ├─ Query: SELECT * FROM products LIMIT 8
   ├─ Banco responde em: ~50ms
   └─ Renderiza HTML com dados
   ↓
3. Envia HTML + CSS para navegador: ~200ms
   ↓
4. Navegador:
   ├─ Parse HTML: ~30ms
   ├─ Load CSS (Tailwind): ~50ms
   ├─ Load JavaScript (React): ~100ms
   ├─ Hydrate (React conecta ao HTML): ~30ms
   └─ Página interativa!
   ↓
TOTAL: ~450ms até página estar visível
INTERATIVA: ~210ms

Optimizações:
- ✅ Renderiza HTML no servidor (não precisa carregar JS)
- ✅ Cache: dados não mudam a cada 5s
- ✅ Image optimization: imagens comprimidas
- ✅ Code splitting: JS em chunks
```

---

## 📱 10. Responsividade: Mobile vs Desktop

```
DESKTOP (1200px+)
┌──────────────────────────────────┐
│        Header / Logo             │
├──────────────────────────────────┤
│           HERO                   │ 1000px altura
├──────────────────────────────────┤
│ CATEGORIAS (4 COLUNAS)           │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │Anéis│ │Colar│ │Pulse│ │Brins│ │
│ └─────┘ └─────┘ └─────┘ └─────┘ │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │ 2 colunas adicionais
│ │Tornz│ │Masc │ │.....│ │.....│ │ (offscreen)
│ └─────┘ └─────┘ └─────┘ └─────┘ │
└──────────────────────────────────┘

MOBILE (320px)
┌──────────────┐
│ Header       │
├──────────────┤
│ HERO 100vh   │
│ (imagem)     │
├──────────────┤
│ CATEGORIAS   │ grid-cols-2 (2 colunas)
│ ┌────┐┌────┐ │
│ │Anéi││Cola│ │
│ ├────┼┤    │ │
│ │Puls││Bri │ │
│ ├────┼├────┤ │
│ │Torn││Masc│ │
│ └────┘└────┘ │
└──────────────┘

Tailwind breakpoints:
- sm: 640px (tablet pequeno)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (desktop grande)

Código:
grid-cols-2 (mobile)
md:grid-cols-4 (desktop)

Resultado:
- 2 colunas em mobile
- 4 colunas em desktop
```

---

## 🚀 Conclusão Visual

```
                    Seu Projeto
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Frontend         Backend         Database
    (React)         (Next.js API)    (Supabase)
        │                │                │
    ┌───┴───┐          ┌──┴──┐          ┌─┴──┐
    │       │          │     │          │    │
   TypeScript      TypeScript        PostgreSQL
   Components      + Routes          + SQL
   + Context       + Types           + Constraints
    │       │          │     │          │    │
    └───┬───┘          └──┬──┘          └─┬──┘
        │                 │               │
        └─────────────────┼───────────────┘
                          │
                   Dados = Product
                   Com propriedade
                   category: Categoria
                   ('Anéis' | 'Colares' |
                    'Pulseiras' | 'Brincos' |
                    'Tornozeleiras' |
                    'Masculino')
```

---

**Pronto! Agora você tem uma visão completa e visual do projeto! 🎉**
