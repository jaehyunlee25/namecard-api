update golf_club_event
set
    title = "${title}",
    content = "${content}",
    link = "${link}",
    updated_at = now()
where
    id = "${event_id}";