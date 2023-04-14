update golf_fashion
set
    title = '${title}',
    content = '${content}',
    thumbnail = '${thumbnail}',
    updated_at = now()
where id = '${fashion_id}';