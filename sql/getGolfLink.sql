select
    *
from
    golf_link
where
    section like '%${section}%'
order by description asc;