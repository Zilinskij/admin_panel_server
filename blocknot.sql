// селект для випадайки!!!

select tbl,
        case 
 	     when tbl = 'appterm' then 'Інтерфейс'
 	     when tbl = 'country' then 'Країни'  
 	     when tbl = 'err' then 'Помилки'
 	     when tbl = 'education' then 'Види освіт'
 	     when tbl = 'menu_group' then 'Групи меню'
 	     when tbl = 'menu_item' then 'Пункти меню'
         when tbl = 'trailer_group' then 'Групи причепів'
    	 when tbl = 'trailer_type' then 'Види причепів'
       	 when tbl = 'valut' then 'Валюти'
        end as name
 from
 (
select distinct tbl
   from transl
 ) t
order by name

// різне
select id,
       country_name
from country
order by country_name