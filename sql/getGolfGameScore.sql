select 
    golf_game.device_id,
    golf_game.game_date,
    golf_game.game_time,
    golf_score.* 
from golf_game
join golf_score on golf_game.id = golf_score.game_id
where
    device_id = '${device_id}';