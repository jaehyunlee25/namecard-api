select
 *
from
    log_report
where
    macro_id = '${macroId}'
order by
    created_at desc;