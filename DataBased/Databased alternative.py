import json
import os 
import glob
import psycopg2
path = '../ScouterProgram-/DataBased/data'
#path = '..//data'
FileDir = glob.glob(path + '/*.json')

conn = psycopg2.connect(
    host = "localhost",
    dbname = "Crescendo",
    user = "talonscout",
    password = "5411"
)
cur = conn.cursor()
print("Start")
#print(FileDir)
for Files in FileDir: 
    print(Files)
    with open(Files, 'r', encoding='cp1252') as JsonFiles:
        JsonString = JsonFiles.read()
        Json = json.loads(JsonString)
        stage_match = {}
        # print(Json)
#        if "totalScore" in Json["scoreboard"]:
#            cur.execute("""INSERT INTO stage_match(
#            match_number, alliance_color, alliance_score, alliance_auton_score, alliance_teleop_score, alliance_amplifier_score, alliance_amplifier_count, alliance_speaker_score, alliance_speaker_count, alliance_amplified_score, alliance_amplified_count, alliance_trap_score, alliance_trap_count, alliance_mobile_score, alliance_park_score, alliance_onstage_score, alliance_spotlight_score)
#          VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
#            """, 
#            (Json['matchNumber'], Json["scoreboard"]["totalScore"]["redAllianceScore"], Json["scoreboard"]["totalScore"]["blueAllianceScore"], Json["scoreboard"]["totalScore"]["redAllianceLinks"], Json["scoreboard"]["totalScore"]["blueAllianceLinks"], Json["scoreboard"]["totalScore"]["redAllianceAutonScore"], Json["scoreboard"]["totalScore"]["blueAllianceAutonScore"], Json["scoreboard"]["totalScore"]["redAllianceTelopScore"], Json["scoreboard"]["totalScore"]["blueAllianceTelopScore"],Json["scoreboard"]["totalScore"]["redCoopScore"], Json["scoreboard"]["totalScore"]["blueCoopScore"],Json["scoreboard"]["totalScore"]["blueChargingScore"],Json["scoreboard"]["totalScore"]["redChargingScore"],Json["scoreboard"]["totalScore"]["blueRankingPoints"],Json["scoreboard"]["totalScore"]["redRankingPoints"],Json["startTime"]  ) )
          # put in the score data of indivual teams
        
        for color in Json:
            if color == 'blue' or color == 'red':
                cur.execute("""INSERT INTO stage_match(
                match_number, alliance_color, alliance_score, alliance_auton_score, alliance_teleop_score, alliance_amplifier_score, alliance_amplifier_count, alliance_speaker_score, alliance_speaker_count, alliance_amplified_score, alliance_amplified_count, alliance_trap_score, alliance_trap_count, alliance_mobile_score, alliance_park_score, alliance_onstage_score, alliance_spotlight_score)
                VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                 """, 
                (Json["matchNumber"], color, Json[color]["totalScore"]["Score"], Json[color]["totalScore"]["AutonScore"], Json[color]["totalScore"]["TeleopScore"], Json[color]["totalScore"]["AmpScore"], Json[color]["totalScore"]["AmpCount"], Json[color]["totalScore"]["SpeakerScore"], Json[color]["totalScore"]["SpeakerCount"], Json[color]["totalScore"]["AmplifiedScore"], Json[color]["totalScore"]["AmplifiedCount"], Json[color]["totalScore"]["TrapScore"], Json[color]["totalScore"]["TrapCount"], Json[color]["totalScore"]["MobileScore"], Json[color]["totalScore"]["ParkingScore"], Json[color]["totalScore"]["OnStageScore"], Json[color]["totalScore"]["SpotlightScore"]  ) )
          

                for markers in Json[color]:
                    if(markers == "autonGameMarkers" or markers == "teleopGameMarkers"):
                        for markersid in Json[color][markers]:
                            markersID = Json[color][markers][markersid]
                            if "score" in markersID:
                                score = markersID["score"]
                            else:
                                score = 0
                            if "teamNumber" in markersID:
                                if markersID["teamNumber"] == "":
                                    teamNumber = 0
                                else:
                                    teamNumber = markersID["teamNumber"]
                            else:
                                teamNumber = 0

                            cur.execute("""INSERT INTO stage_team_marker(
                                            match_number, team_number, alliance_color, scout, game_state, 
                                            location_x, location_y, marker_timestamp, marker_type, marker_location_type, score)
                                            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                                            """, 
                                            (Json['matchNumber'],teamNumber,str(color), None,
                                            markersID["gameState"], 
                                            markersID["x"], markersID["y"],markersID["timestamp"], markersID["markerType"], markersID["markerLocationType"],score))
                        

                for team in Json[color]["teams"]:
                    if team["idx"] > 0:
                        if team["teamNumber"] != '':
                            if "PassingCount" in team["autonScore"]:
                                autonPassCount = team["autonScore"]["PassingCount"]
                            else:
                                autonPassCount = 0
                            if "PassingCount" in team["teleopScore"]:
                                teleopPassCount = team["teleopScore"]["PassingCount"]
                            else:
                                teleopPassCount = 0

                            cur.execute( 
                            """INSERT INTO stage_team_score(
                                match_number, team_number, alliance_color, scout, 
                                auton_score, auton_amplifier_score, auton_amplifier_count, 
                                auton_speaker_score, auton_speaker_count, auton_trap_score, 
                                auton_trap_count, auton_mobile_score, auton_pass_count, 
                                teleop_score, teleop_amplifier_score, teleop_amplifier_count, 
                                teleop_speaker_score, teleop_speaker_count, teleop_amplified_score, 
                                teleop_amplified_count, teleop_trap_score, teleop_trap_count, 
                                teleop_onstage_score, teleop_spotlight_score, 
                                teleop_park_score, teleop_pass_count, isdisabled)
                                VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                                        ,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                                """,
                                (Json['matchNumber'], team["teamNumber"], team["allianceColor"], team["scout"],
                                team["autonScore"]["AutonScore"], team["autonScore"]["AmpScore"], team["autonScore"]["AmpCount"],
                                team["autonScore"]["SpeakerScore"], team["autonScore"]["SpeakerCount"], team["autonScore"]["TrapScore"],
                                team["autonScore"]["TrapCount"], team["autonScore"]["MobileScore"], autonPassCount,
                                team["teleopScore"]["TeleopScore"], team["teleopScore"]["AmpScore"], team["teleopScore"]["AmpCount"],
                                team["teleopScore"]["SpeakerScore"], team["teleopScore"]["SpeakerCount"], team["teleopScore"]["AmplifiedScore"],
                                team["teleopScore"]["AmplifiedCount"], team["teleopScore"]["TrapScore"], team["teleopScore"]["TrapCount"],
                                team["teleopScore"]["OnStageScore"], team["teleopScore"]["SpotlightScore"], team["teleopScore"]["ParkingScore"],
                                teleopPassCount, team["isDisabled"])
                            )




conn.commit()
cur.close()
conn.close()

print("Finished")