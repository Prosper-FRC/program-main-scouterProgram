Read Me

This document will explain the configuration and running of the TalonScout app

CONFIGURATION

**Raspberri Pi**

+ Sign in
Protocol: ssh
IP: 192.168.1.127
Username: TalonScout
Password: fiftyfoureleven

+ starting server

Directory: cd /home/talonscout/program-main-scouterProgram/
Tool: pm2
command: sudo pm2 start server.js
sudo password: fiftyfoureleven


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
	
		Location: /data/scouters.json
		Notes: the name must match the name in the dropdown in the lobby.html
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
		Location: /data/breaks/Scouting_Scheduler.csv
		Action: Populate the CSV with each match and scouter using their name configured in the lobby.html dropdown for each match and position
		Example:
			
			match,blue1,blue2,blue3,red1,red2,red3
			1,Blue1,Blue2,Blue3,Red1,Red2,Red3
			2,Blue1,Blue2,Blue3,Red1,Red2,Red3
	
	+ Configuring Match Schedule
		Location: /data/schedule/schedule.json
		Action: this file needs to be configured with each match and team number associated with each match. 
		
		Example:
			{"1": {"blue": ["7503", "9105", "3310"], "red": ["5411", "5431", "9988"]}, 
			"2": {"blue": ["8874", "6369", "9999"], "red": ["1745", "5417", "2718"]}, 
			"3": {"blue": ["7503", "9081", "5417"], "red": ["2714", "9991", "1745"]}, 
			"4": {"blue": ["9988", "9999", "3310"], "red": ["9081", "2718", "9991"]}, 
			"5": {"blue": ["8874", "5411", "9105"], "red": ["5431", "6369", "2714"]}, 
			"6": {"blue": ["9081", "2714", "9988"], "red": ["6369", "5417", "5411"]}}


**Database**

	Type: Postgres
	DatabaseName: TalonScout
	User: talonscout
	Password: 5411

	Editor: DBeaver

	Troubleshoot

	If database does not open or says it cannot connect. Open PgAdmin and start the database from in there. Just expand the server and it will open. Click TalonScout to start it up.
	PGAdmin Password: 5411
	
	