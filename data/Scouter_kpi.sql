select * from vw_team_match_scores vtms 
join teams t on vtms.team_id = t.team_id 
where t."number"  = 3005


drop view vw_team_match_scores;
create or replace view public.vw_team_match_scores
as 
select * from 
(
select m.event_id, m.match_id , t.team_id , mta.alliance_color , 
		coalesce(mts.auton_marker_score, 0) auton_marker_score ,coalesce(mts.auton_parking_score, 0) auton_parking_score,
		coalesce(mts.telop_marker_score,0) telop_marker_score, coalesce(mts.telop_parking_score,0) telop_parking_score,
		coalesce(mts.auton_marker_score,0) + coalesce(mts.auton_parking_score,0) + coalesce(mts.telop_marker_score,0) + coalesce(mts.telop_parking_score,0) total_Team_Score
		, coalesce(ms.total_score,0) total_score, coalesce(ms.alliance_links,0) alliance_links, coalesce(ms.ranking_points,0) ranking_points, 
		coalesce(ms.coop_score,0) coop_score, coalesce(ms.alliance_auton_score,0) alliance_auton_score, coalesce(ms.alliance_telop_score,0) alliance_telop_score
		from matches m 
		join match_team_assoc mta on m.match_id  = mta.match_id 
		join teams t on mta.team_id = t.team_id 
		left join match_team_score mts on mts.team_id = mta.team_id and mta.match_id = mts.match_id 
		left join match_score ms on mta.match_id = ms.match_id and ms.alliance_color = mta.alliance_color 
)o1 where o1.total_team_score > 0;

drop view public.vw_average_scores;
create view public.vw_average_scores
as
select event_id,  team_id ,
		avg(auton_marker_score) avg_auton_marker_score ,avg(auton_parking_score) avg_auton_parking_score,
		avg(telop_marker_score) avg_telop_marker_score, avg(telop_parking_score) avg_telop_parking_score,
		avg(total_team_score) avg_total_team_Score, min(total_team_score) min_total_team_score,
		max(total_team_score) max_total_team_score,
		avg(case when rnkmatchdesc <= 3 then total_team_score else null end) avg_total_team_Score_Last3
		, avg(total_score) avg_total_score, avg(alliance_links) avg_alliance_links, sum(coalesce(ranking_points,0)) total_ranking_points, 
		avg(coop_score) avg_coop_score, avg(alliance_auton_score) avg_alliance_auton_score, avg(alliance_telop_score) avg_alliance_telop_score
from 
(
	select *,
	count(1) over (partition by event_id, team_id) cntMatches,
	rank() over (partition by event_id, team_id order by total_team_Score desc) rnkdesc,
	rank() over (partition by event_id, team_id order by match_id desc) rnkmatchdesc
	from vw_team_match_scores o1
) o2
where rnkdesc > case when cntMatches > 8 then 2 else 0 end
group by event_id,  team_id 

create view public.vw_coop_scores
as
select o1.event_id, o1.team_Id, round((avgTeamScoreWithOut - o1.avgscoreagainst),0) defenseTelopScore,
round((avgScoreWith - avgTeamScoreWithOut),0) coopTelopScore
from 
(
	select vtms.event_id, vtms.team_id,
	avg(vtms3.telop_marker_score) avgTeamScoreWithOut, 
	avg(case when vtms.alliance_color = vtms2.alliance_color
	then vtms3.telop_marker_score else null end) avgScoreWith,
	avg(case when vtms.alliance_color <> vtms2.alliance_color
	then vtms2.telop_marker_score else null end) avgScoreAgainst
	/*
	avg(case when vtms.match_id = vtms2.match_id and vtms.alliance_color = vtms2.alliance_color 
							and vtms.team_id <> vtms.team_id then vtms2.total_Team_Score else null end as Total_avg_Score_with,
	avg(case when vtms.match_id = vtms2.match_id and vtms.alliance_color <> vtms2.alliance_color 
							and vtms.team_id <> vtms.team_id then vtms2.total_Team_Score else null end as Total_avg_Score_with	*/				
	from public.vw_team_match_scores vtms 
	join public.vw_team_match_scores vtms2 on vtms.event_id = vtms2.event_id and vtms.match_id = vtms2.match_id and vtms.team_id <> vtms2.team_id 
	join public.vw_team_match_scores vtms3 on vtms2.event_id = vtms3.event_id and vtms2.team_id = vtms3.team_id
	group by vtms.event_id, vtms.team_id
) o1
	order by o1.team_id
	
select o2.event_id, o2.team_id,
scoringStrength - DefenseStrength XValue,
ParkingStrength - COOPStrength YValue,
scoreWeight, case when scoringStrength < 0 then 0 else scoringStrength end as scoringStrength, 
 case when DefenseStrength < 0 then 0 else DefenseStrength end as DefenseStrength,
case when ParkingStrength < 0 then 0 else ParkingStrength end as ParkingStrength, 
case when COOPStrength < 0 then 0 else COOPStrength end as COOPStrength
from
(
	select o1.event_id, team_id, 
	(o1.avg_auton_marker_score + o1.avg_telop_marker_score)/o1.totalPotentialScore * 20 as ScoringStrength,
	(o1.avg_auton_parking_score + o1.avg_telop_parking_score)/o1.totalPotentialScore * 20 as ParkingStrength,
	(o1.defensetelopscore)/o1.totalPotentialScore * 20 as DefenseStrength,
	(o1.cooptelopscore)/o1.totalPotentialScore * 20 as COOPStrength
	from 
	(
		select eta.event_id, eta.team_id, vas.avg_auton_marker_score , vas.avg_telop_marker_score ,
		vas.avg_auton_parking_score , vas.avg_telop_parking_score , vas.avg_total_team_score ,
		vas.avg_total_team_score + vcs.defensetelopscore + vcs.cooptelopscore TotalPotentialScore,
		vcs.defensetelopscore , vcs.cooptelopscore  
		from public.event_team_assoc eta 
		left join public.vw_average_scores vas on eta.team_id = vas.team_id and eta.event_id = vas.event_id
		left join public.vw_coop_scores vcs on eta.event_id = vcs.event_id and eta.team_id = vcs.team_id 
	) o1
) o2
left join 
(
	select o1.event_id, o1.team_id, sum(o1.total_team_score)/sum(matchscore) * 10 scoreWeight
	from 
	(
	select event_id, match_id, alliance_color, team_id, total_team_score, sum(total_team_score) over (partition by event_id, match_id, alliance_color) matchScore
	from public.vw_team_match_scores vtms 
	) o1
	group by o1.event_id, o1.team_id
) o3 on o2.event_id = o3.event_id and o3.team_id = o2.team_id


select *, case when vas.avg_total_team_score_last3 > vas.avg_total_team_score + 5 then 1
when vas.avg_total_team_score_last3 < vas.avg_total_team_score - 5 then -1
else 0 end as trend
from public.vw_average_scores vas

select event_id, team_id, match_second, avg(point_value) point_value
from
(
	select m.event_id, o1.team_id, ms.match_id, match_second, sum(point_value) point_value 
	from 
	(
	select match_score_id, team_id, match_second, point_value from public.match_time mt
	join public.match_markers mm on cast(mm.placed_time as numeric ) <= mt.match_second
	) o1
	join public.match_score ms on o1.match_score_id = ms.match_score_id 
	join public.matches m on ms.match_id = m.match_id
	group by m.event_id, o1.team_id, ms.match_id, match_second
) o2
group by event_id, team_id, match_second


select * from match_markers mm 
call load_match_data(1) 

select * from teams t 
where "number" = 3005

select * from vw_team_comparison

create or replace view vw_team_comparison as
select vas.event_id , t."number" team1, t2."number" team2, t3."number" team3 ,
vas.avg_total_team_score team1_team_score,
vas2.avg_total_team_score team2_team_score,
vas3.avg_total_team_score team3_team_score,
vas.avg_total_team_score +
vas2.avg_total_team_score +
vas3.avg_total_team_score overallScore,
vas.min_total_team_score team1_min_score,
vas2.min_total_team_score team2_min_score,
vas3.min_total_team_score team3_min_score,
vas.max_total_team_score team1_max_score,
vas2.max_total_team_score team2_max_score,
vas3.max_total_team_score team3_max_score
from vw_average_scores vas 
join vw_average_scores vas2 on vas.event_id  = vas2.event_id  and vas.team_id <> vas2.team_Id 
join vw_average_scores vas3 on vas.event_id = vas3.event_id and vas.team_id <> vas3.team_id and vas2.team_id <> vas3.team_id
left join teams t on vas.team_id = t.team_id 
left join teams t2 on vas2.team_id = t2.team_id 
left join teams t3 on vas3.team_id = t3.team_id 

select * from vw_average_scores vas 
join teams t on vas.team_id = t.team_id 
where t."number" = 3310
where vas.team_id 