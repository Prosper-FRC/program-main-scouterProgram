
/******Run this statement before you import the data into import_match_team *****/
truncate table import_match_team


INSERT INTO public.events
( "name", city)
VALUES( 'Waco', 'Waco')

/****************Run this after the data is loaded***************************/

select * from import_match_team imt 
select * from events
select * from matches m where event_id = 4
/***Insert all of the matches for the event****/
insert into matches
(event_id, match_number)
select distinct 4, match_number from matches m
where match_number between 36 and 62
order by match_number
and not exists (select 1 from matches m1 where m.match_number = m1.match_number and m.event_id = m1.event_id)

select * from teams where number = 3152

insert into teams 
(number, source_key)

select distinct number, source_key
from
(
select cast(blue1 as int) number, concat('frc',blue1) source_key from import_match_team ims 
union all 
select cast(blue2 as int), concat('frc',blue2) source_key from import_match_team ims 
union all
select cast(blue3 as int), concat('frc',blue3) source_key from import_match_team ims 
union all
select cast(red1 as int) number, concat('frc',red1) source_key from import_match_team ims 
union all 
select cast(red2 as int), concat('frc',red2) source_key from import_match_team ims 
union all
select cast(red3 as int), concat('frc',red3) source_key from import_match_team ims 
) x
where not exists (select 1 from teams t where t."number" = x.number)
/**Load matches and teams
 * Every team and match needs to be configures first
 * **/



INSERT INTO event_team_assoc
(event_id, team_id)

SELECT distinct 4, team_id
FROM teams t
WHERE EXISTS (SELECT 1 FROM import_match_team ims WHERE CAST(blue1 AS int) = t.Number)
OR EXISTS (
SELECT 1 FROM import_match_team ims WHERE CAST(red1 AS int) = t.Number)



insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'blue'
from 
import_match_team ims 
join matches m on ims."match" = m.match_number  and m.event_id = 4
join teams t on t.number  = cast(ims.blue1 as int)
order by match_id 
--where m.match_number in (71)

insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'blue'  
from 
import_match_team ims 
join matches m on ims."match" = m.match_number  and m.event_id = 4
join teams t on t.number  = cast(ims.blue2 as int)
order by m.match_number

select * from import_match_team imt where "match" = 43
update import_match_team set blue3 = 7271
where match = 40;

update import_match_team set blue3 = 7540
where match = 42;

update import_match_team set blue3 = 9752
where match = 43;

insert into match_team_assoc
(match_id, team_id, alliance_color)
select  match_id, team_id, 'blue'
from 
import_match_team ims 
join matches m on ims."match" = m.match_number  and m.event_id = 4
join teams t on t.number  = cast(ims.blue3 as int)
where "match" in (40, 42,43)
order by m.match_number 

select * from import_match_team imt where "match" in (40, 42,43)

insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'red'
from 
import_match_team ims 
join matches m on ims."match" = m.match_number  and m.event_id = 4
join teams t on t.number  = cast(ims.red1 as int)
order by m.match_number 

update import_match_team set red1 = 7503
where match = 40;

insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'red' 
from 
import_match_team ims 
join matches m on ims."match" = m.match_number  and m.event_id = 4
join teams t on t.number  = cast(ims.red2 as int)

insert into match_team_assoc
(match_id, team_id, alliance_color)
select match_id, team_id, 'red' 
from 
import_match_team ims 
join matches m on ims."match" = m.match_number  and m.event_id = 4
join teams t on t.number  = cast(ims.red3 as int)
