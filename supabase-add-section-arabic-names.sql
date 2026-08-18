-- Adds Arabic display names for the 13 menu section headers inside the
-- accordion (Espresso Bar, Croissants, etc). Run this once in the Supabase
-- SQL editor, after supabase-add-category-arabic-names.sql.
--
-- Scope: section headers only. Item names/descriptions inside each section
-- stay English (menu content is intentionally not translated yet).

alter table sections add column if not exists name_ar text;

update sections set name_ar = 'أساي'          where name = 'Açaí';
update sections set name_ar = 'بار التحضير'    where name = 'Brew Bar';
update sections set name_ar = 'كرواسون'        where name = 'Croissants';
update sections set name_ar = 'حلويات'         where name = 'Desserts';
update sections set name_ar = 'بار الإسبريسو'  where name = 'Espresso Bar';
update sections set name_ar = 'وجبات صحية'     where name = 'Fit Bites';
update sections set name_ar = 'مشروبات صحية'   where name = 'Fit Drinks';
update sections set name_ar = 'شاي ساخن'       where name = 'Hot Tea';
update sections set name_ar = 'شاي مثلج'       where name = 'Iced Tea';
update sections set name_ar = 'ماتشا'          where name = 'Matcha';
update sections set name_ar = 'ميلك شيك'       where name = 'Milkshakes';
update sections set name_ar = 'موكتيل'         where name = 'Mocktails';
update sections set name_ar = 'لاتيه مميز'     where name = 'Signature Lattes';
