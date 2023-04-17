let assets = {
    blue: "../Assets/blueField.png",
    red: "../Assets/redField.png",
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

express.static('public');
app.use(express.static(__dirname + "/Rooms"))

app.post('/scoutdata', (req, res) => {
    let scoutData = fw.getScoutData()
    res.json(scoutData)
})

app.post("/signin", (req, res) => {
    if (req.body.username == "") 
    {
        res.send(ut.notification("Please choose a scouter."))
    } 
    else if (req.body.username == "admin" && req.body.password != "password")
    {
        res.send(ut.notification("That password is incorrect"))
    }
    else if (match.hasConnectedScouter(req.body.username))
    {
        res.send(ut.notification('Sorry, but somebody already joined under that name.'))
    }
    else if (req.body.username == "admin") 
    {
        req.session.authenticated = true
        req.session.scout = "admin"
        match.connectAdmin()
        res.redirect('/admin')
    } 
    else if (match.getGamePlay(fw.getAllianceColor(req.body.username)).isFull()) 
    {
        res.send(ut.notification('Sorry, but the session you are trying to join is full.'))
    }
    else if (match.inSession() && !(timesheet.hasScouter(req.body.username)))
    {
        res.send(ut.notification('Sorry, but you are not scheduled for this match.'))
    }
    else if (match.inSession() && fw.getAllianceColor(req.body.username) && match.hasAdmin())
    {
        req.session.authenticated = true
        req.session.scout = req.body.username
        req.session.allianceColor = fw.getAllianceColor(req.body.username)
        res.redirect('/' + req.session.allianceColor)
    } 
    else if (!match.hasAdmin()) 
    {
        res.send(ut.notification('The admin has not joined yet, please be patient'))
    } 
    else if (!match.inSession()) 
    {
        res.send(ut.notification('The admin has not started the match yet, please be patient.'))
    } 
    else 
    {
        res.send(ut.notification('Sorry, but that name was not found on the scouter list.'))
    }
})

app.post('/schedule/blue', (req, res) => {
    let table = new ut.JsonTable(timesheet.getSchedule("blue"))
    res.json(table.json())
})

app.post('/schedule/red', (req, res) => {
    let table = new ut.JsonTable(timesheet.getSchedule("red"))
    res.json(table.json())
})

app.post('/ondeck/blue', (req, res) => {
    let table = new ut.JsonTable(timesheet.getTimeTable("blue").getCurrentMatchLineUp())
    res.json(table.json())
})

app.post('/ondeck/red', (req, res) => {
    let table = new ut.JsonTable(timesheet.getTimeTable("red").getCurrentMatchLineUp())
    res.json(table.json())
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/lobby')
})

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/index.html'))
})

app.get('/blue', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/blue/index.html'))
})

app.get('/red', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/red/red.html'))
})

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/admin/admin.html'))
})

app.get('/lobby', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/lobby/lobby.html'))
})

app.get('*', function(req, res) {
    res.redirect('/lobby')
})

let match = {}
let score = {}

const gameStates = ["pregame", "auton", "teleop"]

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
        next();
    } else {
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
        allianceGamePlay = match.getGamePlay(session.allianceColor)
        team = allianceGamePlay.getTeamByScout(session.scout)
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
            let gameplay = match.getGamePlay(team.allianceColor)
            let position = gameplay.getIdx()
            let schedule = competition.getTimeTable(team.allianceColor)
            let teamNumber = schedule.getCurrentLineUpPosition(position)

            team.setTeamNumber(teamNumber)
            match.getGamePlay(team.allianceColor).increment()

            if(team.allianceColor == 'red')
            {
                team.setIdx(timesheet.getTimeTable("red").getCurrentLineUp().indexOf(team.scout) + 4)
            }
            else
            {
                team.setIdx(timesheet.getTimeTable("blue").getCurrentLineUp().indexOf(team.scout) + 1)
            }
            
        }

        team.connect()
        //team.gameState[allianceGamePlay.gameState] = new gp.GameState()
        team.setGameState(allianceGamePlay.gameState, new gp.GameState())

        socket.emit('rotate', field[team.allianceColor].getRotation())
        socket.emit('drawfield', field[team.allianceColor].getDimensions(), grid[team.allianceColor].getDimensions())

        socket.emit('AssignRobot', team)
        io.to('admin').emit('AssignRobot', team)

        //to do: fix this so that it only renders game markers on the newly joined client instead of re-drawing everyone's fields
        io.to(team.allianceColor).emit('clear')

        io.to(team.allianceColor).emit('draw', allianceGamePlay.preGameMarkers)
        io.to(team.allianceColor).emit('draw', allianceGamePlay.autonMarkers)
        io.to(team.allianceColor).emit('draw', allianceGamePlay.telopMarkers)
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

        socket.emit('setScouters', timesheet.getTimeTable("blue").getCurrentLineUp(), timesheet.getTimeTable("red").getCurrentLineUp()) //edit
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

        let compLength = (Object.keys(fw.getMatchData())).at(-1)
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

        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.preGameMarkers)
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.autonMarkers)
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.telopMarkers)

        io.to('admin').emit('draw', 'red', match.gamePlay.red.preGameMarkers)
        io.to('admin').emit('draw', 'red', match.gamePlay.red.autonMarkers)
        io.to('admin').emit('draw', 'red', match.gamePlay.red.telopMarkers)

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
    socket.on('inc', (color) => {
        console.log(superCharged[color])
        if (superCharged[color] >= 0) {
            superCharged[color]++
        }
    })

    socket.on('dec', (color) => {
        console.log(superCharged[color])
        if (superCharged[color] > 0) {
            superCharged[color]--
        }
    })

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

        team.markerColor.alpha = allianceGamePlay.gameStateIndicator()
        
        let drawMarker = new gp.Markers(data.x, data.y)
        let markerId = drawMarker.getCoordinates()

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

            drawMarker.setType(allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState, allianceGamePlay.gameState)) //

            // don't draw markers during pregame
            if(allianceGamePlay.isPreGame() && session.scout == "admin")
            {
                allianceGamePlay.addPreGameMarker(drawMarker, markerId)

                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            } 
            //else if (allianceGamePlay.gameState == 'pregame') 
            else if (allianceGamePlay.isPreGame()) 
            {
                //Ignore Marker
            } 
            // the team already has a mobility marker
            else if (drawMarker.isMobile() && allianceGamePlay.isAuton() && team.isMobile())
            {
                //Ignore Marker
            }
            else if (drawMarker.isOutOfBounds())
            {
                //Ignore Marker
            }
            // Check to see if the robot is already parked and don't accept the marker
            else if (!drawMarker.isItem() && team.getGameState(allianceGamePlay.gameState).isParked() && allianceGamePlay.isTeleop())
            {
                //Ignore Marker
            }
            // Check to see if the robot is already parked in auton and don't accept the marker
            else if (!drawMarker.isItem() && team.getGameState(allianceGamePlay.gameState).isParked() && allianceGamePlay.isAuton())
            {
                //Ignore Marker
            }
            else
            {
                allianceGamePlay.addMarker(drawMarker, markerId)
                drawMarker.createTimeStamp(match.startTime)

                if (allianceGamePlay.clickedChargingStation(markerId)) 
                {
                    allianceGamePlay.chargingStation.dock()
                    team.dock()
                } 
                else if (drawMarker.isMobile())
                {
                    team.mobilize()
                }

                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            }
        } 
        else if (allianceGamePlay.clickedChargingStation(markerId) && !(team.isEngaged()) && (allianceGamePlay.getMarker(markerId).hasTeamNumber(team.teamNumber)))
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
            drawMarker.setType(allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState)) //
            drawMarker.createTimeStamp(match.startTime)

            io.to(team.allianceColor).emit('placeMarker', drawMarker)
            io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
        } 
        else if (allianceGamePlay.getMarker(markerId).hasTeamNumber(team.teamNumber)) 
        {
            if (allianceGamePlay.clickedChargingStation(markerId)) 
            {
                team.disengage()
                team.undock()

                allianceGamePlay.chargingStation.disengage()
                allianceGamePlay.chargingStation.undock()
            }

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

            allianceGamePlay.deleteMarker(markerId)
            
            io.to(team.allianceColor).emit('draw', allianceGamePlay.preGameMarkers) //edit
            io.to(team.allianceColor).emit('draw', allianceGamePlay.autonMarkers)
            io.to(team.allianceColor).emit('draw', allianceGamePlay.telopMarkers)

            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.preGameMarkers) //edit
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.autonMarkers)
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.telopMarkers)
        }

        // scoring compoentents here 
        try
        {
            score.UpdateMarkers(match.gamePlay["blue"].ReturnTeleOpMarkers(), match.gamePlay["red"].ReturnTeleOpMarkers(), match.gamePlay["blue"].ReturnAutonMarkers(), match.gamePlay["red"].ReturnAutonMarkers(), team.teamNumber, team, superCharged["red"], superCharged["blue"]); //
        } 
        catch (err)
        {
            console.log(err);
        }

        let autonScore = {}
        let teleopScore = {}

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

        let ScoreBoard = {
            totalScore: score.GetBoard(), 
            team: team, 
            autonScore: autonScore, 
            teleopScore: teleopScore, 
            startTime: match.startTime
        }
        
        io.to(team.allianceColor).emit('scoreboard', ScoreBoard)
        io.to('admin').emit('scoreboard', ScoreBoard, team.scout)

        match.setScoreBoard(ScoreBoard)

        team.gameStateScore = JSON.stringify(team.gameState);

        fw.saveScoreData(match)
    })

    socket.on('gameChange', (allianceColor, value) => 
    {
        allianceGamePlay = match.getGamePlay(allianceColor)
        allianceGamePlay.switchGameState(gameStates, value)

        allianceGamePlay.undockAll()
        allianceGamePlay.disengageAll()
        allianceGamePlay.chargingStation.reset()

        if(value === 'auton') 
            match.autonStart()

        console.log("the game mode for " + allianceColor + " is now set to " + allianceGamePlay.gameState)

        socket.emit('toggleGameMode', allianceColor)
        socket.emit('returnGameState', allianceGamePlay.gameState)
    })

    socket.on('scoutChange', scout => //
    {
        if (match.gamePlay.blue.hasScouter(scout)) 
        {
            match.gamePlay.blue.getTeamByScout(session.scout).teamNumber = match.gamePlay.blue.getTeamByScout(scout).teamNumber
            match.gamePlay.blue.getTeamByScout(session.scout).markerColor = match.gamePlay.blue.getTeamByScout(scout).markerColor
        } 
        else if (match.gamePlay.red.hasScouter(scout)) 
        {
            match.gamePlay.red.getTeamByScout(session.scout).teamNumber = match.gamePlay.red.getTeamByScout(scout).teamNumber
            match.gamePlay.red.getTeamByScout(session.scout).markerColor = match.gamePlay.red.getTeamByScout(scout).markerColor
        }
    })

    socket.on('adminChange', () => //
    {
        match.gamePlay.blue.getTeamByScout(session.scout).reset()
        match.gamePlay.blue.getTeamByScout(session.scout).setMarkerColor(25, 25, 25, 0.5)

        match.gamePlay.red.getTeamByScout(session.scout).reset()
        match.gamePlay.red.getTeamByScout(session.scout).setMarkerColor(25, 25, 25, 0.5)
    })

    socket.on('endMatch', () => //
    {
        superCharged.blue = 0
        superCharged.red = 0

        match.gamePlay.blue.clearGameStates()
        match.gamePlay.red.clearGameStates()

        match.gamePlay.blue.deleteMarkers()
        match.gamePlay.red.deleteMarkers()

        match.gamePlay.blue.undockAll()
        match.gamePlay.blue.disengageAll()
        match.gamePlay.red.undockAll()
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

    socket.on('disconnect', () => {
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

function initGame()
{
    timesheet = new gp.TimeSheet(fw.parseBreaks())

    const data = fw.getScoutData()
    score = new ref.ScoreLive()

    match = new gp.Match()
    match.gamePlay.blue = new gp.GamePlay()
    match.gamePlay.red = new gp.GamePlay()

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

    match.gamePlay.blue.chargingStation = new gp.ChargingStation(7, 5, 4, 5)
    match.gamePlay.red.chargingStation = new gp.ChargingStation(4, 5, 3, 5)
    match.gamePlay.blue.parkingField = new gp.ParkingField(3,3,4,7,3,9,7,2)
    match.gamePlay.red.parkingField = new gp.ParkingField(7,3,4,7,4,10,7,2)
    match.gamePlay.blue.itemField = new gp.ItemField(0,3,3,9)
    match.gamePlay.red.itemField = new gp.ItemField(11,3,3,9)
    
    competition = new gp.Event(fw.getMatchData())

    field.blue = new gp.Field(assets.blue, 775, 820)
    field.red = new gp.Field(assets.red, 775, 820)

    grid.blue = new gp.Grid(field.blue.width, field.blue.height, 55, 68)
    grid.red = new gp.Grid(field.red.width, field.red.height, 55, 68)
}

httpserver.listen(5500)