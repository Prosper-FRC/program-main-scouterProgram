drop procedure public.Load_Match_data;
create or replace PROCEDURE public.Load_Match_data(_event_id integer)
LANGUAGE plpgsql
as $$
BEGIN



/******************* CLEAN OUT MATCH DATA ON RELOAD OF DATA *******************/
delete from public.match_score
where match_id in  (select m.match_id  from stage_match sm
join matches m on sm.match_number  = m.match_number
where m.event_id = _event_id and m.match_number  = sm.match_number );

delete from public.match_team_score
where match_team_assoc_id in  (select match_team_assoc_id  
from stage_team_score sm
join matches m on sm.match_number  = m.match_number 
join match_team_assoc mta on m.match_id = mta.match_id
join teams t on mta.team_id = t.team_id and t.number = sm.team_number
where m.event_id = _event_id
);

delete from public.match_markers
where match_team_assoc_id  in  (select match_team_assoc_id  
from stage_team_score sm
join matches m on sm.match_number  = m.match_number 
join match_team_assoc mta on m.match_id = mta.match_id
join teams t on mta.team_id = t.team_id and t.number = sm.team_number
where m.event_id = _event_id);


/************************* INSERT MATCH DATA ******************************************/

INSERT INTO public.match_score
(match_id, alliance_color, total_score, 
alliance_auton_score, alliance_teleop_score, alliance_amplifier_count, 
alliance_amplifier_score, alliance_speaker_score, alliance_speaker_count, 
alliance_amplified_score, alliance_amplified_count, alliance_trap_score, 
alliance_trap_count, alliance_mobile_score, alliance_onstage_score,
alliance_spotlight_score, allinace_parking_score)
SELECT m.match_id,alliance_color, alliance_score, 
alliance_auton_score, alliance_teleop_score, alliance_amplifier_score, 
alliance_amplifier_count, alliance_speaker_score, alliance_speaker_count, 
alliance_amplified_score, alliance_amplified_count, alliance_trap_score, 
alliance_trap_count, alliance_mobile_score,  alliance_onstage_score,
alliance_spotlight_score, alliance_park_score
FROM public.stage_match sm
join matches m on sm.match_number = m.match_number 
where m.event_id = _event_id;




INSERT INTO public.match_team_score
(match_team_assoc_id, alliance_color, scout, auton_score, 
teleop_score, auton_amplifier_score, auton_amplifier_count, 
auton_speaker_score, auton_speaker_count, auton_trap_score, 
auton_trap_count, auton_mobile_score, teleop_amplifier_score, 
teleop_amplifier_count, teleop_speaker_score, teleop_speaker_count, 
teleop_amplified_score, teleop_amplified_count, teleop_parking_score, 
teleop_trap_score, teleop_trap_count, teleop_onstage_score, teleop_pass_count,isdisabled)
SELECT  mta.match_team_assoc_id, sts.alliance_color, scout, auton_score,
 teleop_score, auton_amplifier_score, auton_amplifier_count, 
 auton_speaker_score, auton_speaker_count, auton_trap_score, 
 auton_trap_count, auton_mobile_score, teleop_amplifier_score, 
 teleop_amplifier_count, teleop_speaker_score, teleop_speaker_count, 
 teleop_amplified_score, teleop_amplified_count, teleop_park_score,
 teleop_trap_score, teleop_trap_count, teleop_onstage_score, teleop_pass_count, isdisabled
FROM public.stage_team_score sts
join matches m on sts.match_number = m.match_number
join match_team_assoc mta on m.match_id = mta.match_id and mta.alliance_color = sts.alliance_color
join teams t on mta.team_id = t.team_id and t.number = sts.team_number
where m.event_id = _event_id;



INSERT INTO public.match_markers
(match_score_id, match_team_assoc_id, game_state, marker_type, marker_location_type, marker_x, marker_y, point_value, placed_time)
SELECT  ms.match_score_id, mta.match_team_assoc_id, game_state,  marker_type, marker_location_type, location_x, location_y,  score::int, marker_timestamp::numeric
FROM public.stage_team_marker stm
join matches m on stm.match_number = m.match_number
join match_team_assoc mta on m.match_id = mta.match_id and mta.alliance_color = stm.alliance_color
join teams t on mta.team_id = t.team_id and t.number = stm.team_number
join match_score ms on ms.match_id = m.match_id and mta.alliance_color = ms.alliance_color
where  m.event_id = _event_id;


/*************************SAVE STAGE DATA IN CASE WE NEED IT LATER******************************/


truncate table public.stage_match ;
truncate table public.stage_team_marker ;
truncate table public.stage_team_score ;

commit;

END;$$;
