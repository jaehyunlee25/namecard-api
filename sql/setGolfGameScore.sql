update golf_score
set
    golf_club_name = '${golf_club_name}',
    golf_club_course_name = '${golf_club_course_name}',
    hole_01 = '${hole_01}',
    hole_02 = '${hole_02}',
    hole_03 = '${hole_03}',
    hole_04 = '${hole_04}',
    hole_05 = '${hole_05}',
    hole_06 = '${hole_06}',
    hole_07 = '${hole_07}',
    hole_08 = '${hole_08}',
    hole_09 = '${hole_09}',
    updated_at = now()
where
    id = '${id}';