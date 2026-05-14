# 🗺️ MAPA MENTAL: TypeScript & Agua e Sal Shop

## 🎯 Visão Geral Completa

```
┌─────────────────────────────────────────────────────────────────┐
│                     AULA TYPESCRIPT COMPLETA                   │
│                      Agua e Sal Shop                           │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
    FUNDAMENTOS           PROJETO            PRÁTICA
        │                      │                      │
        ├─ Tipos             ├─ Arquitetura        ├─ Atividade
        ├─ Interfaces        ├─ Dados              ├─ Modificar
        ├─ Unions            ├─ APIs               └─ Validar
        └─ Compilação        └─ Banco


┌──────────────────────────────────────────────────────────────────┐
│                       DOCUMENTOS DISPONÍVEIS                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📖 AULA_TYPESCRIPT.md                                          │
│     └─ Teoria + Análise do projeto (1-2 horas)                 │
│                                                                  │
│  🎨 GUIA_VISUAL.md                                              │
│     └─ Diagramas e fluxos (30 min)                             │
│                                                                  │
│  🎯 ATIVIDADE_CATEGORIAS.md                                     │
│     └─ O que fazer - passo-a-passo (10 min)                    │
│                                                                  │
│  🔬 DEEP_DIVE_TYPESCRIPT.md                                     │
│     └─ Conceitos avançados (1-2 horas)                         │
│                                                                  │
│  ✅ CHECKLIST_PROGRESSO.md                                      │
│     └─ Rastreie aprendizado (5 min)                            │
│                                                                  │
│  📋 RESUMO_EXECUTIVO.md                                         │
│     └─ Resumo de tudo (10 min)                                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📚 Mapa de Conhecimento TypeScript

```
                    TYPESCRIPT
                        │
        ┌───────────────┼───────────────┐
        │               │               │
      TIPOS         COMPILAÇÃO      ADVANCED
        │               │               │
        ├─ string       ├─ tsc        ├─ Genéricos
        ├─ number       ├─ Valida     ├─ Union avançada
        ├─ boolean      ├─ Compila    ├─ Type Guards
        ├─ arrays       ├─ Errros     ├─ Narrowing
        └─ Custom       └─ .js        └─ Discriminated
```

---

## 🎨 Mapa do Projeto

```
┌──────────────────────────────────────────────────────┐
│         ARQUITETURA AGUA E SAL SHOP                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  CAMADA 1: FRONTEND (React + TypeScript)           │
│  ┌─────────────────────────────────────────────┐   │
│  │ • app/page.tsx (página inicial)             │   │
│  │ • app/produtos/page.tsx (listagem)          │   │
│  │ • components/ProductCard.tsx                │   │
│  │ • context/CartContext.tsx (estado global)   │   │
│  └─────────────────────────────────────────────┘   │
│                       ↓ ↑                          │
│  CAMADA 2: BACKEND (Next.js API)                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ • app/api/admin/produtos/route.ts (CRUD)    │   │
│  │ • app/api/pagamento/processar/route.ts      │   │
│  │ • app/api/admin-login/route.ts              │   │
│  │ • Validação de tipos com TypeScript         │   │
│  └─────────────────────────────────────────────┘   │
│                       ↓ ↑                          │
│  CAMADA 3: BANCO (PostgreSQL via Supabase)        │
│  ┌─────────────────────────────────────────────┐   │
│  │ • products table (com CHECK constraint)      │   │
│  │ • orders table                              │   │
│  │ • Validação de dados                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  LAYER 0: TIPOS (Globais)                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ • types/index.ts                            │   │
│  │ • Product, CartItem, Order                  │   │
│  │ • Categoria (union type)                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Mapa de Fluxo: Uma Compra

```
USUÁRIO                 FRONTEND              BACKEND             BANCO
   │                       │                    │                   │
   │ Abre site              │                    │                   │
   ├──────────────────→ Home Page               │                   │
   │                       │                    │                   │
   │ Vê 6 categorias       │ ← Busca produtos ──→ Query            │
   │ (hardcoded array)     │ ← Resultado ←──────── SELECT * FROM...│
   │                       │                    │                   │
   │ Clica "Tornozeleiras" │                    │                   │
   ├──────────────────→ /produtos?cat=...      │                   │
   │                       │ Filtra por cat      │                   │
   │ Vê produtos           │                    │                   │
   │                       │                    │                   │
   │ Clica "Comprar"       │                    │                   │
   ├──────────────────→ add(product)           │                   │
   │                       │ setItems(...)      │                   │
   │ Vê "1 item no carr"   │ Re-renderiza       │                   │
   │                       │                    │                   │
   │ Vai para checkout     │                    │                   │
   ├──────────────────→ /checkout               │                   │
   │                       │ Lê CartContext      │                   │
   │ Preenche dados        │                    │                   │
   │                       │                    │                   │
   │ Clica "Pagar"         │                    │                   │
   ├──────────────────→ POST /api/pagamento   │                   │
   │                       │                    │                   │
   │                       │ Processa com ──────→ MercadoPago       │
   │                       │ gateway             │                   │
   │                       │                    │                   │
   │                       │ ← Sucesso ←─────    │                   │
   │                       │                    │                   │
   │                       │ POST /api/orders ──→ INSERT pedido ──→ Salva
   │                       │                    │                   │
   │ Página "Obrigado"     │                    │ Limpa carrinho    │
   ├──────────────────→ /obrigado               │                   │
   │                       │ clearCart()         │                   │
   │ Email confirmação     │                    │                   │
   │                       │                    │                   │
```

---

## 📍 Mapa de Arquivos

```
types/
  └─ index.ts ⭐ TIPOS GLOBAIS
     ├─ type Categoria (union)
     ├─ type Product
     ├─ type CartItem
     └─ type Order

context/
  └─ CartContext.tsx 📦 ESTADO GLOBAL
     ├─ createContext
     ├─ useCart hook
     ├─ add, remove, update, clear
     └─ total, count

app/
  ├─ page.tsx 🏠 PÁGINA INICIAL
  │  └─ getFeaturedProducts()
  │
  ├─ api/
  │  ├─ admin/
  │  │  ├─ login/route.ts 🔐 AUTENTICAÇÃO
  │  │  │
  │  │  └─ produtos/route.ts 📝 CRUD
  │  │     ├─ POST (criar)
  │  │     ├─ GET (listar)
  │  │     └─ DELETE (remover)
  │  │
  │  └─ pagamento/
  │     └─ processar/route.ts 💳 CHECKOUT
  │
  ├─ admin/ 🔒 ÁREA RESTRITA
  │  ├─ login/page.tsx
  │  ├─ produtos/page.tsx
  │  └─ pedidos/page.tsx
  │
  ├─ produtos/page.tsx 🛍️ LISTAGEM
  ├─ carrinho/page.tsx 🛒 CARRINHO
  └─ checkout/page.tsx 💰 PAGAMENTO

components/
  ├─ ProductCard.tsx 🎴 CARD DO PRODUTO
  ├─ ProductForm.tsx 📋 FORMULÁRIO
  ├─ Header.tsx 🔝 NAVBAR
  └─ Footer.tsx 🔙 RODAPÉ

lib/
  ├─ supabase-server.ts 🔧 CLIENT (Server)
  ├─ supabase.ts 🔧 CLIENT (Client)
  └─ infinitepay.ts 💸 GATEWAY

supabase-schema.sql 📊 BANCO DE DADOS
  ├─ CREATE TABLE products
  ├─ CREATE TABLE orders
  └─ INSERT dados exemplo

tsconfig.json ⚙️ CONFIG TYPESCRIPT

package.json 📦 DEPENDÊNCIAS
```

---

## 🎯 Mapa de Conceitos TypeScript

```
                    TYPESCRIPT
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    BASICS          INTERMEDIATE      ADVANCED
        │               │               │
        │               │               │
    Tipos          Type Guards      Genéricos
     ├─string       ├─typeof         ├─<T>
     ├─number       ├─instanceof     ├─constraints
     ├─boolean      └─custom         └─keyof
     │
  Interfaces       Narrowing        Discriminated
     ├─props        ├─if/else       Union
     ├─optional     ├─type checks   ├─discriminator
     └─readonly     └─exhaustive    └─switch
     
  Union Types      Advanced Types   Utility Types
     ├─|            ├─conditional   ├─Partial
     ├─value types  ├─mapped        ├─Required
     └─type union   └─template      ├─Pick
                                     └─Omit
```

---

## 🔐 Mapa de Validação (3 Camadas)

```
┌─────────────────────────────────────────────┐
│ CAMADA 1: TypeScript (Compilação)          │
│                                             │
│ type Categoria = 'Anéis' | ...             │
│ const x: Categoria = "Sapatos" ❌ ERRO!    │
│                                             │
│ Benefício: Erro em DESENVOLVIMENTO          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ CAMADA 2: Banco de Dados (SQL)             │
│                                             │
│ category TEXT CHECK (                       │
│   category IN (...)                        │
│ )                                           │
│                                             │
│ INSERT "Sapatos" ❌ ERRO! Constraint       │
│                                             │
│ Benefício: Protege integridade de dados    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ CAMADA 3: Aplicação (Runtime)              │
│                                             │
│ if (category === 'Anéis') { ... }          │
│ else if (category === 'Colares') { ... }   │
│ // Nunca chega em categoria inválida!      │
│                                             │
│ Benefício: Lógica sempre segura            │
└─────────────────────────────────────────────┘
```

---

## 📊 Mapa de Desempenho

```
                    CARREGAMENTO PÁGINA
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    SERVIDOR            REDE              BROWSER
        │                 │                 │
    ┌─────┐           ┌────────┐          ┌──────┐
    │ 50ms│ Busca BD  │ 200ms  │ HTML+CSS │Parse │
    │ 30ms│ Render    │Transfer│ JS       │30ms  │
    │ 20ms│ Envio     └────────┘          ├──────┤
    └─────┘                               │React │
     100ms                                │Hydrate
                                          │30ms
                                          ├──────┤
                                          │ Total│
                                          │ 450ms
                                          └──────┘
```

---

## 🎯 Mapa da Atividade

```
ANTES (4 categorias):
┌────────────────────────────────────────┐
│ ['Anéis', 'Colares', 'Pulseiras',      │
│  'Brincos']                            │
└────────────────────────────────────────┘

MUDANÇA 1: types/index.ts
┌────────────────────────────────────────┐
│ type Categoria = 'Anéis' | ... |       │
│ 'Tornozeleiras' | 'Masculino'          │
└────────────────────────────────────────┘

MUDANÇA 2: app/page.tsx
┌────────────────────────────────────────┐
│ ['Anéis', 'Colares', 'Pulseiras',      │
│  'Brincos', 'Tornozeleiras',            │
│  'Masculino']                           │
└────────────────────────────────────────┘

MUDANÇA 3: supabase-schema.sql
┌────────────────────────────────────────┐
│ category TEXT CHECK (                   │
│   IN (..., 'Tornozeleiras',             │
│       'Masculino')                      │
│ )                                       │
└────────────────────────────────────────┘

DEPOIS (6 categorias):
✅ TypeScript Valida
✅ Página mostra 6
✅ Banco protege
✅ Usuário vê: /produtos?categoria=tornozeleiras
```

---

## 🚀 Mapa de Aprendizado

```
                START (Você está aqui!)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    CONCEITOS        PROJETO         PRÁTICA
        │               │               │
    Leia Aula        Entender        Fazer
    TypeScript       Código          Atividade
        │               │               │
        ├─ Types        ├─ Files       ├─ Modificar
        ├─ Interfaces   ├─ Fluxos      ├─ Testar
        └─ Unions       └─ Tipos       └─ Validar
        │               │               │
        └───────────────┼───────────────┘
                        │
                   CONSOLIDAR
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    APROFUNDAR       PRATICAR        ENSINAR
        │               │               │
    Ler Deep         Criar            Ajudar
    Dive             Features         Outros
        │               │               │
        ├─ Generics     ├─ Nova API    └─ Mentor
        ├─ Guards       ├─ Novo type
        └─ Advanced     └─ Novo context
        │               │
        └───────────────┼───────────────┘
                        │
                      EXPERT! 🏆
```

---

## 📚 Mapa de Referência Rápida

```
BUSCO...                              VOU EM...
──────────────────────────────────────────────────────────
O que é TypeScript?                   AULA_TYPESCRIPT.md
Como funciona types/index.ts?         AULA_TYPESCRIPT.md
Como funciona CartContext?            AULA_TYPESCRIPT.md
Explicação de types/index.ts?         AULA_TYPESCRIPT.md
Explicação de app/page.tsx?           AULA_TYPESCRIPT.md
Como compilar TypeScript?             DEEP_DIVE_TYPESCRIPT.md
Como Type Narrowing funciona?         DEEP_DIVE_TYPESCRIPT.md
O que são Genéricos?                  DEEP_DIVE_TYPESCRIPT.md
Qual é a arquitetura do projeto?      GUIA_VISUAL.md
Como funciona uma compra?             GUIA_VISUAL.md
Qual é o fluxo de dados?              GUIA_VISUAL.md
Como validação em 3 camadas?          GUIA_VISUAL.md
O que fazer na atividade?             ATIVIDADE_CATEGORIAS.md
Como modificar types/index.ts?        ATIVIDADE_CATEGORIAS.md
Como modificar app/page.tsx?          ATIVIDADE_CATEGORIAS.md
Como modificar SQL?                   ATIVIDADE_CATEGORIAS.md
Tenho erro - e agora?                 ATIVIDADE_CATEGORIAS.md (FAQ)
Quero rastrear meu progresso          CHECKLIST_PROGRESSO.md
Preciso de resumo rápido              RESUMO_EXECUTIVO.md
Preciso de índice rápido              INDICE_RAPIDO.md (você está aqui)
```

---

## 💡 Mapa Estratégico

```
                    SEUS OBJETIVOS
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ENTENDER          APRENDER            FAZER
   O Projeto         TypeScript          Atividade
        │                 │                 │
    AULA_TS          DEEP_DIVE          ATIVIDADE
    GUIA_VISUAL      + AULA_TS         + TESTAR
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                    CONSOLIDAR
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     PRATICAR         EXPLORAR           COMPARTILHAR
     Novo código      Deep Dive          Ensinar outros
     Suas features    Conceitos avançados Mentorizar
```

---

## ✅ Checklist do Mapa Mental

- [ ] Entendi a arquitetura geral
- [ ] Identifiquei os 3 documentos principais
- [ ] Sei qual arquivo faz o quê
- [ ] Entendo validação em 3 camadas
- [ ] Sei como uma compra funciona
- [ ] Identifiquei a atividade a fazer
- [ ] Preparei para aprender

---

## 🎯 Próximo Passo

**Escolha sua jornada:**

1. **Caminho Iniciante:** AULA_TYPESCRIPT.md
2. **Caminho Visual:** GUIA_VISUAL.md
3. **Caminho Prático:** ATIVIDADE_CATEGORIAS.md
4. **Caminho Avançado:** DEEP_DIVE_TYPESCRIPT.md

---

**Bom aprendizado! 🚀**
