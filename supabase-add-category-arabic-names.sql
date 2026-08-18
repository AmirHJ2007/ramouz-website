-- Adds Arabic display names for the 5 top-level menu categories (the tabs
-- above the menu accordion). Run this once in the Supabase SQL editor.
--
-- Scope: category tabs only. Section/subsection/item names inside the
-- accordion stay English (menu content is intentionally not translated yet).

alter table categories add column if not exists name_ar text;

update categories set name_ar = 'القهوة'            where name = 'Coffee Base';
update categories set name_ar = 'الشاي والماتشا'     where name = 'Tea & Matcha';
update categories set name_ar = 'المشروبات الباردة'  where name = 'Cold & Refreshing';
update categories set name_ar = 'وجبات خفيفة'        where name = 'Bites';
update categories set name_ar = 'صحي'                where name = 'Fit';
