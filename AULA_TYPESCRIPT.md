# 📚 AULA COMPLETA: TypeScript no Projeto Água e Sal Shop

## 🎯 Objetivo da Aula

Esta aula irá te ensinar:
1. **O que é TypeScript** e por que é importante
2. **Cada arquivo do seu projeto** em detalhes
3. **Por baixo dos panos** - como as coisas funcionam
4. **Atividade final** - você vai adicionar 2 novas categorias sozinha!

---

## 📖 PARTE 1: Introdução ao TypeScript

### O que é TypeScript?

TypeScript é um **superset do JavaScript** que adiciona **tipagem estática**. Pense assim:

```typescript
// ❌ JavaScript (sem tipos)
function soma(a, b) {
  return a + b
}
soma(5, 10)      // ✅ 15
soma("5", "10")  // ✅ "510" (concatenou, não somou!)
soma("texto", 10) // ✅ "texto10" (comportamento inesperado!)
```

```typescript
// ✅ TypeScript (com tipos)
function soma(a: number, b: number): number {
  return a + b
}
soma(5, 10)      // ✅ 15
soma("5", "10")  // ❌ ERRO! Você deve passar números, não strings!
soma("texto", 10) // ❌ ERRO! Detected during development!
```

**Benefícios:**
- ✅ Erros detectados **antes** de rodar o código
- ✅ Melhor **autocompletar** no editor
- ✅ Código mais **legível** e **documentado**
- ✅ Refatoração **segura**

### Conceitos Fundamentais

#### 1. **Type (Tipo)**
Define qual tipo de dado uma variável pode ter:

```typescript
// Tipos primitivos
const nome: string = "Água e Sal"
const preco: number = 189.90
const ativo: boolean = true

// Arrays
const categorias: string[] = ['Anéis', 'Colares', 'Pulseiras']
// Ou também:
const categorias: Array<string> = ['Anéis', 'Colares', 'Pulseiras']

// Any (evitar ao máximo!)
let valor: any = 123  // ❌ Não recomendado
```

#### 2. **Interface**
Define a **estrutura de um objeto**:

```typescript
interface Produto {
  id: string
  name: string
  price: number
  category: string
}

// Agora um objeto DEVE ter essas propriedades:
const meuProduto: Produto = {
  id: "123",
  name: "Anel Onda do Mar",
  price: 189.90,
  category: "Anéis"
}
```

#### 3. **Type vs Interface**
- **Type**: Pode descrever primitivos, unions, etc.
- **Interface**: Só para objetos (mais especializada)

```typescript
// Type - mais flexível
type StatusPedido = 'pending' | 'paid' | 'shipped' | 'delivered'

// Interface - mais estruturada
interface Usuario {
  id: string
  email: string
}
```

---

## 🔍 PARTE 2: Analisando o Projeto Arquivo por Arquivo

### 📁 Estrutura Geral

```
aguaesal-shop/
├── tsconfig.json          ← Configuração do TypeScript
├── package.json           ← Dependências do projeto
├── types/
│   └── index.ts          ← ⭐ TIPOS GLOBAIS (IMPORTANTE!)
├── context/
│   └── CartContext.tsx   ← Gerenciamento de carrinho
├── app/
│   ├── page.tsx          ← Página inicial
│   ├── api/              ← APIs (backend)
│   └── admin/            ← Área administrativa
└── lib/
    └── supabase.ts       ← Conexão com banco de dados
```

---

### 1️⃣ **tsconfig.json** - Configuração do TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2017",           // Qual versão JavaScript usar
    "lib": ["dom", "dom.iterable", "esnext"],  // APIs disponíveis
    "allowJs": true,              // Permitir arquivos .js
    "skipLibCheck": true,         // Não verificar tipos de bibliotecas
    "strict": true,               // ✅ MODO RIGOROSO (melhor prática!)
    "noEmit": true,               // Não gerar arquivos .js
    "jsx": "react-jsx",           // Como processar React JSX
    "paths": {
      "@/*": ["./*"]              // Alias para imports (ex: @/types)
    }
  }
}
```

**Explicação em detalhes:**
- `strict: true` - Força você a escrever código mais seguro (sem `any`, sem `null` sem tratar)
- `noEmit: true` - Next.js cuida de compilar, não precisamos do .js gerado
- `paths` - Permite usar `@/types` em vez de `../../../types`

---

### 2️⃣ **types/index.ts** - O Coração do Typing

Este é o **arquivo mais importante** do projeto! Aqui definimos todos os tipos compartilhados:

```typescript
// ============================================
// TIPO: Product (Produto)
// ============================================
export type Product = {
  id: string                    // UUID único do banco
  name: string                  // Nome do produto
  description: string           // Descrição
  price: number                 // Preço em reais
  images: string[]              // Array de URLs de imagens
  category: string              // Categoria (Anéis, Colares, etc)
  stock: number                 // Quantidade em estoque
  created_at: string            // Quando foi criado
  weight?: number               // Peso (opcional - ?)
  width?: number                // Largura (opcional)
  height?: number               // Altura (opcional)
  length?: number               // Comprimento (opcional)
}

// ============================================
// TIPO: CartItem (Item do Carrinho)
// ============================================
export type CartItem = {
  product: Product              // O produto completo
  quantity: number              // Quantidade que o usuário quer
}

// ============================================
// TIPO: Order (Pedido)
// ============================================
export type Order = {
  id: string                    // UUID único do pedido
  user_id: string               // ID do usuário que fez o pedido
  items: CartItem[]             // Array de itens do carrinho
  total: number                 // Total em reais
  status: 'pending' | 'paid' | 'shipped' | 'delivered'  // Estado
  created_at: string            // Quando foi criado
}
```

**Por que isso é importante?**

Se em `context/CartContext.tsx` você usa `Product`, o TypeScript vai verificar se você está usando corretamente todas as propriedades obrigatórias. Se esquecer uma, ele avisa!

---

### 3️⃣ **context/CartContext.tsx** - Gerenciamento de Estado

Este arquivo usa **Context API** do React para compartilhar dados do carrinho em toda a aplicação:

```typescript
'use client'  // ← Diretiva Next.js: executa no cliente (browser)

import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, Product } from '@/types'  // ← Importa os tipos definidos

// ============================================
// TIPO: CartContextType
// ============================================
type CartContextType = {
  items: CartItem[]                      // Lista de itens
  add: (product: Product) => void        // Função para ADICIONAR
  remove: (id: string) => void           // Função para REMOVER
  update: (id: string, quantity: number) => void  // Função para ATUALIZAR QTD
  clearCart: () => void                  // Função para LIMPAR TUDO
  total: number                          // Total em reais (calculado)
  count: number                          // Quantidade total de itens
}

// ============================================
// CRIAR CONTEXT
// ============================================
const CartContext = createContext<CartContextType>({} as CartContextType)
// Cria um contexto vazio inicialmente

// ============================================
// PROVIDER (Provedor - oferece o contexto)
// ============================================
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  // useState<CartItem[]> - o estado é um array de CartItem

  // ============================================
  // FUNÇÃO: add (adicionar produto)
  // ============================================
  const add = (product: Product) => {
    setItems(prev => {
      // Procura se produto já está no carrinho
      const existing = prev.find(i => i.product.id === product.id)
      
      if (existing) {
        // Se existe, aumenta a quantidade
        return prev.map(i => 
          i.product.id === product.id 
            ? { ...i, quantity: i.quantity + 1 }  // Quantidade +1
            : i
        )
      }
      // Se não existe, adiciona novo item
      return [...prev, { product, quantity: 1 }]
    })
  }

  // ============================================
  // FUNÇÃO: remove (remover produto)
  // ============================================
  const remove = (id: string) => 
    setItems(prev => prev.filter(i => i.product.id !== id))
  // Filtra mantendo apenas items com ID diferente

  // ============================================
  // FUNÇÃO: update (atualizar quantidade)
  // ============================================
  const update = (id: string, quantity: number) => {
    if (quantity <= 0) return remove(id)  // Se 0 ou menos, remove
    setItems(prev => 
      prev.map(i => 
        i.product.id === id 
          ? { ...i, quantity }  // Atualiza quantidade
          : i
      )
    )
  }

  // ============================================
  // FUNÇÃO: clearCart (limpar tudo)
  // ============================================
  const clearCart = () => setItems([])

  // ============================================
  // CALCULAR: total e count
  // ============================================
  const total = items.reduce((sum, i) => 
    sum + i.product.price * i.quantity, 0
  )
  // Reduz array a um número: soma(preço × quantidade) de cada item

  const count = items.reduce((sum, i) => 
    sum + i.quantity, 0
  )
  // Reduz array a um número: soma todas as quantidades

  // ============================================
  // RETORNAR: Provider com valores
  // ============================================
  return (
    <CartContext.Provider value={{ items, add, remove, update, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

// ============================================
// HOOK: useCart (usar em qualquer componente)
// ============================================
export const useCart = () => useContext(CartContext)
// Agora você pode fazer: const { items, add, remove } = useCart()
```

**Como usar em um componente:**

```typescript
// Em qualquer componente filho:
'use client'
import { useCart } from '@/context/CartContext'

export function MeuComponente() {
  const { items, add, total } = useCart()
  // Agora você tem acesso aos dados do carrinho!
  
  return <div>Total: R$ {total}</div>
}
```

---

### 4️⃣ **app/page.tsx** - Página Inicial

```typescript
export const dynamic = 'force-dynamic'
// ← Força atualizar dados a cada requisição (não cachear)

import Link from 'next/link'
import Image from 'next/image'
import { getSupabaseServer } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

// ============================================
// FUNÇÃO: getFeaturedProducts (buscar produtos)
// ============================================
async function getFeaturedProducts(): Promise<Product[]> {
  // Promise<Product[]> significa: "vai retornar um array de Product"
  
  const supabase = await getSupabaseServer()
  // Cria conexão com o banco Supabase
  
  const { data } = await supabase
    .from('products')           // Tabela "products"
    .select('*')                // Seleciona tudo
    .order('created_at', { ascending: false })  // Ordena por data (novo primeiro)
    .limit(8)                   // Pega só 8 produtos
  
  return data || []  // Retorna dados ou array vazio
}

// ============================================
// COMPONENTE: Home
// ============================================
export default async function Home() {
  // async porque usa await em getFeaturedProducts()
  
  const products = await getFeaturedProducts()
  // products é agora um array de Product[]

  return (
    <>
      {/* SEÇÃO: Hero (Banner grande no topo) */}
      <section>
        {/* ... JSX para design ... */}
      </section>

      {/* SEÇÃO: Categorias */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2>Nossas Categorias</h2>
        
        {/* MAP: Itera sobre categorias */}
        {['Anéis', 'Colares', 'Pulseiras', 'Brincos'].map(cat => (
          <Link
            key={cat}
            href={`/produtos?categoria=${cat.toLowerCase()}`}
            // ← Cria URL com parâmetro de filtro
          >
            <p>{cat}</p>
          </Link>
        ))}
      </section>

      {/* SEÇÃO: Produtos em Destaque */}
      <section>
        {products.length === 0 ? (
          <p>Em breve...</p>  // Se não tem produtos
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => 
              <ProductCard key={p.id} product={p} />
              // Mapeia cada produto em um ProductCard
            )}
          </div>
        )}
      </section>
    </>
  )
}
```

**Conceitos importantes:**

- `async function` - Função que aguarda operações (fetch de dados)
- `Promise<Product[]>` - "Promessa" de retornar um array de produtos
- `.map()` - Itera sobre array e transforma em JSX
- `key={p.id}` - React precisa de key única para cada item em lista

---

### 5️⃣ **app/api/admin/produtos/route.ts** - API de Criar Produtos

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// ============================================
// FUNÇÃO: getSupabaseAdmin
// ============================================
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
  // ! = "tenho certeza que não é undefined" (force non-null)
}

// ============================================
// HANDLER: POST (criar novo produto)
// ============================================
export async function POST(req: NextRequest) {
  // NextRequest é tipo do Next.js para requisições

  // ============================================
  // VERIFICAR: Está autenticado como admin?
  // ============================================
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json(
      { error: 'Não autorizado' }, 
      { status: 401 }  // 401 = Unauthorized
    )
  }

  // ============================================
  // PEGAR: Dados do corpo da requisição
  // ============================================
  const body = await req.json()
  // body agora contém: { name, price, category, ... }

  // ============================================
  // CONECTAR: Ao banco de dados
  // ============================================
  const supabase = getSupabaseAdmin()

  // ============================================
  // INSERIR: Novo produto
  // ============================================
  const { data, error } = await supabase
    .from('products')      // Tabela
    .insert([body])        // Insert o objeto
    .select()              // Retorna o que foi inserido
    .single()              // Retorna um único resultado (não array)

  // ============================================
  // VERIFICAR: Teve erro?
  // ============================================
  if (error) {
    console.error('Erro ao inserir produto:', JSON.stringify(error))
    return NextResponse.json(
      { error: error.message, details: error }, 
      { status: 500 }  // 500 = Server Error
    )
  }

  // ============================================
  // RETORNAR: Produto criado
  // ============================================
  return NextResponse.json(data)  // Retorna o produto criado
}
```

**Fluxo de uma requisição POST:**

```
1. Cliente envia: POST /api/admin/produtos
   Body: { name: "Anel Onda", price: 189.90, category: "Anéis" }

2. Servidor recebe em route.ts

3. Verifica: admin_auth cookie === 'true'?
   ✅ Sim → continua
   ❌ Não → retorna 401 Unauthorized

4. Pega dados: const body = await req.json()

5. Insere no Supabase:
   INSERT INTO products VALUES (...)

6. Retorna:
   { id: "123", name: "Anel Onda", ... }
```

---

### 6️⃣ **supabase-schema.sql** - Estrutura do Banco de Dados

```sql
-- ============================================
-- TABELA: products
-- ============================================
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- UUID = Unique ID gerado automaticamente
  
  name TEXT NOT NULL,
  -- NOT NULL = obrigatório ter valor
  
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  -- NUMERIC(10,2) = até 99.999.999,99 (8 dígitos + 2 decimais)
  
  images TEXT[] DEFAULT '{}',
  -- TEXT[] = array de strings (múltiplas URLs)
  -- DEFAULT '{}' = começa vazio se não informado
  
  category TEXT,
  -- Categoria do produto (Anéis, Colares, etc)
  
  stock INTEGER DEFAULT 0,
  -- INTEGER = número inteiro
  
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- TIMESTAMPTZ = data/hora com zona de tempo
  -- DEFAULT NOW() = preenche com data/hora atual
);

-- ============================================
-- DADOS DE EXEMPLO
-- ============================================
INSERT INTO products VALUES
  -- id gerado automaticamente
  -- name, description, price, images, category, stock
  ('Anel Onda do Mar', '...', 189.90, '{}', 'Anéis', 10),
  ('Colar Gota Praiana', '...', 249.90, '{}', 'Colares', 8),
  -- ... mais produtos ...
;
```

---

## 🧠 PARTE 3: Por Baixo dos Panos (Deep Dive)

### Como TypeScript Funciona Internamente?

#### 1. **Verificação de Tipos em Tempo de Compilação**

```typescript
// Seu código TypeScript:
const produto: Product = {
  id: "123",
  name: "Anel",
  price: 189.90,
  // ❌ Faltando: category, stock, images, created_at, description
}

// TypeScript durante compilação:
// ⚠️ ERRO: Property 'category' is missing in type '{...}'

// Você corrige:
const produto: Product = {
  id: "123",
  name: "Anel",
  price: 189.90,
  category: "Anéis",  ✅
  stock: 10,          ✅
  images: [],         ✅
  created_at: new Date().toISOString(),  ✅
  description: "...", ✅
}

// ✅ Agora compila com sucesso!
```

#### 2. **Type Inference (Inferência de Tipos)**

```typescript
// TypeScript consegue adivinhar o tipo:
const nome = "Água e Sal"  // TypeScript sabe que é string
const preco = 189.90       // TypeScript sabe que é number
const ativo = true         // TypeScript sabe que é boolean

nome.toUpperCase()  // ✅ OK (string tem este método)
nome.toFixed(2)     // ❌ ERRO (string não tem este método!)
```

#### 3. **Union Types (Tipos Alternativos)**

```typescript
// Status pode ser UMA DESSAS opções:
type StatusPedido = 'pending' | 'paid' | 'shipped' | 'delivered'

const meuStatus: StatusPedido = 'paid'  // ✅ OK
const meuStatus: StatusPedido = 'enviado'  // ❌ ERRO! Não é uma opção válida

// Útil em validação:
if (status === 'paid') {
  // Enviar para transportadora
} else if (status === 'shipped') {
  // Atualizar rastreamento
} else if (status === 'delivered') {
  // Enviar e-mail de confirmação
}
// Se esquecer um status, TypeScript avisa!
```

#### 4. **Generic Types (Tipos Genéricos)**

```typescript
// Sem genéricos:
type ArrayAny = {
  items: any[]  // Pode ser qualquer coisa!
}

// Com genéricos:
type ArrayGenerico<T> = {
  items: T[]    // T = tipo que você vai especificar
}

// Usando:
const produtos: ArrayGenerico<Product> = {
  items: [
    { id: "1", name: "Anel", ... },
    { id: "2", name: "Colar", ... }
  ]
}
```

#### 5. **Optional Properties (Propriedades Opcionais)**

```typescript
type Product = {
  id: string           // OBRIGATÓRIO
  name: string         // OBRIGATÓRIO
  weight?: number      // OPCIONAL (pode ter ou não)
}

const anel: Product = {
  id: "123",
  name: "Anel Onda"
  // weight não é necessário! ✅
}

const pulseira: Product = {
  id: "456",
  name: "Pulseira Maré",
  weight: 15.5  // Ou pode incluir
}
```

#### 6. **Readonly (Somente Leitura)**

```typescript
type Categoria = {
  readonly id: string
  readonly nome: string
}

const categoria: Categoria = { id: "1", nome: "Anéis" }

categoria.nome = "Colares"  // ❌ ERRO! Readonly
// Protege contra modificações acidentais
```

---

## 🛠️ PARTE 4: Por Que o Projeto é Organizado Assim?

### Arquitetura Explicada

```
types/
└── index.ts
    └── Define TODOS os tipos compartilhados
       └── Qualquer arquivo pode usar `import { Product } from '@/types'`

context/
└── CartContext.tsx
    └── Compartilha estado (carrinho) entre componentes
       └── Usa React Context API
          └── Qualquer componente pode fazer `const { items } = useCart()`

app/
├── page.tsx (Frontend - renderiza HTML no servidor)
├── api/ (Backend - processa dados)
│   └── admin/produtos/route.ts (POST /api/admin/produtos)
│
└── admin/
    └── login/ (Área protegida)
```

### Por que separar em arquivos?

✅ **Reusabilidade**: Tipos em `types/` podem ser usados em vários arquivos
✅ **Manutenção**: Se muda a estrutura de Product, muda em 1 lugar
✅ **Testabilidade**: Cada função é independente
✅ **Escalabilidade**: Fácil adicionar mais categorias/funcionalidades

---

## 🎓 PARTE 5: Atividade Final - Adicione Categorias!

### Objetivo:
Você vai adicionar **2 novas categorias**: "Tornozeleiras" e "Masculino"

### Como as categorias funcionam atualmente?

**1. Hardcoded em `app/page.tsx`:**

```typescript
{['Anéis', 'Colares', 'Pulseiras', 'Brincos'].map(cat => (
  // mapeia sobre esse array fixo
))}
```

**Problema**: Se quer adicionar categoria, precisa editar código.

**2. No banco de dados:**

As categorias vêm da coluna `category` na tabela `products`:

```sql
INSERT INTO products VALUES
  (..., 'Anéis', ...),
  (..., 'Colares', ...),
  (..., 'Pulseiras', ...),
  (..., 'Brincos', ...)
```

---

### 🎯 Passo 1: Adicionar Categorias no Banco

Você precisa **garantir que o banco conhece as novas categorias**:

**Opção A - Adicionar constraint (recomendado):**

No `supabase-schema.sql`, modifique a tabela `products` para ter um CONSTRAINT que define categorias válidas:

```sql
-- ANTES (sem validação):
category TEXT,

-- DEPOIS (com validação):
category TEXT CHECK (category IN ('Anéis', 'Colares', 'Pulseiras', 'Brincos')),
```

**Para adicionar as novas categorias, troque por:**

```sql
category TEXT CHECK (category IN ('Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino')),
```

---

### 🎯 Passo 2: Atualizar o Array em `app/page.tsx`

Encontre esta linha em `app/page.tsx`:

```typescript
{['Anéis', 'Colares', 'Pulseiras', 'Brincos'].map(cat => (
```

**Altere para:**

```typescript
{['Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino'].map(cat => (
```

---

### 🎯 Passo 3: Criar Tipo para Categorias (Melhor Prática)

No `types/index.ts`, adicione um novo tipo para categorias:

```typescript
// ANTES (types/index.ts)
export type Product = {
  // ...
  category: string  // ← Pode ser qualquer string (perigoso!)
  // ...
}

// DEPOIS (types/index.ts)
export type Categoria = 'Anéis' | 'Colares' | 'Pulseiras' | 'Brincos' | 'Tornozeleiras' | 'Masculino'

export type Product = {
  // ...
  category: Categoria  // ← Só pode ser uma dessas 6 opções!
  // ...
}
```

**Agora se tentar criar um produto com categoria inválida:**

```typescript
const produto: Product = {
  // ...
  category: "Sapatilhas"  // ❌ ERRO! Não está na lista de Categoria
}
```

---

### 🎯 Passo 4: Adicionar Dados de Exemplo

Em `supabase-schema.sql`, adicione exemplos das novas categorias:

```sql
-- APÓS os INSERT atuais, adicione:
INSERT INTO products (name, description, price, images, category, stock) VALUES
  ('Tornozeleira Onda Delicada', 'Tornozeleira em prata 925 com design minimalista.', 129.90, '{}', 'Tornozeleiras', 8),
  ('Anel Masculino Minimalista', 'Anel em prata 925 com design robusto e moderno.', 199.90, '{}', 'Masculino', 6);
```

---

### ✅ Checklist da Atividade:

- [ ] Entendi como tipos funcionam em TypeScript
- [ ] Identifiquei onde as categorias estão definidas
- [ ] Atualizei o constraint no banco de dados (`supabase-schema.sql`)
- [ ] Atualizei o array em `app/page.tsx`
- [ ] Criei o tipo `Categoria` em `types/index.ts`
- [ ] Atualizei a propriedade `category: Categoria` em `Product`
- [ ] Adicionei dados de exemplo no SQL
- [ ] Testei filtrando por "tornozeleiras" em `/produtos?categoria=tornozeleiras`

---

## 📚 Resumo da Aula

### TypeScript:
- Adiciona **tipagem** ao JavaScript
- Erros detectados **antes** de rodar
- Tipos = contrato que objetos devem seguir

### Projeto estruturado:
- `types/` - Definições compartilhadas
- `context/` - Estado global
- `app/` - Interface e lógica
- `api/` - Backend (criar, atualizar, deletar)

### Por baixo dos panos:
- TypeScript compila para JavaScript
- Verifica tipos **em tempo de desenvolvimento**
- Genéricos permitem código reutilizável
- Union types permitem valores específicos

### Adicionar categorias:
- Atualizar banco de dados (constraint)
- Atualizar tipo em `types/index.ts`
- Atualizar array em componentes
- Adicionar dados de exemplo

---

## 🚀 Próximos Passos (Fora desta aula)

1. Criar página `/admin/categorias` para gerenciar categorias dinamicamente
2. Buscar categorias do banco em vez de hardcoded
3. Adicionar validação em tempo de compilação
4. Implementar cache de categorias
5. Criar testes automatizados com Jest

---

**Boa sorte na atividade! 🎉**

Se tiver dúvidas sobre cada passo, consulte este documento novamente.
