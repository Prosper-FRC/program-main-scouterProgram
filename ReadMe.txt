Read Me

This document will explain the configuration and running of the TalonScout app

CONFIGURATION

**Raspberri Pi**

+ Sign in
Protocol: ssh
IP: 192.168.1.127
Username: TalonScout
Password: fiftyfoureleven or 5411

+ starting server

Directory: cd /home/Desktop/talonscout/program-main-scouterProgram/
Tool: pm2
command: sudo pm2 start server.js
sudo password: fiftyfoureleven or 5411


**Setup Users**

	+ Configuring users in the user login drop down
		Location: /Rooms/lobby/lobby.html
		Add Options 
		Example
			<option value="Red1">Red1</option>
			<option value="Red2">Red2</option>
			<option value="Red3">Red3</option>
			<option value="Blue1">Blue1</option>
			<option value="Blue2">Blue2</option>
			<option value="Blue3">Blue3</option>
	+ Configuring Marker colors for users
		**Note. Every user must have a marker color or it won't work. The user can exist in blue and red at the same time. However, if you are assigned to a red robot you will need a color on the red config. Same for blue
	
		Location: /Configs/scouters.json
		Notes: the name must match the name in the dropdown in the lobby.html. Then need to be configured under Blue or Red
				depending on the alliance they will be scouting. If they are scouting both, they need to be in both Red and Blue

		Example:
		
			{
				"name": "Red1",
				"color": {
					"red": "255",
					"green": "255",
					"blue": "10"
				}
			},
			
		
	+ Configuring Scouter Schedule
		Location: /Configs/Scouting_Scheduler.csv
		Action: Populate the CSV with each match and scouter using their name configured in the lobby.html dropdown for each match and position.
		Note there is a comma at the end. For now that needs to be there
		Example:
			
			match,blue1,blue2,blue3,red1,red2,red3,
			1,Blue1,Blue2,Blue3,Red1,Red2,Red3,
			2,Blue1,Blue2,Blue3,Red1,Red2,Red3,
	
	+ Configuring Match Schedule
		Location: /Configs/schedule.csv
		Action: this file needs to be configured with each match and team number associated with each match. 
		
		Example:
			match,blue1,blue2,blue3,red1,red2,red3
			1,9105,5431,8879,9988,5572,9997
			2,1296,9999,9991,1745,418,2848
			3,8874,9993,2583,6171,5414,3310
			4,5411,2714,4192,6800,5212,4610
			5,9992,2881,9991,6369,6377,9997


**Database**

	Type: Postgres
	DatabaseName: Crescendo
	User: talonscout
	Password: talonscout

	Editor: DBeaver

	Troubleshoot

	If database does not open or says it cannot connect. Open PgAdmin and start the database from in there. Just expand the server and it will open. Click TalonScout to start it up.
	PGAdmin Password: talonscout or 5411

**Day of Match Setup**

	1. Prior to the competition, FRC will post a print out of the schedule. Take a scan of the schedule using a pdf converter from
	your camera or a document scanner tool.

	2. Open this PDF with word (or have it converted online to a document) and this will put the information in a table.
	
	3. Copy this data into excel and save it as a csv. Open the CSV file with an editor like Notepad++. Copy the csv file data into
		schedule.csv. Make sure the headers are named the same and the headers are in the right order. 
	
	4. The schedule.csv file also needs to be loaded into the postgres database in the import_match_team table

	5. execute the match match_setup.sql script. Run each script one at a time. 
		Make sure you change the event_id to the current event_id for every statement. 

** Getting data into Power BI **

	1. use a tool like Filezilla to connect to the Raspberri pi on the local network
		- typically you can connect with ip 192.168.1.127. Use the talonscout/5411 username and password.
	2. Navigate to the data/matches folder and copy all match.json files onto the disk
		** note. It is better to just load the matches that you haven't already loaded.
	3. Take the usb stick to the computer with the database and Power BI and plug it in 
	4. Copy the files int the Databased/data directory
	5. run the Databased alternativ.py script and this will load the data into the database
		** NOTE ** if the script fails, look at the last file output in the command line. Remove that file and run again
	6. Go to the Postgres Database.
		you will execute the following commands:
			call load_match_date ([event Id]);  -- example call load_match_data (7);
			refresh materialized view vw_average_scores;
	7. Click the Refresh button in Power BI.