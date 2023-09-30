
/***Insert a new Event****/

select * from events e 

insert into events 
(Name, City, event_type)
values
('NTX Tournament', 'Plano', 'Offseason')

/***Insert all of the matches for the event****/
insert into matches 
(event_id, match_number)
select 40, key from import_match_score 


/**Load matches and teams
 * Every team and match needs to be configures first
 * **/

insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'blue'
from 
import_match_score ims 
join matches m on ims."key" = m.match_number  and m.event_id = 40
join teams t on t.number  = cast(ims.blue0 as int)
order by match_id 
--where m.match_number in (71)

insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'blue'  
from 
import_match_score ims 
join matches m on ims."key" = m.match_number  and m.event_id = 40
join teams t on t.number  = cast(ims.blue1 as int)
order by m.match_number


insert into match_team_assoc
(match_id, team_id, alliance_color)
select  match_id, team_id, 'blue'
from 
import_match_score ims 
join matches m on ims."key" = m.match_number  and m.event_id = 40
join teams t on t.number  = cast(ims.blue2 as int)


insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'red' 
from 
import_match_score ims 
join matches m on ims."key" = m.match_number  and m.event_id = 40
join teams t on t.number  = cast(ims.red0 as int)



insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'red' 
from 
import_match_score ims 
join matches m on ims."key" = m.match_number  and m.event_id = 40
join teams t on t.number  = cast(ims.red1 as int)

insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'red' 
from 
import_match_score ims 
join matches m on ims."key" = m.match_number  and m.event_id = 40
join teams t on t.number  = cast(ims.red2 as int)
