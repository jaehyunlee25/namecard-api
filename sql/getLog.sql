select 
    *,
    MICROSECOND(created_at) timestamp
from LOG 
where 
    DATE(created_at) = '${date}'
    and device_id like '%${device_id}%'
    and golf_club_id like '%${golf_club_id}%'
order by created_at asc;