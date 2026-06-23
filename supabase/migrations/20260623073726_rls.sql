alter table users enable row level security;
alter table products enable row level security;
alter table comments enable row level security;
alter table cart enable row level security;
alter table carts_products enable row level security;

create policy "users_select_own" on users
  for select using (auth.uid() = id);

create policy "users_insert_own" on users
  for insert with check (auth.uid() = id);

create policy "users_update_own" on users
  for update using (auth.uid() = id);

-- products: catalogue public en lecture, pas de modification côté client
create policy "products_select_all" on products
  for select using (true);

-- comments: lecture publique, écriture/modif/suppression réservées à l'auteur
create policy "comments_select_all" on comments
  for select using (true);

create policy "comments_insert_own" on comments
  for insert with check (auth.uid() = id_utilisateur);

create policy "comments_update_own" on comments
  for update using (auth.uid() = id_utilisateur);

create policy "comments_delete_own" on comments
  for delete using (auth.uid() = id_utilisateur);

-- cart: uniquement le propriétaire du panier
create policy "cart_select_own" on cart
  for select using (auth.uid() = id_utilisateur);

create policy "cart_insert_own" on cart
  for insert with check (auth.uid() = id_utilisateur);

create policy "cart_update_own" on cart
  for update using (auth.uid() = id_utilisateur);

create policy "cart_delete_own" on cart
  for delete using (auth.uid() = id_utilisateur);

-- carts_products: uniquement les lignes liées à un panier dont l'utilisateur est propriétaire
create policy "carts_products_select_own" on carts_products
  for select using (
    exists (
      select 1 from cart
      where cart.id = carts_products.id_panier
        and cart.id_utilisateur = auth.uid()
    )
  );

create policy "carts_products_insert_own" on carts_products
  for insert with check (
    exists (
      select 1 from cart
      where cart.id = carts_products.id_panier
        and cart.id_utilisateur = auth.uid()
    )
  );

create policy "carts_products_update_own" on carts_products
  for update using (
    exists (
      select 1 from cart
      where cart.id = carts_products.id_panier
        and cart.id_utilisateur = auth.uid()
    )
  );

create policy "carts_products_delete_own" on carts_products
  for delete using (
    exists (
      select 1 from cart
      where cart.id = carts_products.id_panier
        and cart.id_utilisateur = auth.uid()
    )
  );
