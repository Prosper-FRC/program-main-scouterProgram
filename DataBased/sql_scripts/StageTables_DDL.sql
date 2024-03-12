-- public.match_score definition

-- Drop table

-- DROP TABLE public.stage_match;

CREATE TABLE public.stage_match (
	stage_match_id serial4 NOT NULL,
	match_number int4 null,
	alliance_color varchar(30) NULL,
	alliance_score int4 NULL,
	alliance_auton_score int4 NULL,
	alliance_teleop_score int4 NULL,
	alliance_amplifier_score int4 NULL,
	alliance_amplifier_count int4 NULL,
	alliance_speaker_score int4 NULL,
	alliance_speaker_count int4 null,
	alliance_amplified_score int4 NULL,
	alliance_amplified_count int4 NULL,
	alliance_trap_score int4 NULL,
	alliance_trap_count int4 NULL,
	alliance_mobile_score int4 NULL,
	alliance_park_score int4 NULL,
	alliance_onstage_score int4 NULL,
	alliance_spotlight_score int4 NULL,
	CONSTRAINT stage_match_pkey PRIMARY KEY (stage_match_id)
);

create table public.stage_team_score(
	stage_team_score_id serial4 NOT NULL,
	match_number int4 null,
	team_number int4 null,
	alliance_color varchar(60) null,
	scout varchar(60) null,
	auton_amplifier_score int4 NULL,
	auton_speaker_score int4 NULL,
	auton_trap_score int4 null,
	auton_mobile_score int4 null,
	teleop_amplifier_score int4 NULL,
	teleop_speaker_score int4 NULL,
	teleop_amplified_score int4 NULL,
	teleop_trap_score int4 NULL,
	teleop_spotlight_score int4 NULL,
	teleop_park_score int4 null,
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
	marker_location_type varchar(60),
	CONSTRAINT stage_team_marker_pkey PRIMARY KEY (stage_team_marker_id)
);


