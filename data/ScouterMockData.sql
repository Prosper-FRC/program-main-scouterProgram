
select * from import_match_score ims 

INSERT INTO public.events
(name, city, event_type, source_key, first_event_code, start_date, week, year)
VALUES('FIT District Amarillo Event', 'Amarillo', '2023txama', '2023fit', 'txama', '2023-04-01',5, 2023);



with newteams as (Select  1164 team_number , 'Project NEO' team_name , 'frc1164' source
UNION ALL Select  148 team_number , 'Robowranglers' team_name , 'frc148' source
UNION ALL Select  1745 team_number , 'The P-51 Mustangs' team_name , 'frc1745' source
UNION ALL Select  2613 team_number , 'Protobots' team_name , 'frc2613' source
UNION ALL Select  2657 team_number , 'Team Thundercats' team_name , 'frc2657' source
UNION ALL Select  2848 team_number , 'Rangers' team_name , 'frc2848' source
UNION ALL Select  3310 team_number , 'Black Hawk Robotics' team_name , 'frc3310' source
UNION ALL Select  3481 team_number , 'Bronc Botz' team_name , 'frc3481' source
UNION ALL Select  3676 team_number , 'Redshift Robotics' team_name , 'frc3676' source
UNION ALL Select  4063 team_number , 'TriKzR4Kidz' team_name , 'frc4063' source
UNION ALL Select  4153 team_number , 'Project Y' team_name , 'frc4153' source
UNION ALL Select  4206 team_number , 'Robo Vikes' team_name , 'frc4206' source
UNION ALL Select  4251 team_number , 'The Gallup GearHeads' team_name , 'frc4251' source
UNION ALL Select  4364 team_number , 'Metal Jackets' team_name , 'frc4364' source
UNION ALL Select  4717 team_number , 'Westerner Robotics' team_name , 'frc4717' source
UNION ALL Select  4734 team_number , 'The Iron Plainsmen' team_name , 'frc4734' source
UNION ALL Select  5212 team_number , 'TAMSformers Robotics' team_name , 'frc5212' source
UNION ALL Select  5411 team_number , 'RoboTalons' team_name , 'frc5411' source
UNION ALL Select  5417 team_number , 'Eagle Robotics' team_name , 'frc5417' source
UNION ALL Select  5613 team_number , 'ThunderDogs' team_name , 'frc5613' source
UNION ALL Select  5866 team_number , 'Fe [Iron] Tigers' team_name , 'frc5866' source
UNION ALL Select  6171 team_number , 'Chain Reaction' team_name , 'frc6171' source
UNION ALL Select  6369 team_number , 'Mercenary Robotics' team_name , 'frc6369' source
UNION ALL Select  6682 team_number , 'A.S.T.R.O. Vikings' team_name , 'frc6682' source
UNION ALL Select  6768 team_number , 'Denison Robo-Jackets' team_name , 'frc6768' source
UNION ALL Select  6974 team_number , 'Zia Robotics' team_name , 'frc6974' source
UNION ALL Select  7121 team_number , 'Keller Fusion Robotics' team_name , 'frc7121' source
UNION ALL Select  7125 team_number , 'Tigerbotics' team_name , 'frc7125' source
UNION ALL Select  7271 team_number , 'Hanger 84 Robotics' team_name , 'frc7271' source
UNION ALL Select  7492 team_number , 'CavBots' team_name , 'frc7492' source
UNION ALL Select  7534 team_number , 'Dragonflies' team_name , 'frc7534' source
UNION ALL Select  7750 team_number , 'Alpine Robo-Bucks' team_name , 'frc7750' source
UNION ALL Select  8325 team_number , 'Botcats' team_name , 'frc8325' source
UNION ALL Select  8408 team_number , 'Kiss Kats' team_name , 'frc8408' source
UNION ALL Select  8512 team_number , 'Manzano Monarchs' team_name , 'frc8512' source
UNION ALL Select  8528 team_number , 'AstroChimps' team_name , 'frc8528' source
UNION ALL Select  8874 team_number , 'The Cybirds' team_name , 'frc8874' source
UNION ALL Select  9080 team_number , 'ENIGMA' team_name , 'frc9080' source
UNION ALL Select  9105 team_number , 'TechnoTalons' team_name , 'frc9105' source
UNION ALL Select  9136 team_number , 'Rampage' team_name , 'frc9136' source
)
INSERT INTO public.teams
("number", "name", source_key)
select * from newteams t 
where not exists (select 1 from public.teams t2 where t.team_number = t2."number")



with newteams as (Select  1164 team_number , 'Project NEO' team_name , 'frc1164' source
UNION ALL Select  148 team_number , 'Robowranglers' team_name , 'frc148' source
UNION ALL Select  1745 team_number , 'The P-51 Mustangs' team_name , 'frc1745' source
UNION ALL Select  2613 team_number , 'Protobots' team_name , 'frc2613' source
UNION ALL Select  2657 team_number , 'Team Thundercats' team_name , 'frc2657' source
UNION ALL Select  2848 team_number , 'Rangers' team_name , 'frc2848' source
UNION ALL Select  3310 team_number , 'Black Hawk Robotics' team_name , 'frc3310' source
UNION ALL Select  3481 team_number , 'Bronc Botz' team_name , 'frc3481' source
UNION ALL Select  3676 team_number , 'Redshift Robotics' team_name , 'frc3676' source
UNION ALL Select  4063 team_number , 'TriKzR4Kidz' team_name , 'frc4063' source
UNION ALL Select  4153 team_number , 'Project Y' team_name , 'frc4153' source
UNION ALL Select  4206 team_number , 'Robo Vikes' team_name , 'frc4206' source
UNION ALL Select  4251 team_number , 'The Gallup GearHeads' team_name , 'frc4251' source
UNION ALL Select  4364 team_number , 'Metal Jackets' team_name , 'frc4364' source
UNION ALL Select  4717 team_number , 'Westerner Robotics' team_name , 'frc4717' source
UNION ALL Select  4734 team_number , 'The Iron Plainsmen' team_name , 'frc4734' source
UNION ALL Select  5212 team_number , 'TAMSformers Robotics' team_name , 'frc5212' source
UNION ALL Select  5411 team_number , 'RoboTalons' team_name , 'frc5411' source
UNION ALL Select  5417 team_number , 'Eagle Robotics' team_name , 'frc5417' source
UNION ALL Select  5613 team_number , 'ThunderDogs' team_name , 'frc5613' source
UNION ALL Select  5866 team_number , 'Fe [Iron] Tigers' team_name , 'frc5866' source
UNION ALL Select  6171 team_number , 'Chain Reaction' team_name , 'frc6171' source
UNION ALL Select  6369 team_number , 'Mercenary Robotics' team_name , 'frc6369' source
UNION ALL Select  6682 team_number , 'A.S.T.R.O. Vikings' team_name , 'frc6682' source
UNION ALL Select  6768 team_number , 'Denison Robo-Jackets' team_name , 'frc6768' source
UNION ALL Select  6974 team_number , 'Zia Robotics' team_name , 'frc6974' source
UNION ALL Select  7121 team_number , 'Keller Fusion Robotics' team_name , 'frc7121' source
UNION ALL Select  7125 team_number , 'Tigerbotics' team_name , 'frc7125' source
UNION ALL Select  7271 team_number , 'Hanger 84 Robotics' team_name , 'frc7271' source
UNION ALL Select  7492 team_number , 'CavBots' team_name , 'frc7492' source
UNION ALL Select  7534 team_number , 'Dragonflies' team_name , 'frc7534' source
UNION ALL Select  7750 team_number , 'Alpine Robo-Bucks' team_name , 'frc7750' source
UNION ALL Select  8325 team_number , 'Botcats' team_name , 'frc8325' source
UNION ALL Select  8408 team_number , 'Kiss Kats' team_name , 'frc8408' source
UNION ALL Select  8512 team_number , 'Manzano Monarchs' team_name , 'frc8512' source
UNION ALL Select  8528 team_number , 'AstroChimps' team_name , 'frc8528' source
UNION ALL Select  8874 team_number , 'The Cybirds' team_name , 'frc8874' source
UNION ALL Select  9080 team_number , 'ENIGMA' team_name , 'frc9080' source
UNION ALL Select  9105 team_number , 'TechnoTalons' team_name , 'frc9105' source
UNION ALL Select  9136 team_number , 'Rampage' team_name , 'frc9136' source
)
/*INSERT INTO public.event_team_assoc
(event_id, team_id)*/
select 34, t.team_id 
from newTeams nt
join public.teams t on nt.team_number = t."number" 

select * from events e 

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

insert into match_team_assoc 
(team_id, match_id, alliance_color)
select t.team_id , m.match_id, sts.alliance_color 
from stage_team_score sts 
join teams t on sts.team_number = t.number 
join matches m on sts.match_number = m.match_number 


select * from matches m 

insert into matches 
(event_id, match_number)
select distinct 1, match_number 
from stage_team_score sts 