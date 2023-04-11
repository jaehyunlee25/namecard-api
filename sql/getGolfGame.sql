select *
from golf_game
where device_id = '${device_id}'
order by created_at desc;