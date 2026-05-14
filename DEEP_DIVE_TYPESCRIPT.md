# 🔍 DEEP DIVE: Por Baixo dos Panos - TypeScript em Profundidade

## 📌 Índice
1. Como TypeScript é compilado
2. Sistema de tipos em detalhes
3. Type narrowing e type guards
4. Genéricos avançados
5. Discriminated unions
6. Type safety em APIs
7. Performance e otimizações

---

## 1️⃣ Como TypeScript é Compilado

### O Processo Completo

```
┌──────────────────────────────────────────┐
│  Seu código TypeScript (.ts/.tsx)         │
│  exemplo: const x: number = 5             │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  TypeScript Compiler (tsc)                │
│  - Lê o código                            │
│  - Verifica tipos                         │
│  - Detecta erros                          │
└──────────────────────────────────────────┘
                    ↓
         ┌─────────────────────┐
         │  Erros encontrados? │
         └─────────────────────┘
              ↙          ↘
            SIM           NÃO
             ↓             ↓
       Mostra ERRO     Compila para
       Não continua    JavaScript
             ↓             ↓
          PARADO      ┌──────────────────┐
                      │ JavaScript (.js)  │
                      │ const x = 5;      │
                      └──────────────────┘
                             ↓
                       ┌──────────────────┐
                       │  Node.js executa │
                       │ o JavaScript     │
                       └──────────────────┘
```

### Exemplo Real

**Seu código TypeScript:**
```typescript
// arquivo.ts
const preco: number = 189.90
const categoria: string = "Anéis"

function formatarPreco(valor: number): string {
  return `R$ ${valor.toFixed(2)}`
}

console.log(formatarPreco(preco))
```

**Após compilação para JavaScript:**
```javascript
// arquivo.js (gerado automaticamente)
// Os tipos DESAPARECEM!
const preco = 189.90
const categoria = "Anéis"

function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2)}`
}

console.log(formatarPreco(preco))
```

**Pontos-chave:**
- ✅ TypeScript types existem **apenas em desenvolvimento**
- ✅ No JavaScript final, tipos foram removidos
- ✅ Não há penalty de performance (tipos não vão pro navegador/servidor)
- ✅ TypeScript é um "tipo checking language", não uma linguagem de runtime

---

## 2️⃣ Sistema de Tipos em Detalhes

### 2.1 Union Types (Tipos Alternativos)

```typescript
// ===== PROBLEMA SEM UNION =====
type Resposta = string | boolean
// Significa: Pode ser string OU boolean, não ambos

const respostaSim: Resposta = "sim"      // ✅ OK (string)
const respostaNao: Resposta = false      // ✅ OK (boolean)
const respostaMaybe: Resposta = 42       // ❌ ERRO (não é string nem boolean)

// ===== USO PRÁTICO NO PROJETO =====
export type StatusPedido = 'pending' | 'paid' | 'shipped' | 'delivered'

// Isso evita:
const status1: StatusPedido = 'enviado'    // ❌ ERRO!
const status2: StatusPedido = 'paid'       // ✅ OK
```

### 2.2 Intersection Types (Combinação de Tipos)

```typescript
// ===== COMBINAR MÚLTIPLOS TIPOS =====
type Pessoa = {
  nome: string
  idade: number
}

type Profissional = {
  profissao: string
  experiencia: number
}

// Intersection (&) = combina ambos
type PessoaProfissional = Pessoa & Profissional

const joao: PessoaProfissional = {
  nome: "João",
  idade: 30,
  profissao: "Designer",
  experiencia: 5
}

// João tem que ter TODAS essas propriedades

// ===== USO NO PROJETO =====
type ProductComEstoque = Product & {
  quantidadeDisponivel: number
}

// Agora Product ganhou uma propriedade extra
```

### 2.3 Conditional Types (Tipos Condicionais)

```typescript
// ===== TIPO QUE MUDA BASEADO EM CONDIÇÃO =====
type IsString<T> = T extends string ? true : false

type A = IsString<"hello">              // ✅ true
type B = IsString<42>                   // ✅ false
type C = IsString<string>               // ✅ true

// ===== CASO DE USO REAL =====
// Se passar Product, retorna Product[]
// Se passar string, retorna string[]
type ArrayOf<T> = T extends any ? T[] : never

type ProductArray = ArrayOf<Product>    // Product[]
type StringArray = ArrayOf<string>      // string[]
```

### 2.4 Utility Types (Tipos Utilitários)

```typescript
// ===== PARTIAL: Todas propriedades opcionais =====
type ProductParcial = Partial<Product>
// Equivalente a:
type ProductParcial = {
  id?: string
  name?: string
  price?: number
  // ... tudo agora é opcional
}

// ===== REQUIRED: Todas propriedades obrigatórias =====
type ProductCompleto = Required<Product>
// Faz properties que eram opcionais virar obrigatórias

// ===== PICK: Selecionar apenas alguns campos =====
type ProductInfo = Pick<Product, 'id' | 'name' | 'price'>
// Equivalente a:
type ProductInfo = {
  id: string
  name: string
  price: number
}

// ===== OMIT: Remover alguns campos =====
type ProductSemPreco = Omit<Product, 'price'>
// Remove a propriedade 'price' de Product

// ===== RECORD: Mapear keys para values =====
type CategoriaStats = Record<Categoria, number>
// Equivalente a:
type CategoriaStats = {
  'Anéis': number
  'Colares': number
  'Pulseiras': number
  'Brincos': number
  'Tornozeleiras': number
  'Masculino': number
}

const stats: CategoriaStats = {
  'Anéis': 10,
  'Colares': 8,
  'Pulseiras': 15,
  'Brincos': 12,
  'Tornozeleiras': 8,
  'Masculino': 6
}
```

---

## 3️⃣ Type Narrowing e Type Guards

### O Problema

```typescript
type Resultado = string | number | boolean

function processar(valor: Resultado) {
  // TypeScript não sabe qual tipo é!
  console.log(valor.length)     // ❌ ERRO!
  // Porque número não tem .length
}
```

### Solução 1: Type Guards com `typeof`

```typescript
type Resultado = string | number | boolean

function processar(valor: Resultado) {
  // ===== VERIFICAR TIPO =====
  if (typeof valor === 'string') {
    // Dentro deste bloco, TypeScript SABE que é string
    console.log(valor.length)     // ✅ OK! String tem .length
    console.log(valor.toUpperCase())  // ✅ OK!
  } else if (typeof valor === 'number') {
    // Dentro deste bloco, é number
    console.log(valor.toFixed(2))   // ✅ OK! Number tem .toFixed()
  } else {
    // Aqui é boolean (por eliminação)
    console.log(!valor)              // ✅ OK!
  }
}

processar("hello")     // ✅ String
processar(42)          // ✅ Number
processar(true)        // ✅ Boolean
```

### Solução 2: Type Guards com `instanceof`

```typescript
class Produto {
  constructor(public name: string, public price: number) {}
}

class Pedido {
  constructor(public id: string, public items: Produto[]) {}
}

type ItemTenda = Produto | Pedido

function processar(item: ItemTenda) {
  if (item instanceof Produto) {
    // TypeScript sabe que é Produto
    console.log(item.price)      // ✅ OK
  } else if (item instanceof Pedido) {
    // TypeScript sabe que é Pedido
    console.log(item.id)         // ✅ OK
  }
}
```

### Solução 3: Custom Type Guards

```typescript
// ===== CRIAR FUNÇÃO PARA VERIFICAR TIPO =====
function isProduct(obj: any): obj is Product {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number'
  )
}

// ===== USAR NO CÓDIGO =====
function processar(valor: unknown) {
  if (isProduct(valor)) {
    // Aqui TypeScript tem CERTEZA que é Product
    console.log(valor.price)     // ✅ OK
  }
}
```

---

## 4️⃣ Genéricos Avançados

### O Problema: Código Repetido

```typescript
// ❌ Sem genéricos - código repetido
type ProductArray = {
  items: Product[]
  add: (product: Product) => void
  remove: (id: string) => void
}

type OrderArray = {
  items: Order[]
  add: (order: Order) => void
  remove: (id: string) => void
}

type UserArray = {
  items: User[]
  add: (user: User) => void
  remove: (id: string) => void
}
// Mesma estrutura, diferentes tipos!
```

### Solução: Genéricos

```typescript
// ✅ Com genéricos - reusável
type Container<T> = {
  items: T[]
  add: (item: T) => void
  remove: (id: string) => void
}

// Agora use para qualquer tipo:
type ProductContainer = Container<Product>
type OrderContainer = Container<Order>
type UserContainer = Container<User>

// Ou em funções:
function processar<T>(item: T): T {
  // T é um placeholder para qualquer tipo
  console.log(item)
  return item
}

processar<string>("hello")     // T = string
processar<number>(42)          // T = number
processar<Product>(meuProduto) // T = Product
```

### Genéricos com Constraints

```typescript
// ===== SEM CONSTRAINTS - pode ser qualquer coisa =====
function getId<T>(obj: T): any {
  // ❌ Problema: obj pode não ter .id
  return obj.id    // ERRO!
}

// ===== COM CONSTRAINTS - deve ter .id =====
function getId<T extends { id: string }>(obj: T): string {
  // ✅ Agora TypeScript sabe que T tem .id
  return obj.id    // OK!
}

getId({ id: "123", name: "João" })        // ✅ OK
getId({ id: "456" })                      // ✅ OK
getId({ name: "João" })                   // ❌ ERRO! Falta .id
```

### Genéricos com `keyof`

```typescript
// ===== PEGAR VALOR DE PROPRIEDADE =====
type Product = {
  id: string
  name: string
  price: number
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  // K extends keyof T = K deve ser uma propriedade de T
  return obj[key]
}

const produto: Product = {
  id: "123",
  name: "Anel",
  price: 189.90
}

getProperty(produto, 'name')      // ✅ OK - 'name' é propriedade
getProperty(produto, 'id')        // ✅ OK - 'id' é propriedade
getProperty(produto, 'descricao') // ❌ ERRO! 'descricao' não existe
```

---

## 5️⃣ Discriminated Unions

### O Problema

```typescript
type Result = {
  success: boolean
  data?: any
  error?: string
}

function processar(resultado: Result) {
  if (resultado.success) {
    console.log(resultado.data)   // ⚠️ Pode ser undefined!
  } else {
    console.log(resultado.error)  // ⚠️ Pode ser undefined!
  }
}
```

### Solução: Discriminated Union

```typescript
// ===== DUAS VERSÕES DISTINTAS =====
type SuccessResult = {
  success: true           // ← Discriminador
  data: any
}

type ErrorResult = {
  success: false          // ← Discriminador
  error: string
}

type Result = SuccessResult | ErrorResult

// ===== USAR =====
function processar(resultado: Result) {
  if (resultado.success) {
    // TypeScript SABE que tem .data
    console.log(resultado.data)   // ✅ OK
  } else {
    // TypeScript SABE que tem .error
    console.log(resultado.error)  // ✅ OK
  }
}

// ===== EXEMPLO REAL DO PROJETO =====
type PedidoPending = {
  status: 'pending'
  // Só dados pendentes
}

type PedidoPaid = {
  status: 'paid'
  paymentId: string
  paymentDate: string
}

type PedidoShipped = {
  status: 'shipped'
  shippingId: string
  estimatedDelivery: string
}

type Pedido = PedidoPending | PedidoPaid | PedidoShipped

function enviarNotificacao(pedido: Pedido) {
  switch(pedido.status) {
    case 'pending':
      // Aqui pedido é PedidoPending
      console.log("Aguardando pagamento")
      break
    case 'paid':
      // Aqui pedido é PedidoPaid
      console.log(`Pago em: ${pedido.paymentDate}`)
      break
    case 'shipped':
      // Aqui pedido é PedidoShipped
      console.log(`Entrega em: ${pedido.estimatedDelivery}`)
      break
  }
}
```

---

## 6️⃣ Type Safety em APIs

### Como o Projeto Usa Tipos em APIs

```typescript
// ===== FRONT-END: dados sendo enviados =====
const criarProduto = async (dados: Product) => {
  // TypeScript valida:
  // ✅ Tem id, name, price, category, etc?
  
  const resposta = await fetch('/api/admin/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)  // Seguro: tipos validados
  })
  
  return await resposta.json()
}

// ===== BACK-END: receber dados =====
export async function POST(req: NextRequest) {
  const body = await req.json()
  // ⚠️ Aqui body é any! Não tem tipos!
  
  // Solução: validar manualmente
  const dados: Product = {
    id: body.id,
    name: body.name,
    price: body.price,
    category: body.category,
    // ... se propriedade não existir, erro!
  }
  
  // Ou usar schema validation (melhor prática):
  // import { z } from 'zod'
  // const ProductSchema = z.object({...})
}
```

### Resposta com Tipos

```typescript
// ===== TIPO PARA RESPOSTA DE API =====
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

// ===== FETCH COM TIPOS =====
async function buscarProdutos(): Promise<ApiResponse<Product[]>> {
  const resposta = await fetch('/api/produtos')
  return await resposta.json()
}

// ===== USO =====
const resultado = await buscarProdutos()

if (resultado.success) {
  // TypeScript sabe que resultado.data é Product[]
  resultado.data.forEach(p => {
    console.log(p.name)     // ✅ OK
  })
} else {
  console.log(resultado.error)  // ✅ OK
}
```

---

## 7️⃣ Performance e Otimizações

### 7.1 `as const` para Values Imutáveis

```typescript
// ❌ Tipo muito genérico
const categorias = ['Anéis', 'Colares', 'Pulseiras', 'Brincos']
// TypeScript pensa: string[]

// ✅ Tipo mais específico
const categorias = ['Anéis', 'Colares', 'Pulseiras', 'Brincos'] as const
// TypeScript pensa: readonly ["Anéis", "Colares", "Pulseiras", "Brincos"]

// Benefício:
type Categoria = typeof categorias[number]
// Resultado: 'Anéis' | 'Colares' | 'Pulseiras' | 'Brincos'
// Agora tipo vem diretamente do array!
```

### 7.2 Lazy Evaluation de Tipos

```typescript
// ❌ Calcula tipo a cada uso
type ManyPropertiesObject = {
  prop1: string
  prop2: string
  prop3: string
  // ... centenas de propriedades
}

// ✅ Calcula uma vez
type ManyPropertiesObject = {
  prop1: string
} & {
  prop2: string
} & {
  prop3: string
}
```

### 7.3 Escrever Tipos Menores

```typescript
// ❌ Tipo grande - processo lento
type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  created_at: string
  weight?: number
  width?: number
  height?: number
  length?: number
  reviews?: Review[]
  ratings?: number[]
  seller?: Seller
  warehouse?: Warehouse
  // ... muitas coisas
}

// ✅ Tipos menores - mais rápido
type ProductCore = Pick<Product, 'id' | 'name' | 'price' | 'category'>
type ProductDetailed = Product

// Use ProductCore para listas, ProductDetailed para página
```

---

## 🎯 Aplicando ao Projeto Água e Sal

### Como o Projeto Usa Tipos Avançados

#### 1. **Discriminated Union para Status de Pedido**

```typescript
// types/index.ts
export type Order = 
  | {
      id: string
      status: 'pending'
      user_id: string
      items: CartItem[]
      created_at: string
    }
  | {
      id: string
      status: 'paid'
      user_id: string
      items: CartItem[]
      total: number
      paymentId: string
      created_at: string
    }
  | {
      id: string
      status: 'shipped'
      user_id: string
      items: CartItem[]
      total: number
      shippingId: string
      estimatedDelivery: string
      created_at: string
    }
  | {
      id: string
      status: 'delivered'
      user_id: string
      items: CartItem[]
      total: number
      deliveredAt: string
      created_at: string
    }
```

#### 2. **Genéricos para Container Reutilizável**

```typescript
// Usar genéricos no CartContext
type Container<T> = {
  items: T[]
  add: (item: T) => void
  remove: (id: string) => void
  update: (id: string, quantity: number) => void
}

// CartContextType reutiliza Container
type CartContextType = Container<CartItem> & {
  clearCart: () => void
  total: number
  count: number
}
```

---

## 📚 Resumo: Arquitetura de Tipos do Projeto

```
┌─────────────────────────────────────┐
│      types/index.ts                 │
│  (Tipos Globais - Single Source)    │
├─────────────────────────────────────┤
│ - Categoria (Union type)            │
│ - Product (Type com Optional Props) │
│ - CartItem (Intersection)           │
│ - Order (Discriminated Union)       │
└─────────────────────────────────────┘
           ↓  (importado por)  ↓
     ┌────────────────────────────────┐
     │   context/CartContext.tsx      │
     │   (Generic Type)               │
     └────────────────────────────────┘
           ↓  (importado por)  ↓
     ┌────────────────────────────────┐
     │   components/                  │
     │   - ProductCard                │
     │   - ProductForm                │
     └────────────────────────────────┘
```

---

## 🚀 Checklist de Compreensão

- [ ] Entendo como TypeScript compila para JavaScript
- [ ] Sei a diferença entre Union e Intersection
- [ ] Consigo usar Type Narrowing com `typeof` e `instanceof`
- [ ] Entendo Genéricos e por que são úteis
- [ ] Consigo identificar Discriminated Unions no projeto
- [ ] Conheço Utility Types como `Partial`, `Pick`, `Omit`
- [ ] Sei como validar tipos em APIs
- [ ] Entendo `as const` e quando usar

---

**Parabéns! Você agora entende TypeScript em profundidade! 🎉**
