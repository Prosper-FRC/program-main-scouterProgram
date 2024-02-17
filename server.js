
let directory = __dirname

let assets = {
     blue: "../Assets/CrescendoBlueField.png",
     red: "../Assets/CrescendoRedField.png",
    /*blue: "../Assets/blueField.png",
    red: "../Assets/redField.png",*/
    blueAlt: "../Assets/blueField_alt.png",
    redAlt: "../Assets/redField_alt.png"
}

let field = {}
let grid = {}

let timesheet = {}
let competition = {}

let superCharged = {
    "blue": 0, 
    "red": 0,
}

const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const http = require("http")
const socketio = require("socket.io")
const path = require("path")

const gp = require('./Server/gamePieces')
const ut = require('./Server/utility.js')
const fw = require('./Server/fileWriter')
const ref = require('./Server/referee') 

const app = express()
const httpserver = http.Server(app)
const io = socketio(httpserver)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const sessionMiddleware = session({
    secret: "54119105",
    saveUninitialized: false,
    //cookie: { maxAge: 3600000 },
    resave: false
})

app.use(sessionMiddleware)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"));
app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
  )
app.use(express.static(__dirname + "/Rooms"))


app.post('/scoutdata', (request, response) => 
{
    let scoutData = fw.getScoutData()
    response.json(scoutData)
})

app.post("/signin", (request, response) => 
{
    let message, notification
    let body    = request.body
    let user    = new gp.User(body.username, body.password)

    if (user.isBlank())
    {
        message         = "Please choose a scouter."
        notification    = ut.notification(message)
        response.send(notification)
    } 
    else if (user.hasName("admin") && !user.hasPassword("password"))
    {
        message         = "That password is incorrect"
        notification    = ut.notification(message)
        response.send(notification)
    }
    else if (match.hasConnectedScouter(user.name))
    {
        message         = "Sorry, but somebody already joined under that name."
        notification    = ut.notification(message)
        response.send(notification)
    }
    else if (user.hasName("admin"))
    {
        request.session.authenticated = true
        request.session.scout = "admin"
        match.connectAdmin()
        response.redirect('/admin')
    } 
    else if (match.getGamePlay(fw.getAllianceColor(user.name)).isFull())
    {
        message         = "Sorry, but the session you are trying to join is full."
        notification    = ut.notification(message)
        response.send(notification)
    }
    else if (match.inSession() && !(timesheet.hasScouter(user.name)))
    {
        message         = "Sorry, but you are not scheduled for this match."
        notification    = ut.notification(message)
        response.send(notification)
    }
    else if (match.inSession() && fw.getAllianceColor(user.name) && match.hasAdmin())
    {
        request.session.authenticated = true
        request.session.scout = user.name
        request.session.allianceColor = fw.getAllianceColor(user.name)
        response.redirect('/' + request.session.allianceColor)
    } 
    else if (!match.hasAdmin()) 
    {
        message         = "The admin has not joined yet, please be patient"
        notification    = ut.notification(message)
        response.send(notification)
    } 
    else if (!match.inSession()) 
    {
        message         = "The admin has not started the match yet, please be patient."
        notification    = ut.notification(message)
        response.send(notification)
    } 
    else 
    {
        message         = "Sorry, but that name was not found on the scouter list."
        notification    = ut.notification(message)
        response.send(notification)
    }
})

app.post('/schedule/blue', (request, response) => 
{
    let schedule    = timesheet.getSchedule("blue")
    let table       = new ut.JsonTable(schedule)
    response.json(table.json())
})

app.post('/schedule/red', (request, response) => 
{
    let schedule    = timesheet.getSchedule("red")
    let table       = new ut.JsonTable(schedule)
    response.json(table.json())
})

app.post('/ondeck/blue', (request, response) => 
{
    let lineup  = timesheet.getTimeTable("blue").getCurrentMatchLineUp()
    let table   = new ut.JsonTable(lineup)
    response.json(table.json())
})

app.post('/ondeck/red', (request, response) => 
{
    let lineup  = timesheet.getTimeTable("red").getCurrentMatchLineUp()
    let table   = new ut.JsonTable(lineup)
    response.json(table.json())
})

app.post('/logout', (request, response) => 
{
    request.session.destroy()
    response.redirect('/lobby')
})

app.get('/game', (request, response) => 
{
    let file = path.join(directory, 'Rooms/index.html')
    response.sendFile(file)
})

app.get('/blue', (request, response) => 
{
    let file = path.join(directory, 'Rooms/blue/index.html')
    response.sendFile(file)
})

app.get('/red', (request, response) => 
{
    let file = path.join(directory, 'Rooms/red/red.html')
    response.sendFile(file)
})

app.get('/admin', (request, response) => 
{
    let file = path.join(directory, 'Rooms/admin/admin.html')
    response.sendFile(file)
})

app.get('/lobby', (request, response) => 
{
    let file = path.join(directory, 'Rooms/lobby/lobby.html')
    response.sendFile(file)
})

app.get('*', (request, response) => 
{
    response.redirect('/lobby')
})

let match = {}
let score = {}

const gameStates = ["pregame", "auton", "teleop"]

const wrap = middleware => 
    (socket, next) => 
        middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))
io.use((socket, next) => 
{
    const session = socket.request.session;
    if (session && session.authenticated) 
    {
        next()
    } 
    else 
    {
        console.log("unauthorized user joined")
    }
})

initGame()

io.on('connection', connected);

function connected(socket) {

    const session = socket.request.session
    let allianceGamePlay
    let team

    if (session.allianceColor) 
    {
        allianceGamePlay    = match.getGamePlay(session.allianceColor)
        team                = allianceGamePlay.getTeamByScout(session.scout)
    } 

    //console.log(session)
    //console.log("session id: " + socket.request.session.id + "\n")
    //console.log("scout name: " + socket.request.session.scout + "\n")

    socket.on('newScouter', data => {

        socket.leaveAll()
        socket.join(session.allianceColor)

        console.log("New client connected, with id (yeah): " + socket.id)

        if (!team.hasTeamNumber())
        {
            let gameplay    = match.getGamePlay(team.allianceColor)
            let position    = gameplay.getIdx()
            let schedule    = competition.getTimeTable(team.allianceColor)
            let teamNumber  = schedule.getCurrentLineUpPosition(position)

            team.setTeamNumber(teamNumber)
            match.getGamePlay(team.allianceColor).increment()

            if(team.allianceColor == 'red') //
            {
                let lineup  = timesheet.getTimeTable("red").getCurrentLineUp()
                let index   = lineup.indexOf(team.scout) + 4
                team.setIdx(index)
            }
            else
            {
                let lineup  = timesheet.getTimeTable("blue").getCurrentLineUp()
                let index   = lineup.indexOf(team.scout) + 1
                team.setIdx(index)
            }

            //team.setIdx(timesheet.getTimeTable(team.allianceColor).getCurrentLineUp().indexOf(team.scout) + num)
        }

        team.connect()
        //team.gameState[allianceGamePlay.gameState] = new gp.GameState()
        team.setGameState(allianceGamePlay.gameState, new gp.GameState())

        //arena object
        socket.emit('rotate', field[team.allianceColor].getRotation())
        socket.emit('drawfield', field[team.allianceColor].getDimensions(), grid[team.allianceColor].getDimensions())

        socket.emit('AssignRobot', team)
        io.to('admin').emit('AssignRobot', team)

        //to do: fix this so that it only renders game markers on the newly joined client instead of re-drawing everyone's fields
        io.to(team.allianceColor).emit('clear')

        io.to(team.allianceColor).emit('draw', allianceGamePlay.getPreGameMarkers())
        io.to(team.allianceColor).emit('draw', allianceGamePlay.getAutonMarkers())
        io.to(team.allianceColor).emit('draw', allianceGamePlay.getTeleOpMarkers())
    })

    socket.on('setMatch', matchNumber => 
    {
        match.getGamePlay("blue").clearIdx()
        match.getGamePlay("red").clearIdx()

        match.setMatchNumber(matchNumber)
        timesheet.setMatchNumber(matchNumber)
        competition.setMatchNumber(matchNumber)

        match.open()

        if (fw.fileExists(("match" + matchNumber))) 
        {
            io.to('admin').emit('confirm')
        } 
        else 
        {
            fw.addNewGame("match" + match.matchNumber)
        }

        let lineup = {
            blue: timesheet.getTimeTable("blue").getCurrentLineUp(),
            red: timesheet.getTimeTable("red").getCurrentLineUp()
        } //

        socket.emit('setScouters', lineup.blue, lineup.red) //
    })

    socket.on('start', () => 
    {
        console.log("match " + match.matchNumber + " is starting")
        match.start()
    })

    socket.on('newAdmin', data => 
    {
        let table = {
            "blue": {},
            "red": {}
        }

        socket.leaveAll()
        socket.join("admin")
		//console.log(fw.getMatchData())
        let compLength = (Object.keys(fw.getMatchData())).length//.at(1)

		//console.log("complength: " + compLength)
        io.to('admin').emit('compLength', compLength)

        for (team of match.gamePlay.blue.teams) 
        {
            if (team.isConnected()) 
            {
                io.to('admin').emit('AssignRobot', team)
            }
        }
        
        for (team of match.gamePlay.red.teams) 
        {
            if (team.isConnected()) 
            {
                io.to('admin').emit('AssignRobot', team)
            }
        }

        io.to('admin').emit('rotate', field.blue.getRotation())

        io.to('admin').emit('drawfield', 'blue', field.blue.getDimensions(), grid.blue.getDimensions())
        io.to('admin').emit('drawfield', 'red', field.red.getDimensions(), grid.red.getDimensions())

        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.getPreGameMarkers())
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.getAutonMarkers())
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.getTeleOpMarkers())

        io.to('admin').emit('draw', 'red', match.gamePlay.red.getPreGameMarkers())
        io.to('admin').emit('draw', 'red', match.gamePlay.red.getAutonMarkers())
        io.to('admin').emit('draw', 'red', match.gamePlay.red.getTeleOpMarkers())

        table.blue = new ut.DynamicJsonTable(timesheet.getSchedule("blue"), "blue-table")
        table.red = new ut.DynamicJsonTable(timesheet.getSchedule("red"), "red-table")

        io.to('admin').emit('schedule', table.blue.json(), table.red.json()) 

        table.blue = new ut.DynamicJsonTable(competition.getSchedule("blue"), "blue-match-table")
        table.red = new ut.DynamicJsonTable(competition.getSchedule("red"), "red-match-table")

        io.to('admin').emit('teams', table.blue.json(), table.red.json())
    })

    socket.on('flip', () => 
    {
        let style = {}
        if (field.blue.isFlipped())
        {
            field.blue.flip()
            field.red.flip()
            
            field.blue.rotate("0deg")
            field.red.rotate("0deg")

            field.blue.bg = assets.blue
            field.red.bg = assets.red

            style.direction = "row"
            style.alignment = "flex-start"
            style.order = "1"
        } 
        else
        {
            field.blue.flip()
            field.red.flip()

            field.blue.rotate("180deg")
            field.red.rotate("180deg")

            field.blue.bg = assets.blueAlt
            field.red.bg = assets.redAlt

            style.direction = "row-reverse"
            style.alignment = "flex-end"
            style.order = "-1"
        }

        io.to('admin').emit('restyle', style)

        io.to('admin').emit('rotate', field.blue.getRotation())
        io.to('blue').emit('rotate', field.blue.getRotation())
        io.to('red').emit('rotate', field.red.getRotation())

        io.to('admin').emit('drawfield', 'blue', field.blue.getDimensions(), grid.blue.getDimensions())
        io.to('admin').emit('drawfield', 'red', field.red.getDimensions(), grid.red.getDimensions())
        io.to('blue').emit('drawfield', field.blue.getDimensions(), grid.blue.getDimensions())
        io.to('red').emit('drawfield', field.red.getDimensions(), grid.red.getDimensions())
    })

    socket.on('saveSchedule', (color, schedule) => 
    {
        timesheet.getTimeTable(color).setSchedule(schedule)
    })

    socket.on('saveMatch', (blueMatches, redMatches) => 
    {
        competition.getTimeTable("blue").setSchedule(blueMatches)
        competition.getTimeTable("red").setSchedule(redMatches)
    })

    //super charged node increasing/decreasing
    socket.on('inc', (color) => 
    {
        let autonScore
        let teleopScore

        console.log(superCharged[color])
        if (superCharged[color] >= 0) 
        {
            superCharged[color]++
        }

        if (team.gameState['auton'])
        {
            autonScore = team.gameState['auton']
            team.autonScore = autonScore;
        }

        if (team.gameState['teleop'])
        {
            teleopScore = team.gameState['teleop']
            team.teleopScore = teleopScore;
        }

        score.UpdateMarkers(
            match.gamePlay["blue"].ReturnTeleOpMarkers(), 
            match.gamePlay["red"].ReturnTeleOpMarkers(), 
            match.gamePlay["blue"].ReturnAutonMarkers(), 
            match.gamePlay["red"].ReturnAutonMarkers(), 
            team.teamNumber, 
            team, 
            superCharged["red"], 
            superCharged["blue"]
        )

        let ScoreBoard = {
            totalScore: score.GetBoard(), 
            team: team, 
            autonScore: autonScore, 
            teleopScore: teleopScore, 
            startTime: match.startTime
        }

        io.to(team.allianceColor).emit('scoreboard', ScoreBoard)
        io.to('admin').emit('scoreboard', ScoreBoard, team.scout)
    })

    socket.on('dec', (color) => 
    {
        let autonScore
        let teleopScore

        console.log(superCharged[color])
        if (superCharged[color] > 0) 
        {
            superCharged[color]--
        }

        if (team.gameState['auton'])
        {
            autonScore = team.gameState['auton']
            team.autonScore = autonScore;
        }

        if (team.gameState['teleop'])
        {
            teleopScore = team.gameState['teleop']
            team.teleopScore = teleopScore;
        }

        score.UpdateMarkers(
            match.gamePlay["blue"].ReturnTeleOpMarkers(), 
            match.gamePlay["red"].ReturnTeleOpMarkers(), 
            match.gamePlay["blue"].ReturnAutonMarkers(), 
            match.gamePlay["red"].ReturnAutonMarkers(), 
            team.teamNumber, 
            team, 
            superCharged["red"], 
            superCharged["blue"]
        )

        let ScoreBoard = {
            totalScore: score.GetBoard(), 
            team: team, 
            autonScore: autonScore, 
            teleopScore: teleopScore, 
            startTime: match.startTime
        }

        io.to(team.allianceColor).emit('scoreboard', ScoreBoard)
        io.to('admin').emit('scoreboard', ScoreBoard, team.scout)
    })

    /** DRAW MARKER HELPERS */
    function isValidLocation(markerType)
    {
        if(markerType == '')
            return false;

        return true;
    }

    socket.on('drawMarker', (allianceColor, data) => {


        

        if (session.scout == "admin") 
        {
            allianceGamePlay = match.getGamePlay(allianceColor)
            team = allianceGamePlay.getTeamByScout(session.scout)
        }
        
        if (!team.gameState[allianceGamePlay.gameState])
        {
            team.gameState[allianceGamePlay.gameState] = new gp.GameState()
            //team.setGameState(allianceGamePlay.gameState, new gp.GameState())
        }

        // ignore markers before game starts
        if (allianceGamePlay.isPreGame() && session.scout != "admin") 
            return; 

        team.markerColor.alpha = allianceGamePlay.gameStateIndicator()
        
        let drawMarker = new gp.Markers(data.x, data.y)
        let markerType =  allianceGamePlay.setMarkerType(
            drawMarker, 
            team.getGameState(allianceGamePlay.gameState).parkingState, 
            allianceGamePlay.gameState
        ) // this returns the marker type but also set details about the marker
        let markerId = drawMarker.getCoordinates()

        // check the location of the marker to see if it is a valid placement for the gamestate
        //let markerPlacement = allianceGamePlay.playingField.getFieldLocation(drawMarker)
        



        // check to see if the marker does not already exist
        if (!(allianceGamePlay.getMarker(markerId))) 
        {
            drawMarker.setMarkerColor(
                team.markerColor.red,
                team.markerColor.green,
                team.markerColor.blue,
                allianceGamePlay.gameStateIndicator()
            )

            drawMarker.setGameState(allianceGamePlay.gameState)
            drawMarker.setTeamNumber(team.teamNumber)
            //drawMarker.setType(allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState, allianceGamePlay.gameState)) //
            drawMarker.setType(
                markerType
                )

            // don't draw markers during pregame
            if(allianceGamePlay.isPreGame() && session.scout == "admin")
            {
                allianceGamePlay.addPreGameMarker(drawMarker, markerId)

                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            } 
            // the team already has a mobility marker
            else if (!isValidLocation(drawMarker.getMarkerType()))
            {
                return; // return and do not place anything. Marker is out of bounds
            }
            else
            {
                allianceGamePlay.addMarker(drawMarker, markerId)
                drawMarker.createTimeStamp(match.startTime)

               if (drawMarker.isMobile())
                {
                    team.mobilize()
                }
                else if (drawMarker.isParked()) // set the marker as parked
                {
                    team.getGameState(allianceGamePlay.gameState).park();
                }

                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            }
        } 
        /*else if (allianceGamePlay.clickedChargingStation(markerId) && !(team.isEngaged()) && (allianceGamePlay.getMarker(markerId).hasTeamNumber(team.teamNumber)))
        {
            allianceGamePlay.chargingStation.engage()
            team.engage()

            drawMarker = allianceGamePlay.getMarker(markerId)

            drawMarker.setMarkerColor(
                team.markerColor.red,
                team.markerColor.green,
                team.markerColor.blue,
                allianceGamePlay.gameStateIndicator() * 2
            )

            drawMarker.setGameState(allianceGamePlay.gameState)
            drawMarker.setTeamNumber(team.teamNumber)
            //drawMarker.setType(allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState)) //
            drawMarker.setType(
                allianceGamePlay.setMarkerType(
                    markerId, 
                    team.getGameState(allianceGamePlay.gameState).
                    parkingState
                )
            )
            drawMarker.createTimeStamp(match.startTime)

            io.to(team.allianceColor).emit('placeMarker', drawMarker)
            io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
        } */
        else if (allianceGamePlay.getMarker(markerId).hasTeamNumber(team.teamNumber)) 
        {
          /*  if (allianceGamePlay.clickedChargingStation(markerId)) 
            {
                team.disengage()
                team.undock()
                
                allianceGamePlay.chargingStation.disengage()
                allianceGamePlay.chargingStation.undock()
            }*/

            if (allianceGamePlay.getMarker(markerId).isMobile())
            {
                team.immobilize()
            } 
            else if (!allianceGamePlay.getMarker(markerId).isItem())
            {
                team.getGameState(allianceGamePlay.gameState).resetParking()
            }

            io.to(team.allianceColor).emit('clear')
            io.to('admin').emit('clear', team.allianceColor)
            // unpark the robot if the marker is deleted
            allianceGamePlay.deleteMarker(markerId)
            
            io.to(team.allianceColor).emit('draw', allianceGamePlay.getPreGameMarkers())
            io.to(team.allianceColor).emit('draw', allianceGamePlay.getAutonMarkers())
            io.to(team.allianceColor).emit('draw', allianceGamePlay.getTeleOpMarkers())

            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.getPreGameMarkers())
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.getAutonMarkers())
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.getTeleOpMarkers())
        }

        // scoring compoentents here 
        try
        {
            allianceGamePlay.score.UpdateMarkers(
                allianceGamePlay.getAutonMarkers(),
                allianceGamePlay.getTeleOpMarkers(),  
                team
            ) //
        } 
        catch (err)
        {
            console.log(err);
        }

   /*     let autonScore = {}
        let teleopScore = {}

        if (team.gameState['auton'])
        {
            autonScore = team.gameState['auton'] //
            team.autonScore = autonScore;
        }

        if (team.gameState['teleop'])
        {
            teleopScore = team.gameState['teleop'] //
            team.teleopScore = teleopScore;
        }*/

        let ScoreBoard = {
            totalScore: score.GetBoard(), 
            team: team, 
           // autonScore: autonScore, 
            //teleopScore: teleopScore, 
            startTime: match.startTime
        }
        
        io.to(team.allianceColor).emit('scoreboard', ScoreBoard)
        io.to('admin').emit('scoreboard', ScoreBoard, team.scout)

       // team.allianceColor.setScoreBoard(ScoreBoard)

        team.gameStateScore = JSON.stringify(team.gameState);

        fw.saveScoreData(match)
    })

    socket.on('gameChange', (allianceColor, value) => 
    {
        allianceGamePlay = match.getGamePlay(allianceColor)

        allianceGamePlay.switchGameState(gameStates, value)
        //allianceGamePlay.undockAll()
        //allianceGamePlay.disengageAll()
       // allianceGamePlay.chargingStation.reset()

        if(value === 'auton') 
            match.autonStart()

        console.log("the game mode for " + allianceColor + " is now set to " + allianceGamePlay.gameState)

        socket.emit('toggleGameMode', allianceColor)
        socket.emit('returnGameState', allianceGamePlay.gameState)
    })

    socket.on('scoutChange', scout => //
    {
        let admin, scouter
        if (match.gamePlay.blue.hasScouter(scout)) 
        {
            admin   = match.gamePlay.blue.getTeamByScout(session.scout)
            scouter = match.gamePlay.blue.getTeamByScout(scout)
        } 
        else if (match.gamePlay.red.hasScouter(scout)) 
        {
            admin   = match.gamePlay.red.getTeamByScout(session.scout)
            scouter = match.gamePlay.red.getTeamByScout(scout)
        }
        admin.setTeamNumber(scouter.teamNumber)
        admin.setMarkerColor(scouter.markerColor)
    })

    socket.on('adminChange', () => //
    {
        match.gamePlay.blue.getTeamByScout(session.scout).reset()
        match.gamePlay.red.getTeamByScout(session.scout).reset()

        match.gamePlay.blue.getTeamByScout(session.scout).setMarkerColors(25, 25, 25, 0.5)
        match.gamePlay.red.getTeamByScout(session.scout).setMarkerColors(25, 25, 25, 0.5)
    })

    socket.on('endMatch', () => //
    {
        superCharged.blue = 0 //
        superCharged.red = 0 //

        match.gamePlay.blue.clearGameStates()
        match.gamePlay.red.clearGameStates()

        match.gamePlay.blue.deleteMarkers()
        match.gamePlay.red.deleteMarkers()

        match.gamePlay.blue.undockAll()
        match.gamePlay.red.undockAll()
        match.gamePlay.blue.disengageAll()
        match.gamePlay.red.disengageAll()
        
        match.gamePlay.blue.chargingStation.reset()
        match.gamePlay.red.chargingStation.reset()

        match.gamePlay.blue.resetTeams()
        match.gamePlay.red.resetTeams()

        match.reset()

        io.to('blue').emit('gameOver')
        io.to('red').emit('gameOver')

        io.to('blue').emit('clear')
        io.to('red').emit('clear')

        io.to('admin').emit('clear', 'blue')
        io.to('admin').emit('clear', 'red')
    })

    socket.on('disconnect', () => 
    {
        console.log("Goodbye client with id " + socket.id);

        if (session.scout == "admin") 
        {
            match.disconnectAdmin()
            //match.reset() 
            // ^this completely halts the match if the admin disconnects. haven't seen a need to use it yet though, but uncomment it if necessary
            // note that resetting the match upon admin disconnection messes with data collection if a match is still in session
        } 
        else 
        {
            team.disconnect()
        }

        io.to('admin').emit('disconnected', team)
    })

    socket.on('gameState', allianceColor => 
    {
        allianceGamePlay = match.getGamePlay(allianceColor)
        socket.emit('returnGameState', allianceGamePlay.gameState)
    })

}

function initGame() //
{
    timesheet = new gp.TimeSheet(fw.parseBreaks())

    const data = fw.getScoutData()
    score = new ref.ScoreLive()

    match = new gp.Match()
    match.gamePlay.blue = new gp.GamePlay()
    match.gamePlay.red = new gp.GamePlay()
    match.gamePlay.blue.score = new ref.ScoreLive();
    match.gamePlay.red.score = new ref.ScoreLive();

    for (let scout in data.blue) {

        match.gamePlay.blue.addTeam(
            new gp.Team(
                data.blue[scout].name, 
                '', 
                'blue', 
                new gp.MarkerColor(
                    Number(data.blue[scout].color.red), 
                    Number(data.blue[scout].color.green), 
                    Number(data.blue[scout].color.blue), 
                    1
                )
            )
        )

    }

    for (let scout in data.red) {

        match.gamePlay.red.addTeam(
            new gp.Team(
                data.red[scout].name,  
                '',
                'red', 
                new gp.MarkerColor(
                    Number(data.red[scout].color.red), 
                    Number(data.red[scout].color.green), 
                    Number(data.red[scout].color.blue), 
                    1
                )
            )
        )
        
    }
    
    match.gamePlay.blue.addTeam(
        new gp.Team(
            data.admin.name, 
            '', 
            'blue', 
            new gp.MarkerColor(
                Number(data.admin.color.red), 
                Number(data.admin.color.green), 
                Number(data.admin.color.blue), 
                1
            )
        )
    )

    match.gamePlay.red.addTeam(
        new gp.Team(
            data.admin.name, 
            '', 
            'red', 
            new gp.MarkerColor(
                Number(data.admin.color.red), 
                Number(data.admin.color.green), 
                Number(data.admin.color.blue), 
                1
            )
        )
    )

    match.getGamePlay("blue").clearIdx()
    match.getGamePlay("red").clearIdx()

    match.gamePlay.blue.gameState = "pregame"
    match.gamePlay.red.gameState = "pregame"

    let coordinates = fw.getPlayingFieldCoordinates(); 

    match.gamePlay.blue.playingField = new gp.PlayingField(coordinates.LeftCoordinates);
    match.gamePlay.red.playingField = new gp.PlayingField(coordinates.RightCoordinates);

    
    competition = new gp.Event(fw.getMatchData())
    //console.log(fw.getMatchData())

    field.blue = new gp.Field(assets.blue, 700, 600)
    field.red = new gp.Field(assets.red, 700, 600)

    grid.blue = new gp.Grid(field.blue.width, field.blue.height, 25, 20)  
    grid.red = new gp.Grid(field.red.width, field.red.height, 25, 20)
}

 httpserver.listen(5500)
//httpserver.listen(80)


// app.listen(80, "0.0.0.0", function(){
//     console.log("running at http://192.168.88.226:80/")
// })

// add port forwarding here to public ip
// 192.x.x.x:xxxx format not working
