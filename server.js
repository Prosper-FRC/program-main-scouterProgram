const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];

const dev_mode = false
let admin = false
let teamNum = 1
let teamIndex = {
    blue: "",
    red: ""
}

const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const app = express()
//const io = require('socket.io')(5500)
const gp = require('./Server/gamePieces')
const fw = require('./Server/fileWriter')
const ref = require('./Server/referee') 
const start = performance.now();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const http = require("http")
const socketio = require("socket.io")
const path = require("path")
const httpserver = http.Server(app)
const io = socketio(httpserver)

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
    if (req.body.Scouters == "admin") {

        req.session.authenticated = true
        req.session.scout = "admin"
        admin = true
        res.redirect('/admin')

    } else if (match.matchNumber != '' && fw.getAlliance(req.body.Scouters) && admin) {

        req.session.authenticated = true
        req.session.scout = req.body.Scouters
        req.session.allianceColor = fw.getAlliance(req.body.Scouters)
        res.redirect('/' + req.session.allianceColor)

    } else if (!admin) {

        res.send(`The admin hasn't joined yet, please be patient. If you are a developer, please launch the admin page before logging in as a scouter. <a href=\'/lobby'>Click here to go back to the lobby</a>`)

    } else if (match.matchNumber == '') {

        res.send(`The admin hasn't set the match yet. If you are a developer, please set the match on the admin panel. <a href=\'/lobby'>Click here to go back to the lobby</a>`)

    } else {

        res.send(`Sorry, but that name was not found in the scouter list, for testing purposes use: 'David', 'Sterling', 'Scott', or 'blue2'. <a href=\'/lobby'>Click here to go back to the lobby</a>`)
    
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    console.log("\nsession destroyed\n")
    res.redirect('/lobby')
})

//app.get('/', (req, res) => res.send('Hello World!'))

/*app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/lobby/lobby.html'))
})*/

app.get('/game', function(req, res) {
    /*if (dev_mode) {
        req.session.authenticated = true
        req.session.scout = 'Scott'
        req.session.allianceColor = "blue"
    }*/
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

let playerPos = {}
let match = {}
let score = {}

const gameStates = ["pregame", "auton", "teleop"]
let matchData = {}

//let score = new ref.ScoreLive(gamemarkers);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
        next();
    } else {
        console.log("unauthorized user joined")
        next(new Error("unauthorized"))
    }
})


initGame();
// time stamps 

let timeStamps = [];

//let score = new ref.ScoreLive();

io.on('connection', connected);

function connected(socket) {

    const session = socket.request.session
    let allianceGamePlay
    let team

    if (session.allianceColor) {
        allianceGamePlay = match.gamePlay[session.allianceColor]
        team = allianceGamePlay.findTeam(session.scout)
    } 

    //console.log(session)
    //console.log("session id: " + socket.request.session.id + "\n")
    //console.log("scout name: " + socket.request.session.scout + "\n")

    socket.on('newScouter', data => {

        socket.leaveAll()
        socket.join(session.allianceColor)

        console.log("New client connected, with id (yeah): " + socket.id)

        if (team.teamNumber == '') 
        {
            //team.teamNumber = teamNum
            //team.teamNumber = matchData[match.matchNumber][team.allianceColor][teamNum].slice(3)
            

            team.teamNumber = matchData[match.matchNumber][team.allianceColor][teamIndex[team.allianceColor]].slice(3)
            teamIndex[team.allianceColor]++
            team.idx = teamNum
            teamNum++
        }

        team.connection = true
        team.gameState[allianceGamePlay.gameState] = new gp.GameState()

        //io.to(team.allianceColor).emit('AssignRobot', team)
        socket.emit('AssignRobot', team)
        io.to('admin').emit('AssignRobot', team)

        io.to(team.allianceColor).emit('clear')

        io.to(team.allianceColor).emit('draw', allianceGamePlay.preGameMarkers)
        io.to(team.allianceColor).emit('draw', allianceGamePlay.autonMarkers)
        io.to(team.allianceColor).emit('draw', allianceGamePlay.telopMarkers)

    })

    socket.on('setMatch', matchNumber => {
        match.matchNumber = matchNumber
        if (fw.fileExists(("match" + matchNumber))) {
            io.to('admin').emit('confirm')
        } else {
            fw.addNewGame("match" + match.matchNumber)
        }
    })

    socket.on('start', () => {
        teamNum = 1
        teamIndex.blue = 0
        teamIndex.red = 0

        console.log("match " + match.matchNumber + " is starting")

        for (team of match.gamePlay.blue.teams)
        {
            team = {};
        }

        for (team of match.gamePlay.red.teams)
        {
            team = {};
        }
    })

    socket.on('newAdmin', data => {
        socket.leaveAll()
        socket.join("admin")

        //console.log( (Object.keys(fw.getMatchData())).at(-1) )
        let compLength = (Object.keys(fw.getMatchData())).at(-1)
        io.to('admin').emit('compLength', compLength)

        for (team of match.gamePlay.blue.teams) {
            if (team.connection) {
                io.to('admin').emit('AssignRobot', team)
            }
        }
        
        for (team of match.gamePlay.red.teams) {
            if (team.connection) {
                io.to('admin').emit('AssignRobot', team)
            }
        }

        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.preGameMarkers)
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.autonMarkers)
        io.to('admin').emit('draw', 'blue', match.gamePlay.blue.telopMarkers)

        io.to('admin').emit('draw', 'red', match.gamePlay.red.preGameMarkers)
        io.to('admin').emit('draw', 'red', match.gamePlay.red.autonMarkers)
        io.to('admin').emit('draw', 'red', match.gamePlay.red.telopMarkers)
    })

    socket.on('drawMarker', (allianceColor, data) => {

        if (session.scout == "admin") 
        {
            allianceGamePlay = match.gamePlay[allianceColor]
            team = allianceGamePlay.findTeam(session.scout)

        }
        if (!team.gameState[allianceGamePlay.gameState])
            team.gameState[allianceGamePlay.gameState] = new gp.GameState()

        team.markerColor.alpha = allianceGamePlay.gameStateIndicator()
        
        let drawMarker = new gp.Markers(data.x, data.y)
        let markerId = "x" + drawMarker.x + "y" + drawMarker.y
        

        if (!(allianceGamePlay.findMarker(markerId)) ) {
            //console.log(score);

            drawMarker.markerColor = team.markerColor
            drawMarker.gameState = allianceGamePlay.gameState
            drawMarker.teamNumber = team.teamNumber
            drawMarker.markerType = allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState, allianceGamePlay.gameState)

            // don't draw markers during pregame
            if(allianceGamePlay.gameState == 'pregame' && session.scout == "admin")
            {
                allianceGamePlay.addPreGameMarker(drawMarker, markerId)
                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            } else if (allianceGamePlay.gameState == 'pregame') {

            } else if(drawMarker.markerType == 'Parked' && allianceGamePlay.gameState == 'auton') // parking isn't scored during auton only docking and engaging
            {}
            // Check to see if the robot is already parked and don't accept the marker
            else if(!(drawMarker.markerType == 'Item') && !(team.gameState[allianceGamePlay.gameState].parkingState == ''))
            {}
            else
            {
                allianceGamePlay.addMarker(drawMarker, markerId)

                // create time stamp
                CreateTimeStamp(markerId, allianceColor)

                if (allianceGamePlay.clickedChargingStation(markerId)) {
                    //allianceGamePlay.chargingStation.engaged = true
                    team.engaged = true
                }

                io.to(team.allianceColor).emit('placeMarker', drawMarker)
                io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)
            }

        //} else if (allianceGamePlay.clickedChargingStation(markerId) && allianceGamePlay.chargingStation.docked == false) {
        } else if (allianceGamePlay.clickedChargingStation(markerId) && !(team.docked)) {

            //allianceGamePlay.chargingStation.docked = true
            team.docked = true

            drawMarker = allianceGamePlay.getMarker(markerId)
            drawMarker.markerColor = team.markerColor
            drawMarker.gameState = allianceGamePlay.gameState
            drawMarker.teamNumber = team.teamNumber
            drawMarker.markerType = allianceGamePlay.GetMarkerType(markerId, team.gameState[allianceGamePlay.gameState].parkingState)
            

            io.to(team.allianceColor).emit('placeMarker', drawMarker)
            io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)

        } else if (allianceGamePlay.getMarker(markerId).teamNumber == team.teamNumber) {

            if (allianceGamePlay.clickedChargingStation) {
                //allianceGamePlay.chargingStation.engaged = false
                team.engaged = false
                //allianceGamePlay.chargingStation.docked = false
                team.docked = false
            }



            if(!(allianceGamePlay.getMarker(markerId).markerType == 'Item'))
            {
                team.gameState[allianceGamePlay.gameState].parkingScore = 0;
                team.gameState[allianceGamePlay.gameState].parkingState = '';

            }
            io.to(team.allianceColor).emit('clear')
            io.to('admin').emit('clear', team.allianceColor)

            allianceGamePlay.deleteMarker(markerId)
            
            //delete time stamp
            DeleteTimeStamp(markerId);
            
            io.to(team.allianceColor).emit('draw', allianceGamePlay.preGameMarkers)
            io.to(team.allianceColor).emit('draw', allianceGamePlay.autonMarkers)
            io.to(team.allianceColor).emit('draw', allianceGamePlay.telopMarkers)

            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.preGameMarkers)
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.autonMarkers)
            io.to('admin').emit('draw', team.allianceColor, allianceGamePlay.telopMarkers)
        }

        // scoring compoentents here 
        score.UpdateMarkers(match.gamePlay["blue"].ReturnTeleOpMarkers(), match.gamePlay["red"].ReturnTeleOpMarkers(), match.gamePlay["blue"].ReturnAutonMarkers(), match.gamePlay["red"].ReturnAutonMarkers(), team.teamNumber, team);
      //  console.log("Blue:" + score.TeamScore("blue"));
     //   console.log("Red: " + score.TeamScore("red"));

        let autonScore = {}
        let teleopScore = {}
        if(team.gameState['auton'])
            autonScore = team.gameState['auton']
        if(team.gameState['teleop'])
            teleopScore = team.gameState['teleop']

        let ScoreBoard = {totalScore: score.GetBoard(), team: team, autonScore: autonScore, teleopScore: teleopScore};
        io.to(team.allianceColor).emit('scoreboard', ScoreBoard)
        io.to('admin').emit('scoreboard', ScoreBoard, team.scout) //pretty buggy, uncomment at your own risk
       // console.log(timeStamps);

        fw.saveScoreData(match)
    })

    socket.on('gameChange', (allianceColor, value) => {

        allianceGamePlay = match.gamePlay[allianceColor]
        //allianceGamePlay.switchGameState(value)
        allianceGamePlay.switchGameState(gameStates, value)

        console.log("the game mode for " + allianceColor + " is now set to " + allianceGamePlay.gameState)
        socket.emit('toggleGameMode', allianceColor)
        socket.emit('returnGameState', allianceGamePlay.gameState)
    })

    socket.on('scoutChange', scout => {
        if (match.gamePlay.blue.hasScouter(scout)) {

            match.gamePlay.blue.findTeam(session.scout).teamNumber = match.gamePlay.blue.findTeam(scout).teamNumber
            match.gamePlay.blue.findTeam(session.scout).markerColor = match.gamePlay.blue.findTeam(scout).markerColor

        } else if (match.gamePlay.red.hasScouter(scout)) {

            match.gamePlay.red.findTeam(session.scout).teamNumber = match.gamePlay.red.findTeam(scout).teamNumber
            match.gamePlay.red.findTeam(session.scout).markerColor = match.gamePlay.red.findTeam(scout).markerColor

        }
    })

    socket.on('adminChange', () => {
        
        match.gamePlay.blue.findTeam(session.scout).teamNumber = ''
        match.gamePlay.blue.findTeam(session.scout).markerColor = new gp.MarkerColor(25, 25, 25, 0.5)

        match.gamePlay.red.findTeam(session.scout).teamNumber = ''
        match.gamePlay.red.findTeam(session.scout).markerColor = new gp.MarkerColor(25, 25, 25, 0.5)
    })

    socket.on('endMatch', () => {
        io.to('blue').emit('gameOver')
        io.to('red').emit('gameOver')
    })

    socket.on('disconnect', () => {
        console.log("Goodbye client with id " + socket.id);
        console.log("Current number of players: " + Object.keys(playerPos).length);
        //io.emit('updatePlayers', playerPos);

        //team.teamNumber = ''
        team.connection = false

        io.to('admin').emit('disconnected', team)
    })

    socket.on('gameState', allianceColor => {
        allianceGamePlay = match.gamePlay[allianceColor]
        socket.emit('returnGameState', allianceGamePlay.gameState)
    })

}

function initGame()
{
    teamNum = 1
    teamIndex.blue = 0
    teamIndex.red = 0

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

    match.gamePlay.blue.gameState = "pregame"
    match.gamePlay.red.gameState = "pregame"

    match.gamePlay.blue.chargingStation = new gp.ChargingStation(7, 5, 4, 5)
    match.gamePlay.red.chargingStation = new gp.ChargingStation(4, 5, 3, 5)
    match.gamePlay.blue.parkingField = new gp.ParkingField(3,3,4,7,3,9,7,2)
    match.gamePlay.red.parkingField = new gp.ParkingField(7,3,4,7,4,4,7,2)
    match.gamePlay.blue.itemField = new gp.ItemField(0,3,3,9)
    match.gamePlay.red.itemField = new gp.ItemField(11,3,3,9)
    
    matchData = fw.getMatchData()
}

function CreateTimeStamp(key, team)
{
    let end = performance.now();
    const timestamp = 
    {
        Date: end - start,
        Team: team
    };

    timeStamps[key] = timestamp;
}
function DeleteTimeStamp(key)
{
    delete timeStamps[key];
}



httpserver.listen(5500)