
create or replace PROCEDURE public.Load_Match_data(event_id integer)
LANGUAGE plpgsql
as $$
BEGIN

/*

select * from matches m 
insert into matches 
(event_id, match_number)
select 1, 13

select * from match_team_assoc mta 
select * from teams t 
insert into teams 
(number, name, source_key)
select sts.team_number, sts.team_number, concat('frc',sts.team_number)  from stage_team_score sts 
where not exists (select 1 from teams t where sts.team_number = t."number"  )

select * from 

insert into match_team_assoc 
(match_id, team_id, alliance_color)
select m.match_id , t.team_id , sts.alliance_color  
from stage_team_score sts 
join matches m on sts.match_number = m.match_number 
join teams t on t."number" = sts.team_number 

*/


/******************* CLEAN OUT MATCH DATA ON RELOAD OF DATA *******************/
delete from public.match_score
where match_id in  (select m.match_id  from stage_match sm
join matches m on sm.match_number  = m.match_number
where m.event_id = 1 and m.match_number  = sm.match_number );

delete from public.match_team_score
where match_id in  (select m.match_id  from stage_match sm
join matches m on sm.match_number  = m.match_number 
where m.event_id = 1 and m.match_number  = sm.match_number );

delete from public.match_markers
where match_score_id  in  (select ms.match_score_id  from stage_match sm
join matches m on sm.match_number  = m.match_number
join match_score ms on m.match_id = ms.match_id
where m.event_id = 1 and m.match_number  = sm.match_number );


/************************* INSERT MATCH DATA ******************************************/

INSERT INTO public.match_score
(match_id, alliance_color, total_score, alliance_links, alliance_auton_score, alliance_telop_score, ranking_points, start_time)
select match_id, 'blue' alliance_color, blue_alliance_score total_score, 
blue_alliance_links alliance_links, 
blue_alliance_auton_score alliance_auton_score, 
sm.blue_alliance_telop_score alliance_telop_score, sm.blue_ranking_points  ranking_points, start_time 
from stage_match sm
join matches m on sm.match_number  = m.match_number 
where m.event_id = 1;



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
where m.event_id = 1;



INSERT INTO public.match_markers
(match_score_id, team_id, game_state, marker_type, marker_x, marker_y, point_value,  placed_time)
select ms.match_score_id , t.team_id, stm.game_state , stm.marker_type , stm.location_x , stm.location_y , stm.score , stm.marker_timestamp 
from stage_team_marker stm
join matches m on stm.match_number = m.match_number and m.event_id = 1
join teams t on t."number"  = stm.team_number 
join match_score ms on ms.match_id = m.match_id;


/*************************SAVE STAGE DATA IN CASE WE NEED IT LATER******************************/

INSERT INTO archive.stage_match_archive
(stage_match_id, match_number, red_alliance_score, blue_alliance_score, red_alliance_links, blue_alliance_links, red_alliance_auton_score, blue_alliance_auton_score, red_alliance_telop_score, blue_alliance_telop_score, red_coop_score, blue_coop_score, red_charging_score, blue_charging_score, red_ranking_points, blue_ranking_points, start_time)

select stage_match_id, match_number, red_alliance_score, blue_alliance_score, red_alliance_links, blue_alliance_links, red_alliance_auton_score, blue_alliance_auton_score, red_alliance_telop_score, blue_alliance_telop_score, red_coop_score, blue_coop_score, red_charging_score, blue_charging_score, red_ranking_points, blue_ranking_points, start_time
from public.stage_match sm ;


INSERT INTO archive.stage_team_marker_archive
(stage_team_marker_id, match_number, team_number, alliance_color, scout, game_state, location_x, location_y, marker_timestamp, marker_type, score)
select stage_team_marker_id, match_number, team_number, alliance_color, scout, game_state, location_x, location_y, marker_timestamp, marker_type, score
from public.stage_team_marker ;


INSERT INTO archive.stage_team_score_archive
(match_number, team_number, alliance_color, scout, auton_marker_score, auton_parking_score, auton_parking_state, telop_marker_score, telop_parking_score, telop_parking_state)
select match_number, team_number, alliance_color, scout, auton_marker_score, auton_parking_score, auton_parking_state, telop_marker_score, telop_parking_score, telop_parking_state
from public.stage_team_score ;


truncate table public.stage_match ;
truncate table public.stage_team_marker ;
truncate table public.stage_team_score ;

commit;

END;$$;
