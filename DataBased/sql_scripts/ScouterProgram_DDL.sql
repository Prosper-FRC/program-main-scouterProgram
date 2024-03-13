drop table if exists public.teams;
CREATE TABLE public.teams (
	team_id serial4 NOT NULL,
	number int4 NOT NULL,
	name varchar(30) NULL,
	source_key varchar(30) null,
	CONSTRAINT teams_pkey PRIMARY KEY (team_id)
);

drop table if exists public.events;
CREATE TABLE public.events (
	event_id serial4 NOT NULL,
	name varchar(30) NULL,
	city varchar(100) null,
	event_type varchar(100) null,
	source_key varchar(30) null,
	first_event_code varchar(30) null,
	start_date varchar(30) null,
	week int null,
	year int null,
	CONSTRAINT events_pkey PRIMARY KEY (event_id)
);

drop table if exists public.matches;
CREATE TABLE public.matches (
	match_id serial4 NOT NULL,
	event_id int not null,
	match_number int NULL,
	source_key varchar(30) null,
	CONSTRAINT matches_pkey PRIMARY KEY (match_id)
);


drop table if exists public.match_team_assoc;
CREATE TABLE public.match_team_assoc (
	match_team_assoc_id serial4 NOT null,
	match_id int NOT NULL,
	team_id int4 NOT null,
	alliance_color varchar(30) not null,
	CONSTRAINT match_team_assoc_pkey PRIMARY KEY (match_team_assoc_id)
);

drop table if exists public.match_score;
CREATE TABLE public.match_score (
	match_score_id serial4 NOT NULL,
	match_id int not null,
	alliance_color varchar(30) not null,
	total_score int null,
	alliance_auton_score int null,
	alliance_teleop_score int null,
	alliance_amplifier_count int null,
	alliance_amplifier_score int null,
	alliance_speaker_score int null,
	alliance_speaker_count int null,
	alliance_amplified_score int null,
	alliance_amplified_count int null,
	alliance_trap_score int null,
	alliance_trap_count int null,
	alliance_mobile_score int null,
	alliance_onstage_score int null,
	alliance_spotlight_score int null,
	allinace_parking_score int null,
	alliance_passing_count int null,
	ranking_points int null,
	fouls int null,
	CONSTRAINT match_score_pkey PRIMARY KEY (match_score_id)
);

drop table if exists public.match_markers;
CREATE TABLE public.match_markers (
	match_marker_id serial4 NOT NULL,
	match_score_id int not null,
	match_team_assoc_id int not null,
	game_state varchar(30) not null,
	marker_type varchar(30) not null,
	marker_location_type varchar(30) not null,
	marker_x int not null,
	marker_y int not null,
	point_value int null,
	placed_time varchar(30) null,
	CONSTRAINT match_markers_pkey PRIMARY KEY (match_marker_id)
);


-- public.stage_team_score definition

-- Drop table

-- DROP TABLE public.stage_team_score;
DROP TABLE IF EXISTS public.match_team_score;
CREATE TABLE public.match_team_score (
	match_team_score_id serial4 NOT NULL,
	match_team_assoc_id int4 NULL,
	alliance_color varchar(60) NULL,
	scout varchar(60) NULL,
	auton_score int4 NULL,
	teleop_score int4 null,
	auton_amplifier_score int4 NULL,
	auton_amplifier_count int4 NULL,
	auton_speaker_score int4 NULL,
	auton_speaker_count int4 NULL,
	auton_amplified_score int4 NULL,
	auton_amplified_count int4 NULL,
	auton_parking_score int4 NULL,
	auton_trap_score int4 NULL,
	auton_trap_count int4 NULL,
	auton_mobile_score int4 null,
	teleop_amplifier_score int4 NULL,
	teleop_amplifier_count int4 NULL,
	teleop_speaker_score int4 NULL,
	teleop_speaker_count int4 NULL,
	teleop_amplified_score int4 NULL,
	teleop_amplified_count int4 NULL,
	teleop_parking_score int4 NULL,
	teleop_trap_score int4 NULL,
	teleop_trap_count int4 NULL,
	teleop_onstage_score int4 null,
	teleop_pass_count int4 null,
	
	CONSTRAINT match_team_score_id_pkey PRIMARY KEY (match_team_score_id)
);

drop table if exists public.ranking_points;
CREATE TABLE public.ranking_points (
	ranking_point_id serial4 NOT NULL,
	event_id int not null,
	team_id int not null,
	ranking_point int not null,
	CONSTRAINT ranking_points_pkey PRIMARY KEY (ranking_point_id)
);
