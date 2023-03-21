insert into golf_club_event
values(
    uuid(),
    "${golf_club_id}",
    "${title}",
    "${content}",
    "${link}",
    now(),
    now()
);    