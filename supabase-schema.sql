-- Tabela de produtos
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  images text[] default '{}',
  category text,
  stock integer default 0,
  created_at timestamptz default now()
);

-- Tabela de pedidos
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  items jsonb not null,
  total numeric(10,2) not null,
  status text default 'pending' check (status in ('pending','paid','shipped','delivered')),
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  created_at timestamptz default now()
);

-- RLS: produtos públicos para leitura
alter table products enable row level security;
create policy "Produtos públicos" on products for select using (true);

-- RLS: pedidos apenas do próprio usuário
alter table orders enable row level security;
create policy "Pedidos do usuário" on orders for all using (auth.uid() = user_id);

-- Storage bucket para imagens
insert into storage.buckets (id, name, public) values ('products', 'products', true);
create policy "Imagens públicas" on storage.objects for select using (bucket_id = 'products');
create policy "Upload admin" on storage.objects for insert with check (bucket_id = 'products');

-- Dados de exemplo
insert into products (name, description, price, images, category, stock) values
  ('Anel Onda do Mar', 'Anel delicado em prata 925 com design de onda. Símbolo de liberdade e movimento.', 189.90, '{}', 'Anéis', 10),
  ('Colar Gota Praiana', 'Colar em prata 925 com pingente de gota. Leveza e elegância para o dia a dia.', 249.90, '{}', 'Colares', 8),
  ('Pulseira Maré', 'Pulseira em prata 925 com detalhes de ondas. Perfeita para usar sozinha ou em conjunto.', 159.90, '{}', 'Pulseiras', 15),
  ('Brinco Concha', 'Brinco em prata 925 com formato de concha. Delicado e cheio de personalidade.', 129.90, '{}', 'Brincos', 12);
