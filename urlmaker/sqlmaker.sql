//sqlname: delGolfGame
delete from 
golf_game
where id = '${golf_game_id}';

//sqlname: delGolfScore
delete from 
golf_score
where game_id = '${golf_game_id}';