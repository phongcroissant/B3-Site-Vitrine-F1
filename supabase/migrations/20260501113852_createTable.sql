create table users (
    id uuid default gen_random_uuid() primary key,
    username text unique not null
);