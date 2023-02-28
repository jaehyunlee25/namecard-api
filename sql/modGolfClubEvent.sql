update golf_club_event
set
    title = "${title}",
    content = "${content}",
    updated_at = now()
where
    id = "${event_id}";