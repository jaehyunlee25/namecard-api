insert into golf_game
values(
    uuid(),
    '${device_id}',
    '${game_date}',
    '${game_time}',
    now(),
    now()
);