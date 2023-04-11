select id inserted_id
from golf_game
where device_id = '${device_id}'
order by created_at desc
limit 1;