-- ============================================
-- WEAR AURA — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Products
create table if not exists products (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  slug          text unique not null,
  description   text,
  price             numeric(10,2) not null,
  compare_at_price  numeric(10,2),
  images            text[] default '{}',
  category          text,
  tags              text[] default '{}',
  is_active         boolean default true,
  is_featured       boolean default false,
  created_at    timestamptz default now()
);

-- Product Sizes (stock per size per product)
create table if not exists product_sizes (
  id          uuid default gen_random_uuid() primary key,
  product_id  uuid references products(id) on delete cascade,
  size        text not null,
  stock       integer default 0,
  unique(product_id, size)
);

-- Orders
create table if not exists orders (
  id               uuid default gen_random_uuid() primary key,
  order_number     text unique not null,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  address          text not null,
  city             text not null,
  province         text not null,
  payment_method   text not null,
  subtotal         numeric(10,2) not null,
  shipping         numeric(10,2) default 200,
  total            numeric(10,2) not null,
  status           text default 'pending',
  notes            text,
  created_at       timestamptz default now()
);

-- Order Items
create table if not exists order_items (
  id             uuid default gen_random_uuid() primary key,
  order_id       uuid references orders(id) on delete cascade,
  product_id     uuid references products(id) on delete set null,
  product_name   text not null,
  product_image  text,
  size           text not null,
  quantity       integer not null,
  price          numeric(10,2) not null
);

-- Decrement stock function (called after order)
create or replace function decrement_stock(
  p_product_id uuid,
  p_size       text,
  p_qty        integer
) returns void language plpgsql as $$
begin
  update product_sizes
  set stock = greatest(0, stock - p_qty)
  where product_id = p_product_id and size = p_size;
end;
$$;

-- Row Level Security: public can read active products
alter table products enable row level security;
create policy "Public read active products" on products
  for select using (is_active = true);

alter table product_sizes enable row level security;
create policy "Public read sizes" on product_sizes
  for select using (true);

-- Orders: anon can insert (checkout), service role can do everything
alter table orders enable row level security;
create policy "Anyone can place order" on orders
  for insert with check (true);

alter table order_items enable row level security;
create policy "Anyone can add order items" on order_items
  for insert with check (true);

-- Storage bucket for product images
-- Go to Storage in Supabase dashboard and create bucket named: product-images (public)
