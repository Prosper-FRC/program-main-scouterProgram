import json
import os 
import glob
import psycopg2
path = '../ScouterProgram-/DataBased/data'
FileDir = glob.glob(path + '/*.json')

conn = psycopg2.connect(
    host = "localhost",
    dbname = "TalonScout",
    user = "talonscout",
    password = "5411"
)
cur = conn.cursor()
print("Start")
for Files in FileDir: 
    print(Files)
    with open(Files, 'r', encoding='cp1252') as JsonFiles:
        JsonString = JsonFiles.read()
        Json = json.loads(JsonString)
        # print(Json)
        if "totalScore" in Json["scoreboard"]:
            cur.execute("""INSERT INTO stage_match(
            match_number,red_alliance_score,blue_alliance_score,red_alliance_links,blue_alliance_links,red_alliance_auton_score,blue_alliance_auton_score,red_alliance_telop_score,blue_alliance_telop_score,red_coop_score,blue_coop_score,red_charging_score,blue_charging_score,red_ranking_points,blue_ranking_points,start_time)
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, 
            (Json['matchNumber'], Json["scoreboard"]["totalScore"]["redAllianceScore"], Json["scoreboard"]["totalScore"]["blueAllianceScore"], Json["scoreboard"]["totalScore"]["redAllianceLinks"], Json["scoreboard"]["totalScore"]["blueAllianceLinks"], Json["scoreboard"]["totalScore"]["redAllianceAutonScore"], Json["scoreboard"]["totalScore"]["blueAllianceAutonScore"], Json["scoreboard"]["totalScore"]["redAllianceTelopScore"], Json["scoreboard"]["totalScore"]["blueAllianceTelopScore"],Json["scoreboard"]["totalScore"]["redCoopScore"], Json["scoreboard"]["totalScore"]["blueCoopScore"],Json["scoreboard"]["totalScore"]["blueChargingScore"],Json["scoreboard"]["totalScore"]["redChargingScore"],Json["scoreboard"]["totalScore"]["blueRankingPoints"],Json["scoreboard"]["totalScore"]["redRankingPoints"],Json["startTime"]  ) )
            # put in the score data of indivual teams
        
        for color in Json["gamePlay"]:

            for markers in Json["gamePlay"][color]:
                if(markers == "autonMarkers" or markers == "telopMarkers"):
                    for markersid in Json["gamePlay"][color][markers]:
                        markersID = Json["gamePlay"][color][markers][markersid]
                        if "score" in markersID:
                            score = markersID["score"]
                        else:
                            score = 0
                        if "teamNumber" in markersID:
                            teamNumber = markersID["teamNumber"]
                        else:
                            teamNumber = 0

                        cur.execute("""INSERT INTO stage_team_marker(
                                        match_number,team_number,alliance_color,scout,
                                        game_state,location_x,location_y,marker_timestamp,marker_type,score)
                                        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                                        """, 
                                        (Json['matchNumber'],markersID["teamNumber"],str(color), None,
                                        markersID["gameState"], 
                                        markersID["x"], markersID["y"],markersID["timestamp"], markersID["markerType"],score))
                    

            for team in Json["gamePlay"][color]["teams"]:
                if team["idx"] > 0:
                    if "markerScore" in team["autonScore"]:
                        aMarkerScore = team["autonScore"]["markerScore"]
                    else:
                        aMarkerScore = 0
                    if "parkingScore" in team["autonScore"]:
                        aparkingScore = team["autonScore"]["parkingScore"]
                    else:
                        aparkingScore = 0   
                    if "parkingState" in team["autonScore"]:
                        aparkingState = team["autonScore"]["parkingState"]
                    else:
                        aparkingState = ''
                    if "markerScore" in team["teleopScore"]:
                        tMarkerScore = team["teleopScore"]["markerScore"]
                    else:
                        tMarkerScore = 0
                    if "parkingScore" in team["teleopScore"]:
                        tparkingScore = team["teleopScore"]["parkingScore"]
                    else:
                        tparkingScore = 0   
                    if "parkingState" in team["teleopScore"]:
                        tparkingState = team["teleopScore"]["parkingState"]
                    else:
                        tparkingState = '' 
                    if team["teamNumber"] != '':
                        cur.execute( 
                        """INSERT INTO stage_team_score(
                            match_number,team_number,alliance_color,scout,
                            auton_marker_score,auton_parking_score,auton_parking_state
                            ,telop_marker_score,telop_parking_score,telop_parking_state)
                            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                            """,
                            (Json['matchNumber'], team["teamNumber"], team["allianceColor"], team["scout"],
                            aMarkerScore, aparkingScore, aparkingState,
                            tMarkerScore,tparkingScore,tparkingState)
                        )




conn.commit()
cur.close()
conn.close()

print("Finished")