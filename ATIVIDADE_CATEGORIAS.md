# 🎯 GUIA PRÁTICO: Adicione Categorias - Passo a Passo

## 📝 Resumo Rápido do Que Vai Fazer

Você vai adicionar 2 categorias ao projeto:
- ✅ **Tornozeleiras**
- ✅ **Masculino**

Estas categorias aparecem em 3 lugares:
1. **Tipo TypeScript** - Define que category só pode ter esses valores
2. **Página inicial** - Array que aparece visualmente
3. **Banco de dados** - Constraint que valida ao inserir

---

## 🔧 Ferramentas Que Você Precisa

- **VS Code** - seu editor
- **Git** - para ver o que mudou (opcional)
- Conexão com seu **Supabase** (se quiser testar de verdade)

---

## 🎓 Entenda Antes de Fazer

### O que é um "Tipo" em TypeScript?

```typescript
// Sem tipo (perigoso):
const categoria = "Sapatos"  // Pode ser qualquer coisa

// Com tipo (seguro):
type Categoria = 'Anéis' | 'Colares' | 'Pulseiras' | 'Brincos'
const categoria: Categoria = "Sapatos"  // ❌ ERRO! Não existe

// Com tipo atualizado:
type Categoria = 'Anéis' | 'Colares' | 'Pulseiras' | 'Brincos' | 'Tornozeleiras' | 'Masculino'
const categoria: Categoria = "Tornozeleiras"  // ✅ OK!
```

### Como funciona o array de categorias?

```typescript
// Em app/page.tsx linha ~58:
{['Anéis', 'Colares', 'Pulseiras', 'Brincos'].map(cat => (
  <Link href={`/produtos?categoria=${cat.toLowerCase()}`}>
    {cat}
  </Link>
))}
```

Isso cria links assim:
- `/produtos?categoria=anéis`
- `/produtos?categoria=colares`
- `/produtos?categoria=pulseiras`
- `/produtos?categoria=brincos`

**Seu trabalho:** adicionar dois links a mais para tornozeleiras e masculino

---

## ✅ ATIVIDADE PRÁTICA - Siga os Passos

### 🏃 PASSO 1: Abrir `types/index.ts`

**Arquivo:** `c:\Users\Windows 10\Desktop\aguaesal-shop\types\index.ts`

**O que você vê agora:**
```typescript
export type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string  // ← AQUI! Pode ser qualquer string
  stock: number
  created_at: string
  weight?: number
  width?: number
  height?: number
  length?: number
}
```

**O que você precisa fazer:**

1. **Adicione um novo tipo ACIMA de `Product`:**

```typescript
// ADICIONE ISTO AQUI (antes de export type Product)
export type Categoria = 
  | 'Anéis'
  | 'Colares'
  | 'Pulseiras'
  | 'Brincos'
  | 'Tornozeleiras'
  | 'Masculino'
```

2. **Mude a linha `category: string` para:**

```typescript
category: Categoria  // Era string, agora é Categoria
```

**Resultado esperado:**
```typescript
export type Categoria = 
  | 'Anéis'
  | 'Colares'
  | 'Pulseiras'
  | 'Brincos'
  | 'Tornozeleiras'
  | 'Masculino'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: Categoria  // ← Mudou aqui!
  stock: number
  created_at: string
  weight?: number
  width?: number
  height?: number
  length?: number
}
```

**Por que fazer isso?**
- ✅ TypeScript vai avisar se tentar usar categoria inválida
- ✅ Editor terá autocompletar melhor
- ✅ Seu código fica mais seguro

---

### 🏃 PASSO 2: Atualizar `app/page.tsx`

**Arquivo:** `c:\Users\Windows 10\Desktop\aguaesal-shop\app\page.tsx`

**Procure por (linha ~58):**
```typescript
{['Anéis', 'Colares', 'Pulseiras', 'Brincos'].map(cat => (
  <Link
    key={cat}
    href={`/produtos?categoria=${cat.toLowerCase()}`}
    className="bg-[#1e3a5f] text-white text-center py-8 rounded-sm hover:bg-[#2a4f7c] transition-colors"
  >
    <p className="font-playfair text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>{cat}</p>
    <p className="text-blue-200 text-xs tracking-widest mt-1 uppercase">Ver peças</p>
  </Link>
))}
```

**Mude para:**
```typescript
{['Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino'].map(cat => (
  <Link
    key={cat}
    href={`/produtos?categoria=${cat.toLowerCase()}`}
    className="bg-[#1e3a5f] text-white text-center py-8 rounded-sm hover:bg-[#2a4f7c] transition-colors"
  >
    <p className="font-playfair text-xl" style={{ fontFamily: 'var(--font-playfair)' }}>{cat}</p>
    <p className="text-blue-200 text-xs tracking-widest mt-1 uppercase">Ver peças</p>
  </Link>
))}
```

**Mudança:** `['Anéis', 'Colares', 'Pulseiras', 'Brincos']` → `['Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino']`

**Por que fazer isso?**
- ✅ As categorias aparecem na página inicial
- ✅ Cria links `/produtos?categoria=tornozeleiras` e `/produtos?categoria=masculino`
- ✅ Usuários conseguem filtrar por essas categorias

---

### 🏃 PASSO 3: Atualizar `supabase-schema.sql`

**Arquivo:** `c:\Users\Windows 10\Desktop\aguaesal-shop\supabase-schema.sql`

**Procure por (linha ~6):**
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  images text[] default '{}',
  category text,
  -- ↑ AQUI! Sem validação
  stock integer default 0,
  created_at timestamptz default now()
);
```

**Mude `category text,` para:**
```sql
category text check (category in ('Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino')),
```

**Resultado:**
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  images text[] default '{}',
  category text check (category in ('Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino')),
  -- ↑ AGORA tem validação!
  stock integer default 0,
  created_at timestamptz default now()
);
```

**Por que fazer isso?**
- ✅ Banco de dados **rejeita** categorias inválidas
- ✅ Se código tentar inserir "Sapatos", banco retorna ERRO
- ✅ Protege integridade dos dados

---

### 🏃 PASSO 4: Adicionar Exemplos no Banco (Opcional)

**Arquivo:** `c:\Users\Windows 10\Desktop\aguaesal-shop\supabase-schema.sql`

**Procure pelo INSERT de dados (linha ~40):**
```sql
insert into products (name, description, price, images, category, stock) values
  ('Anel Onda do Mar', '...', 189.90, '{}', 'Anéis', 10),
  ('Colar Gota Praiana', '...', 249.90, '{}', 'Colares', 8),
  ('Pulseira Maré', '...', 159.90, '{}', 'Pulseiras', 15),
  ('Brinco Concha', '...', 129.90, '{}', 'Brincos', 12);
```

**Adicione no final (ANTES do `;`):**
```sql
insert into products (name, description, price, images, category, stock) values
  ('Anel Onda do Mar', 'Anel delicado em prata 925 com design de onda. Símbolo de liberdade e movimento.', 189.90, '{}', 'Anéis', 10),
  ('Colar Gota Praiana', 'Colar em prata 925 com pingente de gota. Leveza e elegância para o dia a dia.', 249.90, '{}', 'Colares', 8),
  ('Pulseira Maré', 'Pulseira em prata 925 com detalhes de ondas. Perfeita para usar sozinha ou em conjunto.', 159.90, '{}', 'Pulseiras', 15),
  ('Brinco Concha', 'Brinco em prata 925 com formato de concha. Delicado e cheio de personalidade.', 129.90, '{}', 'Brincos', 12),
  ('Tornozeleira Onda Delicada', 'Tornozeleira em prata 925 com design minimalista e elegante.', 129.90, '{}', 'Tornozeleiras', 8),
  ('Anel Masculino Minimalista', 'Anel em prata 925 com design robusto e moderno para homens.', 199.90, '{}', 'Masculino', 6);
```

**Por que fazer isso?**
- ✅ Testa se a nova categoria funciona
- ✅ Dá exemplos de produtos em cada categoria
- ✅ Usuários conseguem ver as novas categorias funcionando

---

## 🧪 Teste Seu Trabalho

### Teste 1: TypeScript Compilation ✅

Você pode verificar se TypeScript está feliz:

```bash
# No terminal, dentro do projeto:
npx tsc --noEmit
```

Se tudo está certo, **não mostra erro nenhum**.

Se tiver erro, aparece algo como:
```
error TS2322: Type '"Sapatos"' is not assignable to type 'Categoria'
```

---

### Teste 2: Visual na Página ✅

1. Inicie o servidor: `npm run dev`
2. Abra: `http://localhost:3000`
3. Scroll para seção "Nossas Categorias"
4. Veja se aparecem **6 categorias** (era 4, agora é 6)
5. Clique em "Tornozeleiras" - deve ir para `/produtos?categoria=tornozeleiras`
6. Clique em "Masculino" - deve ir para `/produtos?categoria=masculino`

---

### Teste 3: Banco de Dados ✅

Se está usando Supabase:

1. Vá para: https://app.supabase.com
2. Seu projeto → SQL Editor
3. Cole todo o conteúdo de `supabase-schema.sql`
4. Clique "Run"
5. Vá para "Table Editor"
6. Procure tabela "products"
7. Veja os produtos - devem ter as novas categorias

Se tentar adicionar produto com categoria inválida:
```sql
INSERT INTO products (name, price, category) 
VALUES ('Test', 100, 'Sapatos');

-- ❌ Error: new row for relation "products" violates check constraint "products_category_check"
```

---

## 🐛 Solução de Problemas

### Problema: Vejo erro de compilação TypeScript

**Erro:** `Type '"Tornozeleiras"' is not assignable to type 'Categoria'`

**Causa:** Você colocou string errada em `types/index.ts`

**Solução:** Verifique ortografia exatamente:
- ✅ Correto: `'Tornozeleiras'` (com 's' no final)
- ❌ Errado: `'Tornozeleira'` (sem 's')

---

### Problema: Página não mostra as 6 categorias

**Causa:** Você não atualizou o array em `app/page.tsx`

**Solução:** 
1. Abra `app/page.tsx`
2. Procure por `['Anéis', 'Colares', 'Pulseiras', 'Brincos']`
3. Troque por `['Anéis', 'Colares', 'Pulseiras', 'Brincos', 'Tornozeleiras', 'Masculino']`
4. Salve (Ctrl+S)
5. Página recarrega automaticamente

---

### Problema: Banco rejeita inserção com nova categoria

**Erro:** `violates check constraint`

**Causa:** Você não atualizou o `CHECK` no SQL

**Solução:**
1. Abra `supabase-schema.sql`
2. Procure por `check (category in ...`
3. Certifique que inclui: `'Tornozeleiras'` e `'Masculino'`
4. Re-execute o SQL no Supabase SQL Editor

---

## 📊 Resumo do Que Mudou

| Arquivo | Antes | Depois | Por quê |
|---------|-------|--------|---------|
| `types/index.ts` | `category: string` | `category: Categoria` | Validação em tempo de compilação |
| `app/page.tsx` | 4 categorias | 6 categorias | Mostrar novas no front-end |
| `supabase-schema.sql` | `category text` | `category text check (...)` | Validar no banco de dados |

---

## 🎉 Parabéns!

Se você seguiu todos os passos, seu projeto agora tem:

✅ **Tipo TypeScript** definido
✅ **Categorias na página inicial** visíveis
✅ **Validação no banco de dados**
✅ **Produtos de exemplo** em cada categoria

**Próximas ideias:**
1. Criar página de admin para gerenciar categorias dinamicamente
2. Buscar categorias do banco em vez de hardcoded
3. Implementar filtros mais avançados

---

## 📚 Referências Rápidas

**Documentação TypeScript:** https://www.typescriptlang.org/docs/
**Next.js:** https://nextjs.org/docs
**Supabase:** https://supabase.com/docs
**SQL Tutorial:** https://www.w3schools.com/sql/

**Arquivos do projeto modificados:**
- ✏️ `types/index.ts` - Novo tipo `Categoria`
- ✏️ `app/page.tsx` - Atualizar array de categorias
- ✏️ `supabase-schema.sql` - Adicionar CHECK constraint

---

**Sucesso! 🚀**
