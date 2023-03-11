-- public.match_score definition

-- Drop table

-- DROP TABLE public.match_score;

CREATE TABLE public.stage_match (
	stage_match_id serial4 NOT NULL,
	match_number int4 null,
	red_alliance_score int4 NULL,
	blue_alliance_score int4 NULL,
	red_alliance_links int4 NULL,
	blue_alliance_links int4 NULL,
	red_alliance_auton_score int4 NULL,
	blue_alliance_auton_score int4 NULL,
	red_alliance_telop_score int4 NULL,
	blue_alliance_telop_score int4 NULL,
	red_coop_score int4 NULL,
	blue_coop_score int4 NULL,
	red_charging_score int4 NULL,
	blue_charging_score int4 NULL,
	red_ranking_points int4 NULL,
	blue_ranking_points int4 NULL,
	CONSTRAINT stage_match_pkey PRIMARY KEY (stage_match_id)
);

create table public.stage_team_score(
	stage_team_score_id serial4 NOT NULL,
	match_number int4 null,
	team_number int4 null,
	alliance_color varchar(60) null,
	scout varchar(60) null,
	auton_marker_score int4 NULL,
	auton_parking_score int4 NULL,
	auton_parking_state varchar(60) NULL,
	telop_marker_score int4 NULL,
	telop_parking_score int4 NULL,
	telop_parking_state varchar(60) NULL,
	CONSTRAINT stage_team_score_pkey PRIMARY KEY (stage_team_score_id)
);


CREATE TABLE public.stage_team_marker(
	stage_team_marker_id serial4 NOT NULL,
	match_number int4 null,
	team_number int4 null,
	alliance_color varchar(60) null,
	scout varchar(60) null,
	game_state varchar(60) null,
	location_x int4 null,
	location_y int4 null,
	marker_timestamp varchar(60) null,
	marker_type varchar(60) null,
	CONSTRAINT stage_team_marker_pkey PRIMARY KEY (stage_team_marker_id)
);
