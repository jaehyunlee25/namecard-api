//sqlname: delGolfClubEvent
update golf_club_evnet
set isDel = true
where id = "${eventId}";
