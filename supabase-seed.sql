-- Seed the Ramouz menu: 5 categories, 13 sections, 82 items
-- Assumes empty tables created by the earlier schema scripts.

begin;

insert into categories (name, sort_order) values ('Coffee Base', 10);
insert into categories (name, sort_order) values ('Tea & Matcha', 20);
insert into categories (name, sort_order) values ('Cold & Refreshing', 30);
insert into categories (name, sort_order) values ('Bites', 40);
insert into categories (name, sort_order) values ('Fit', 50);

insert into sections (category_id, name, icon, sort_order)
select id, 'Espresso Bar', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>', 10 from categories where name = 'Coffee Base';
insert into sections (category_id, name, icon, sort_order)
select id, 'Signature Lattes', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>', 20 from categories where name = 'Coffee Base';
insert into sections (category_id, name, icon, sort_order)
select id, 'Brew Bar', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>', 30 from categories where name = 'Coffee Base';
insert into sections (category_id, name, icon, sort_order)
select id, 'Hot Tea', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>', 10 from categories where name = 'Tea & Matcha';
insert into sections (category_id, name, icon, sort_order)
select id, 'Iced Tea', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>', 20 from categories where name = 'Tea & Matcha';
insert into sections (category_id, name, icon, sort_order)
select id, 'Matcha', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>', 30 from categories where name = 'Tea & Matcha';
insert into sections (category_id, name, icon, sort_order)
select id, 'Mocktails', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>', 10 from categories where name = 'Cold & Refreshing';
insert into sections (category_id, name, icon, sort_order)
select id, 'Milkshakes', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>', 20 from categories where name = 'Cold & Refreshing';
insert into sections (category_id, name, icon, sort_order)
select id, 'Croissants', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"/><path d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83"/><path d="M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4"/><path d="m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"/><path d="M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5"/></svg>', 10 from categories where name = 'Bites';
insert into sections (category_id, name, icon, sort_order)
select id, 'Desserts', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>', 20 from categories where name = 'Bites';
insert into sections (category_id, name, icon, sort_order)
select id, 'Açaí', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>', 10 from categories where name = 'Fit';
insert into sections (category_id, name, icon, sort_order)
select id, 'Fit Bites', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>', 20 from categories where name = 'Fit';
insert into sections (category_id, name, icon, sort_order)
select id, 'Fit Drinks', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>', 30 from categories where name = 'Fit';

insert into subsections (section_id, name, sort_order)
select id, 'Sweet', 10 from sections where name = 'Croissants';
insert into subsections (section_id, name, sort_order)
select id, 'Savoury', 20 from sections where name = 'Croissants';

insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Espresso', 'Double shot', 'assets/menu/Espresso%20Bar/Espresso%20%28Double%20shot%29.jpg', 1.100, 10
from sections where name = 'Espresso Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Americano', 'Hot or iced', 'assets/menu/Espresso%20Bar/Americano.jpg', 1.300, 20
from sections where name = 'Espresso Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Cortado', '80 ml — equal parts espresso and milk', 'assets/menu/Espresso%20Bar/Cortado.jpg', 1.400, 30
from sections where name = 'Espresso Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Cappuccino', null, 'assets/menu/Espresso%20Bar/Capuccino.jpg', 1.500, 40
from sections where name = 'Espresso Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Flat White', null, 'assets/menu/Espresso%20Bar/Flat%20White.jpg', 1.500, 50
from sections where name = 'Espresso Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Affogato', null, 'assets/menu/Espresso%20Bar/Affogato.jpg', 1.600, 60
from sections where name = 'Espresso Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Coffee Latte', null, 'assets/menu/Signature%20Lattes/Coffee%20Latte.jpg', 1.600, 10
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Mocha', null, 'assets/menu/Signature%20Lattes/Mocha.jpg', 1.800, 20
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Spanish Latte', 'Condensed milk, sweet and rich', 'assets/menu/Signature%20Lattes/Spanish%20Latte.jpg', 1.800, 30
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Salted Caramel Latte', null, 'assets/menu/Signature%20Lattes/Salted%20Caramel%20Latte.jpg', 1.800, 40
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Cinnamon Roll Latte', null, 'assets/menu/Signature%20Lattes/Cinnamon%20Roll%20Latte.jpg', 1.800, 50
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Cheesecake Latte', null, 'assets/menu/Signature%20Lattes/CheeseCake%20Latte.jpg', 1.800, 60
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Hazelnut Latte', null, 'assets/menu/Signature%20Lattes/Hazelnut%20Latte.jpg', 1.800, 70
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Saffron Latte', null, 'assets/menu/Signature%20Lattes/Saffron%20Latte.jpg', 2.000, 80
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Date Latte', 'Local dates, blended', 'assets/menu/Signature%20Lattes/Date%20Latte.jpg', 2.400, 90
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Tiramisu Latte', null, 'assets/menu/Signature%20Lattes/Tiramisu%20Latte.jpg', 2.900, 100
from sections where name = 'Signature Lattes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Classic V60', null, 'assets/menu/Brew%20Bar/Classic%20V60.jpg', 2.500, 10
from sections where name = 'Brew Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Premium V60', 'Colombian, specialty grade 85+', 'assets/menu/Brew%20Bar/Premium%20V60.jpg', 3.500, 20
from sections where name = 'Brew Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Cold Brew', '250 ml, Ethiopian specialty beans', 'assets/menu/Brew%20Bar/Cold%20Brew.jpg', 2.200, 30
from sections where name = 'Brew Bar';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Black / Green Tea', null, 'assets/menu/Hot%20Tea/Black%3AGreen%20Tea.jpg', 1.300, 10
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Lemongrass Ginger', null, 'assets/menu/Hot%20Tea/Lemongrass%20Ginger.jpg', 1.600, 20
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Queen Berry', 'Hibiscus, strawberry, cranberry, barberry', 'assets/menu/Hot%20Tea/Queen%20Berry.jpg', 1.600, 30
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Royal Jasmine', 'Green tea and jasmine blossoms', 'assets/menu/Hot%20Tea/Royal%20Jasmin.jpg', 1.600, 40
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'English Breakfast', null, 'assets/menu/Hot%20Tea/English%20Breakfast.jpg', 2.000, 50
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Earl Grey', 'Bergamot-scented black tea', 'assets/menu/Hot%20Tea/Earl%20Gray.jpg', 2.000, 60
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Moroccan Mint', null, 'assets/menu/Hot%20Tea/Moroccan%20Mint.jpg', 2.000, 70
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Caramel Dream', null, 'assets/menu/Hot%20Tea/Caramel%20Dream.jpg', 2.000, 80
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Indian Summer', null, 'assets/menu/Hot%20Tea/Indian%20Summer.jpg', 2.000, 90
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Caribbean Cocktail', null, 'assets/menu/Hot%20Tea/Caribbean%20Cocktail.jpg', 2.000, 100
from sections where name = 'Hot Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Peach Ice Tea', null, 'assets/menu/Ice%20Tea/Peach%20Ice%20Tea.jpg', 1.600, 10
from sections where name = 'Iced Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Mango Passion Ice Tea', null, 'assets/images/logo.png', 1.600, 20
from sections where name = 'Iced Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'MixBerry Ice Tea', null, 'assets/images/logo.png', 1.600, 30
from sections where name = 'Iced Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Pineapple Ice Tea', null, 'assets/images/logo.png', 1.600, 40
from sections where name = 'Iced Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Pomegranate Coconut Ice Tea', null, 'assets/images/logo.png', 1.600, 50
from sections where name = 'Iced Tea';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Matcha Latte', null, 'assets/menu/Matcha/Matcha%20Latte.jpg', 2.100, 10
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Spanish Matcha', 'Condensed milk', 'assets/images/logo.png', 2.400, 20
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Creamy Strawberry', null, 'assets/menu/Matcha/Creamy%20Strawberry%20Matcha.jpg', 2.500, 30
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Creamy Mango', null, 'assets/menu/Matcha/Creamy%20Mango%20Matcha.jpg', 2.500, 40
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Creamy Peach', null, 'assets/menu/Matcha/Creamy%20Peach%20Matcha.jpg', 2.500, 50
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Creamy Pineapple', null, 'assets/menu/Matcha/Creamy%20Pineapple%20Matcha.jpg', 2.500, 60
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Passion Fruit', null, 'assets/menu/Matcha/Passion%20Fruit%20Matcha.jpg', 2.500, 70
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Pistachio', null, 'assets/menu/Matcha/Pistachio%20Matcha.jpg', 2.500, 80
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'White Mocha', null, 'assets/menu/Matcha/White%20Mocha%20Matcha.jpg', 2.500, 90
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Matcha Milkshake', null, 'assets/menu/Matcha/Matcha%20MilkShake.jpg', 2.500, 100
from sections where name = 'Matcha';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Coco Pine', 'Pineapple and coconut, iced', 'assets/menu/Mocktails/Coco%20Pine.jpg', 2.000, 10
from sections where name = 'Mocktails';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Hibiscus', 'Signature hibiscus with ginger and rose', 'assets/menu/Mocktails/Hibiscus.jpg', 2.000, 20
from sections where name = 'Mocktails';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Mojito', null, 'assets/menu/Mocktails/Mojito.jpg', 2.000, 30
from sections where name = 'Mocktails';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Piña Colada', 'Signature mix of pineapple and coconut', 'assets/menu/Mocktails/Pinacolada.jpg', 2.500, 40
from sections where name = 'Mocktails';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Black Magic', 'Fizzy, strawberry base', 'assets/menu/Mocktails/Black%20Majic.jpg', 2.500, 50
from sections where name = 'Mocktails';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Passionpresso', 'Fizzy, passion fruit and espresso', 'assets/menu/Mocktails/Passionpresso.jpg', 2.500, 60
from sections where name = 'Mocktails';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Redbull Mojito', 'Mojito with an energy shot', 'assets/menu/Mocktails/Redbull%20Mojito.jpg', 2.900, 70
from sections where name = 'Mocktails';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Mixed Berry', null, 'assets/menu/Milk%20Shakes/MixBerry%20MilkShake.jpg', 2.500, 10
from sections where name = 'Milkshakes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Lotus', null, 'assets/menu/Milk%20Shakes/Lotus%20Milk%20Shake.jpg', 2.500, 20
from sections where name = 'Milkshakes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Oreo', null, 'assets/menu/Milk%20Shakes/Oreo%20Milk%20Shake.jpg', 2.500, 30
from sections where name = 'Milkshakes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Caramel', null, 'assets/menu/Milk%20Shakes/Caramel%20MilkShake.jpg', 2.500, 40
from sections where name = 'Milkshakes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Nutella', null, 'assets/menu/Milk%20Shakes/Nutella%20Milk%20Shake.jpg', 2.500, 50
from sections where name = 'Milkshakes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Peanut Butter & Banana', null, 'assets/menu/Milk%20Shakes/Peanut%20Butter%20and%20Banana%20Milk%20Shake.jpg', 2.500, 60
from sections where name = 'Milkshakes';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Sweet' and section_id = (select id from sections where name = 'Croissants')), 'Plain', null, 'assets/menu/Croissant/Plain%20Croissant.jpg', 1.100, 10
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Sweet' and section_id = (select id from sections where name = 'Croissants')), 'Chocolate', null, 'assets/menu/Croissant/Chocolate%20Croissant.jpg', 1.500, 20
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Sweet' and section_id = (select id from sections where name = 'Croissants')), 'Nutella', null, 'assets/images/logo.png', 1.600, 30
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Sweet' and section_id = (select id from sections where name = 'Croissants')), 'Nutella Strawberry', null, 'assets/images/logo.png', 2.000, 40
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Sweet' and section_id = (select id from sections where name = 'Croissants')), 'Peanut Butter Banana', null, 'assets/images/logo.png', 2.000, 50
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Savoury' and section_id = (select id from sections where name = 'Croissants')), 'Cheese Za''atar', null, 'assets/images/logo.png', 1.700, 60
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Savoury' and section_id = (select id from sections where name = 'Croissants')), 'Mortadella', 'Lettuce, cheddar, tomato, cucumber, mushroom', 'assets/menu/Croissant/Martadella.jpg', 1.700, 70
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Savoury' and section_id = (select id from sections where name = 'Croissants')), 'Grilled Halloumi', null, 'assets/menu/Croissant/Grilled%20Halloumi.jpg', 2.000, 80
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, (select id from subsections where name = 'Savoury' and section_id = (select id from sections where name = 'Croissants')), 'Smoked Turkey', 'Smoked turkey breast, lettuce, cheddar, tomato, cucumber, mushroom', 'assets/menu/Croissant/Smoked%20Turkey.jpg', 2.000, 90
from sections where name = 'Croissants';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Passion Mango Cheesecake', null, 'assets/menu/Desserts/Passion%20Mango%20CheeseCake.jpg', 2.100, 10
from sections where name = 'Desserts';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Mixed Berry Cheesecake', null, 'assets/menu/Desserts/Mix%20Berries%20Cheese%20Cake.jpg', 2.100, 20
from sections where name = 'Desserts';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Tiramisu', null, 'assets/menu/Desserts/Tiramisu.jpg', 2.400, 30
from sections where name = 'Desserts';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'San Sebastián', 'Burnt Basque cheesecake', 'assets/menu/Desserts/San%20Sebastian.jpg', 2.400, 40
from sections where name = 'Desserts';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Brownie', 'Served hot with a scoop of vanilla ice cream', 'assets/menu/Desserts/Brownie.jpg', 2.700, 50
from sections where name = 'Desserts';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Marble Brownie', 'Served hot with a scoop of vanilla ice cream', 'assets/menu/Desserts/Marble%20Brownie.jpg', 2.900, 60
from sections where name = 'Desserts';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Açaí Smoothie', 'Organic açaí purée, strawberry, blueberry, banana, peanut butter, coconut water and honey', 'assets/menu/Acai/Acai%20Smoothie.jpg', 3.200, 10
from sections where name = 'Açaí';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Açaí Bowl', 'Organic açaí purée, strawberry, blueberry, banana, granola, peanut butter, chia seeds and honey', 'assets/menu/Acai/Acai%20Bowl.jpg', 3.900, 20
from sections where name = 'Açaí';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Pro Mug Cake', null, 'assets/menu/Fit%20Bites/Pro%20Mug%20Cake.jpg', 2.400, 10
from sections where name = 'Fit Bites';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Power Brownie', null, 'assets/menu/Fit%20Bites/Power%20Brownie.jpg', 2.900, 20
from sections where name = 'Fit Bites';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Cheese and Tomato Rice Cake', null, 'assets/menu/Fit%20Bites/Cheese%20and%20Tomato%20Rice%20Cake.jpg', 2.400, 30
from sections where name = 'Fit Bites';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Peanut Butter Strawberry Rice Cake', null, 'assets/menu/Fit%20Bites/Peanut%20butter%20Strawberry%20Rice%20Cake.jpg', 2.400, 40
from sections where name = 'Fit Bites';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Tiramisu Rice Cake', 'Rice cake soaked in espresso, Greek yogurt, protein whey, cacao powder', 'assets/menu/Fit%20Bites/Tiramisu%20Rice%20Cake.jpg', 2.900, 50
from sections where name = 'Fit Bites';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Tuna Salad', 'Tuna, lettuce, cherry tomato, cucumber, corn, olive oil, salt and pepper', 'assets/menu/Fit%20Bites/Tuna%20Salad.jpg', 2.400, 60
from sections where name = 'Fit Bites';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Fit Latte', 'Coffee Latte + Protein Whey', 'assets/menu/Fit%20Drinks/Fit%20Latte.jpg', 2.400, 10
from sections where name = 'Fit Drinks';
insert into items (section_id, subsection_id, name, description, image_url, price, sort_order)
select id, null, 'Bulk Fuel', 'Protein Whey, Banana, Dates, Cacao Powder', 'assets/menu/Fit%20Drinks/Bulk%20Fuel.jpg', 2.900, 20
from sections where name = 'Fit Drinks';

insert into variants (item_id, name, price_delta, sort_order)
select id, 'Classic', 0, 10 from items where name = 'Mojito' and section_id = (select id from sections where name = 'Mocktails');
insert into variants (item_id, name, price_delta, sort_order)
select id, 'Pineapple', 0, 20 from items where name = 'Mojito' and section_id = (select id from sections where name = 'Mocktails');
insert into variants (item_id, name, price_delta, sort_order)
select id, 'Peach', 0, 30 from items where name = 'Mojito' and section_id = (select id from sections where name = 'Mocktails');
insert into variants (item_id, name, price_delta, sort_order)
select id, 'Passion Fruit', 0, 40 from items where name = 'Mojito' and section_id = (select id from sections where name = 'Mocktails');
insert into variants (item_id, name, price_delta, sort_order)
select id, 'Mango', 0, 50 from items where name = 'Mojito' and section_id = (select id from sections where name = 'Mocktails');

commit;
