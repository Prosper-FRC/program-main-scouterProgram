INSERT INTO public.events
(name, city, event_type, source_key, first_event_code, start_date, week, year)
VALUES('FIT Fort Worth', 'Fort Worth', 'frc', 'fit2023', 'fit2023', '2023-03-17',3, 2023);


INSERT INTO public.teams
("number", "name", source_key)
select 2714, 'bbq', 'bbq'
union all
select 3005, 'RoboChargers', 'bbq'
union all
select 3310, 'Black Hawk Robotics', 'bbq'
union all
select 4153, 'Project Y', 'bbq'
union all
select 4192, 'Flower Mound Jaguar Robotics', 'bbq'
union all
select 4206, 'Robo Vikes', 'bbq'
union all
select 4251, 'The Gallup GearHeads', 'bbq'
union all
select 4641, 'TALON inc.', 'bbq'
union all
select 5411, 'RoboTalons', 'bbq'


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

select * from public.match_team_assoc

select * from matches m 

INSERT INTO public.match_team_assoc
(match_id, team_id, alliance_color)
select 4, team_id , 'red'
from teams t
where t.team_id  = floor(random() * 10 + 1)
and not exists (select 1 from match_team_assoc mta where mta.team_id = t.team_id and mta.match_id = 4)


select floor(random() * 10 + 1)


INSERT INTO public.stage_team_score
(match_number, team_number, alliance_color, scout, auton_marker_score, auton_parking_score, auton_parking_state, telop_marker_score, telop_parking_score, telop_parking_state)
select match_number, t.team_id, mta.alliance_color, 'test',
floor(random() * 10 + 1) auton_marker_score, floor(random() * 6 + 1) auton_parking_score, 
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
floor(random() * 8 + 1) telop_parking_score, 
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
where match_number = 4


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


INSERT INTO public.match_score
(match_id, alliance_color, total_score, alliance_links, alliance_auton_score, alliance_telop_score, ranking_points)
select match_id, 'red' alliance_color, red_alliance_score total_score, 
red_alliance_links alliance_links, 
red_alliance_auton_score alliance_auton_score, 
sm.red_alliance_telop_score alliance_telop_score, sm.red_ranking_points  ranking_points
from stage_match sm
join matches m on sm.match_number  = m.match_number 
where event_id = 1


INSERT INTO public.match_score
(match_id, alliance_color, total_score, alliance_links, alliance_auton_score, alliance_telop_score, ranking_points)
select match_id, 'blue' alliance_color, blue_alliance_score total_score, 
blue_alliance_links alliance_links, 
blue_alliance_auton_score alliance_auton_score, 
sm.blue_alliance_telop_score alliance_telop_score, sm.blue_ranking_points  ranking_points
from stage_match sm
join matches m on sm.match_number  = m.match_number 
where event_id = 1








