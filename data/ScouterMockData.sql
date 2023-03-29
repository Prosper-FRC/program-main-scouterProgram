
select * from import_match_score ims 

INSERT INTO public.events
(name, city, event_type, source_key, first_event_code, start_date, week, year)
VALUES('FIT District Fort Worth Event', 'Fort Worth', 'frc', '2023fit', 'TXFOR', '2023-03-18',3, 2023);


INSERT INTO public.teams
("number", "name", source_key)
sELECT 148,'Robowranglers','frc148'
 UNION ALL SELECT 2714,'BBQ','frc2714'
 UNION ALL SELECT 3005,'RoboChargers','frc3005'
 UNION ALL SELECT 3310,'Black Hawk Robotics','frc3310'
 UNION ALL SELECT 4153,'Project Y','frc4153'
 UNION ALL SELECT 4192,'Jaguar Robotics','frc4192'
 UNION ALL SELECT 4206,'Robo Vikes','frc4206'
 UNION ALL SELECT 4251,'The Gallup GearHeads','frc4251'
 UNION ALL SELECT 4641,'TALON inc.','frc4641'
 UNION ALL SELECT 5411,'RoboTalons','frc5411'
 UNION ALL SELECT 5431,'Titan Robotics','frc5431'
 UNION ALL SELECT 5613,'ThunderDogs','frc5613'
 UNION ALL SELECT 6369,'Mercenary Robotics','frc6369'
 UNION ALL SELECT 6526,'Cyber Rangers','frc6526'
 UNION ALL SELECT 6672,'Fusion Corps','frc6672'
 UNION ALL SELECT 6974,'Zia Robotics','frc6974'
 UNION ALL SELECT 7119,'Sunset RoboBison','frc7119'
 UNION ALL SELECT 7271,'Hanger 84 Robotics','frc7271'
 UNION ALL SELECT 7321,'Águila Robótica','frc7321'
 UNION ALL SELECT 7503,'Radicubs','frc7503'
 UNION ALL SELECT 7506,'WILDCARDS','frc7506'
 UNION ALL SELECT 7534,'Dragonflies','frc7534'
 UNION ALL SELECT 7535,'Purple Poison','frc7535'
 UNION ALL SELECT 7540,'Timberwolf Robotics','frc7540'
 UNION ALL SELECT 8528,'AstroChimps','frc8528'
 UNION ALL SELECT 8749,'Farmersville  Robotics','frc8749'
 UNION ALL SELECT 8816,'Coyotronics','frc8816'
 UNION ALL SELECT 8858,'Beast from the East','frc8858'
 UNION ALL SELECT 9069,'WARGAM3S','frc9069'
 UNION ALL SELECT 9080,'ENIGMA','frc9080'
 UNION ALL SELECT 9088,'NASA Mark Infinity','frc9088'
 UNION ALL SELECT 9105,'TechnoTalons','frc9105'
 UNION ALL SELECT 9128,'ITKAN Robotics','frc9128'
 UNION ALL SELECT 9156,'Trojan Robotics','frc9156'
 UNION ALL SELECT 9299,'R0b0t B0bcats','frc9299'



INSERT INTO public.event_team_assoc
(event_id, team_id)
select event_id, t.team_id 
from public.events e, public.teams t


INSERT INTO public.matches
(event_id, match_number)
select 1, 1
union all 
select 1, 2
union all 
select 1, 3
union all 
select 1, 4
union all
select 1, 5
union all 
select 1, 6
union all 
select 1, 7
union all 
select 1, 8
union all
select 1, 9
union all 
select 1, 10
union all 
select 1, 11
union all 
select 1, 12

select * from public.match_team_assoc
where match_id  = 10

select * from teams t 
select * from matches m 

INSERT INTO public.match_team_assoc
(match_id, team_id, alliance_color)
select 10, team_id , 'red'
from teams t
where t.team_id  = floor(random() * 35 + 1)
and not exists (select 1 from match_team_assoc mta where mta.team_id = t.team_id and mta.match_id = 10)
limit 1

select match_id, count(1)
from match_team_assoc mta 
group by match_id having count(distinct team_id) <> 3



select floor(random() * 10 + 1)

select * from stage_team_score
truncate stage_team_score 

INSERT INTO public.stage_team_score
(match_number, team_number, alliance_color, scout, auton_marker_score, auton_parking_score, auton_parking_state, telop_marker_score, telop_parking_score, telop_parking_state)
select match_number, t."number" , mta.alliance_color, 'test',
floor(random() * 10 + 1) auton_marker_score, floor(random() * 12 + 1) auton_parking_score, 
case 
	floor(random() * 5 + 1)
	when 1
	then 'Parked'
	when 2
	then 'Docked'
	when 3
	then 'Charged'
	else
	null
end auton_parking_state, 
floor(random() * 60 + 1) telop_marker_score, 
floor(random() * 12 + 1) telop_parking_score, 
case 
	floor(random() * 5 + 1)
	when 1
	then 'Parked'
	when 2
	then 'Docked'
	when 3
	then 'Charged'
	else
	null
end telop_parking_state
from matches m
join match_team_assoc mta on m.match_id  = mta.match_id 
join teams t on mta.team_id  = t.team_id 
-- where match_number = 10

truncate table stage_match 
INSERT INTO public.stage_match
(match_number, red_alliance_score, blue_alliance_score, red_alliance_links, blue_alliance_links, 
red_alliance_auton_score, blue_alliance_auton_score, red_alliance_telop_score, blue_alliance_telop_score, 
red_coop_score, blue_coop_score, red_charging_score, blue_charging_score, red_ranking_points, blue_ranking_points)
select 
 o1.match_number, red_alliance_score, blue_alliance_score, floor(random() * 6 + 1) red_alliance_links, floor(random() * 6 + 1) blue_alliance_links, 
red_alliance_auton_score, blue_alliance_auton_score, red_alliance_telop_score, blue_alliance_telop_score, 
floor(random() * 9 + 1) red_coop_score, floor(random() * 9 + 1) blue_coop_score, floor(random() * 32 + 1) red_charging_score, floor(random() * 32 + 1)  blue_charging_score, 
floor(random() * 4 + 1) red_ranking_points, floor(random() * 4 + 1) blue_ranking_point
from
(
	select match_number, 
	sum(case when sts.alliance_color = 'red' then sts.auton_marker_score + sts.auton_parking_score + sts.telop_marker_score + sts.telop_parking_score else 0 end) as red_alliance_score,
	sum(case when sts.alliance_color = 'blue' then sts.auton_marker_score + sts.auton_parking_score + sts.telop_marker_score + sts.telop_parking_score else 0 end) as blue_alliance_score,
	sum(case when sts.alliance_color = 'red' then sts.auton_marker_score + sts.auton_parking_score  else 0 end) as red_alliance_auton_score,
	sum(case when sts.alliance_color = 'blue' then sts.auton_marker_score + sts.auton_parking_score  else 0 end) as blue_alliance_auton_score,
	sum(case when sts.alliance_color = 'red' then sts.telop_marker_score + sts.telop_parking_score  else 0 end) as red_alliance_telop_score,
	sum(case when sts.alliance_color = 'blue' then sts.telop_marker_score + sts.telop_parking_score  else 0 end) as blue_alliance_telop_score
	from stage_team_score sts
	group by 
	match_number
) o1

truncate table match_score 
INSERT INTO public.match_score
(match_id, alliance_color, total_score, alliance_links, alliance_auton_score, alliance_telop_score, ranking_points)
select match_id, 'red' alliance_color, red_alliance_score total_score, 
red_alliance_links alliance_links, 
red_alliance_auton_score alliance_auton_score, 
sm.red_alliance_telop_score alliance_telop_score, sm.red_ranking_points  ranking_points
from stage_match sm
join matches m on sm.match_number  = m.match_number 
where event_id = 1

select * from stage_match sm 

create table import_match_score
(key int4, blue0 varchar(30), blue1 varchar(30), blue2 varchar(30), red0 varchar(30), red1 varchar(30), red2 varchar(30))

INSERT INTO public.match_score
(match_id, alliance_color, total_score, alliance_links, alliance_auton_score, alliance_telop_score, ranking_points)
select match_id, 'blue' alliance_color, blue_alliance_score total_score, 
blue_alliance_links alliance_links, 
blue_alliance_auton_score alliance_auton_score, 
sm.blue_alliance_telop_score alliance_telop_score, sm.blue_ranking_points  ranking_points
from stage_match sm
join matches m on sm.match_number  = m.match_number 
where event_id = 1



INSERT INTO public.match_team_score
(match_id, team_id, alliance_color, scout, 
auton_marker_score, auton_parking_score, auton_parking_state, 
telop_marker_score, telop_parking_score, telop_parking_state)


select m.match_id, t.team_id, sts.alliance_color , sts.scout , 
sts.auton_marker_score, sts.auton_parking_score , sts.auton_parking_state,
sts.telop_marker_score , sts.telop_parking_score , sts.telop_parking_state 
from matches m 
join match_team_assoc mta on m.match_id  = mta.match_id 
join teams t on mta.team_id = t.team_id 
join stage_team_score sts on sts.team_number = t.number and sts.match_number = m.match_number 

select * from stage_team_score sts 


select * from stage_team_score sts 


select pid,
       usename as username,
       datname as database_name,
       query,
       application_name,
       backend_start,
       state,
       state_change
from pg_stat_activity
where pid = 'chosen_session';


select * from stage_team_score sts 
join teams t on sts.team_number = sts.team_number 
join matches m on sts.match_number = m.match_number 


select * from matches m 
insert into matches 
(event_id, match_number)
select distinct 1, match_number 
from stage_team_score sts 