update golf_fashion
set
    isDel = true,
    updated_at = now()
where id = '${fashion_id}';