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

drop table if exists public.event_team_assoc;
CREATE TABLE public.event_team_assoc (
	event_id int NOT NULL,
	team_id int4 NOT NULL
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
	match_id int NOT NULL,
	team_id int4 NOT null,
	alliance_color varchar(30) not null
);

drop table if exists public.match_score;
CREATE TABLE public.match_score (
	match_score_id serial4 NOT NULL,
	match_id int not null,
	alliance_color varchar(30) not null,
	total_score int null,
	alliance_links int null,
	alliance_auton_score int null,
	alliance_telop_score int null,
	ranking_points int null,
	fouls int null,
	CONSTRAINT match_score_pkey PRIMARY KEY (match_score_id)
);

drop table if exists public.match_markers;
CREATE TABLE public.match_markers (
	match_marker_id serial4 NOT NULL,
	match_score_id int not null,
	team_id int not null,
	game_state varchar(30) not null,
	marker_type varchar(30) not null,
	marker_x int not null,
	marker_y int not null,
	point_value int null,
	is_link bit null,
	placed_time varchar(30) null,
	CONSTRAINT match_markers_pkey PRIMARY KEY (match_marker_id)
);


-- public.stage_team_score definition

-- Drop table

-- DROP TABLE public.stage_team_score;
DROP TABLE IF EXISTS public.match_team_score;
CREATE TABLE public.match_team_score (
	match_team_score_id serial4 NOT NULL,
	match_id int4 NULL,
	team_id int4 NULL,
	alliance_color varchar(60) NULL,
	scout varchar(60) NULL,
	auton_marker_score int4 NULL,
	auton_parking_score int4 NULL,
	auton_parking_state varchar(60) NULL,
	telop_marker_score int4 NULL,
	telop_parking_score int4 NULL,
	telop_parking_state varchar(60) NULL,
	CONSTRAINT match_team_score_id_pkey PRIMARY KEY (match_team_score_id)
);

drop table if exists public.ranking_points;
CREATE TABLE public.ranking_points (
	ranking_point_id serial4 NOT NULL,
	match_id int not null,
	team_id int not null,
	ranking_point int not null,
	CONSTRAINT ranking_points_pkey PRIMARY KEY (ranking_point_id)
);
