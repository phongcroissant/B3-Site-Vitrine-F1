create table users (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique not null
);
create table products (
    id serial primary key,
    libelle text not null,
    prix numeric(10, 2) not null
);

create table comments (
    id serial primary key,
    id_utilisateur uuid not null references users(id) on delete cascade,
    commentaire text not null,
    id_course varchar(30) not null
);

create table cart (
    id serial primary key,
    id_utilisateur uuid not null references users(id) on delete cascade,
    statut text not null default 'en_cours',
    created_at timestamp with time zone default now()
);

create table carts_products (
    id serial primary key,
    id_panier int not null references cart(id) on delete cascade,
    id_produit int not null references products(id) on delete cascade,
    quantite int not null default 1,
    unique (id_panier, id_produit)
);