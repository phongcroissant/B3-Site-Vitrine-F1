create or replace function upsert_cart_product(p_id_panier int, p_id_produit int)
returns void as $$
begin
  insert into carts_products (id_panier, id_produit, quantite)
  values (p_id_panier, p_id_produit, 1)
  on conflict (id_panier, id_produit)
  do update set quantite = carts_products.quantite + 1;
end;
$$ language plpgsql;