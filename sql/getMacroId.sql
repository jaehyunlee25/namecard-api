select
    distinct(macro_id)
from
    log_report
order by 
    created_at desc;
    