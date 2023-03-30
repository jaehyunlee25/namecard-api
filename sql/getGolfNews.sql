SELECT	
	ROUND,
	NUMBER,	
    address link_address,
    golf_news.eng_id link_name,
    content link_content,
    datetime link_datetime
from
    golf_news
JOIN golf_link ON golf_link.eng_id = golf_news.eng_id
where
    round = (select distinct(ROUND) from golf_news order by round desc LIMIT 1 OFFSET 1)
ORDER BY NUMBER, description;