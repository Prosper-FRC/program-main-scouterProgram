const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];

const dev_mode = true
//************************* END OF PHYSICS ENGINE ***/

const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const app = express()
//const io = require('socket.io')(5500)
const gp = require('./Server/gamePieces')
const fw = require('./Server/fileWriter')
const ref = require('./Server/referee') 

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
    cookie: { maxAge: 3600000 },
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
    if (req.body.names == "admin") {
        req.session.authenticated = true
        req.session.scout = "admin"
        res.redirect('/admin')
    } else if (fw.getAlliance(req.body.names)) {
        req.session.authenticated = true
        req.session.scout = req.body.names
        req.session.allianceColor = fw.getAlliance(req.body.names)
        res.redirect('/' + req.session.allianceColor)
    } else {
        res.send(`Sorry, but that name was not found in the scouter list, for testing purposes use: 'David', 'Sterling', 'Scott', or 'blue2'. <a href=\'/lobby'>Click here to go back to the lobby</a>`)
    }
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/game', function(req, res) {
    if (dev_mode) {
        req.session.authenticated = true
        req.session.scout = 'Scott'
        req.session.allianceColor = "blue"
    }
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
let gamePlay = {
    blue: {},
    red: {}
}
//let gameState = "auton"
//let scoutDatas
//let score = new ref.ScoreLive(gamemarkers);
let score

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
io.on('connection', connected);

function connected(socket) {

    const session = socket.request.session
    let allianceGamePlay
    let team

    if (session.allianceColor) {
        allianceGamePlay = gamePlay[session.allianceColor]
        team = allianceGamePlay.findTeam(session.scout)
    }
    //let team = allianceGamePlay.findTeam(session.scout)
    //let admin = new gp.Team("admin", '', '', new MarkerColor(25, 25, 25, 0.5))

    //console.log(session)
    //console.log("session id: " + socket.request.session.id + "\n")
    //console.log("scout name: " + socket.request.session.scout + "\n")
    socket.on('newScouter', data => {
        socket.leaveAll()
        socket.join(session.allianceColor)
        console.log("New client connected, with id (yeah): " + socket.id)
        //let team = gamePlay[session.allianceColor].findTeam(session.scout)
        let scoreData = fw.getScoreData()
        io.to(team.allianceColor).emit('AssignRobot', team, scoreData)
    })

    socket.on('newAdmin', data => {
        socket.leaveAll()
        socket.join("admin")
    })

    socket.on('drawMarker', (allianceColor, data) => {
        if (session.scout == "admin") {
            allianceGamePlay = gamePlay[allianceColor]
            team = allianceGamePlay.findTeam(session.scout)
        }
        team.markerColor.alpha = (allianceGamePlay.gameState == "auton" ? 0.7 : 0.3)
        let drawMarker = {
            x: data.x,
            y: data.y,
            markerColor: team.markerColor
        }
        let markerId = "x" + drawMarker.x + "y" + drawMarker.y
        if(!(markerId in allianceGamePlay.telopMarkers) && !(markerId in allianceGamePlay.autonMarkers)) {
            //console.log(score);

            if (allianceGamePlay.gameState == "auton") {
                allianceGamePlay.addAutonMarker(drawMarker, markerId)
                fw.saveData("auton", allianceGamePlay.autonMarkers)
                console.log("auton markers updated: ")
                console.log(allianceGamePlay.autonMarkers)
            } else if (allianceGamePlay.gameState == "teleop") {
                allianceGamePlay.addTelopMarker(drawMarker, markerId)
                fw.saveData("telop", allianceGamePlay.telopMarkers)
                console.log("teleop markers updated: ")
                console.log(allianceGamePlay.telopMarkers)
            }

            io.to(team.allianceColor).emit('placeMarker', drawMarker)
            io.to('admin').emit('placeMarker', team.allianceColor, drawMarker)

        } else if (allianceGamePlay.findMarker(markerId) == "auton") {
            //console.log(allianceGamePlay.findMarker(markerId))
            if (allianceGamePlay.getAutonMarker(markerId).markerColor.equals(team.markerColor)) { 
                if (allianceGamePlay.gameState == "auton") {
                    allianceGamePlay.deleteAutonMarker(markerId)
                    console.log("auton markers updated: ")
                    console.log(allianceGamePlay.autonMarkers)
                } else if (allianceGamePlay.gameState == "teleop") {
                    allianceGamePlay.deleteTelopMarker(markerId)
                    console.log("teleop markers updated: ")
                    console.log(allianceGamePlay.telopMarkers)
                }
    
                io.to(team.allianceColor).emit('redraw', allianceGamePlay.telopMarkers, allianceGamePlay.autonMarkers)
                io.to('admin').emit('redraw', team.allianceColor, allianceGamePlay.telopMarkers)
            }
        } else if (allianceGamePlay.findMarker(markerId) == "teleop") {
            if (allianceGamePlay.getTelopMarker(markerId).markerColor.equals(team.markerColor)) { 
                if (allianceGamePlay.gameState == "auton") {
                    allianceGamePlay.deleteAutonMarker(markerId)
                    console.log("auton markers updated: ")
                    console.log(allianceGamePlay.autonMarkers)
                } else if (allianceGamePlay.gameState == "teleop") {
                    allianceGamePlay.deleteTelopMarker(markerId)
                    console.log("teleop markers updated: ")
                    console.log(allianceGamePlay.telopMarkers)
                }
    
                io.to(team.allianceColor).emit('redraw', allianceGamePlay.telopMarkers, allianceGamePlay.autonMarkers)
                io.to('admin').emit('redraw', team.allianceColor, allianceGamePlay.telopMarkers)
            }
        }
        
        // scoring compoentents here 
        score.UpdateMarkers();
        console.log(score.ScoreRaw());
    })

    /*socket.on('gameChange', () => {
        allianceGamePlay.gameState = (allianceGamePlay.gameState == "auton" ? "teleop" : "auton")
        console.log("the game mode for " + session.allianceColor + " is now set to " + allianceGamePlay.gameState)
        socket.emit('toggleGameMode')
    })*/

    socket.on('gameChange', allianceColor => {
        allianceGamePlay = gamePlay[allianceColor]
        allianceGamePlay.gameState = (allianceGamePlay.gameState == "auton" ? "teleop" : "auton")
        console.log("the game mode for " + allianceColor + " is now set to " + allianceGamePlay.gameState)
        socket.emit('toggleGameMode', allianceColor)
    })

    socket.on('disconnect', function() {
        console.log("Goodbye client with id " + socket.id);
        console.log("Current number of players: " + Object.keys(playerPos).length);
        //io.emit('updatePlayers', playerPos);
    })

}

function initGame()
{
    gamePlay.blue = new gp.GamePlay()
    gamePlay.red = new gp.GamePlay()

    score = new ref.ScoreLive(gamePlay.blue.telopMarkers)

    const data = fw.getScoutData()
    for (let scout in data.blue) {
        gamePlay.blue.teams.push(new gp.Team(data.blue[scout].name, '', 'blue', new gp.MarkerColor(Number(data.blue[scout].color.red), Number(data.blue[scout].color.green), Number(data.blue[scout].color.blue), 0.5)))
    }
    for (let scout in data.red) {
        gamePlay.red.teams.push(new gp.Team(data.red[scout].name, '', 'red', new gp.MarkerColor(Number(data.red[scout].color.red), Number(data.red[scout].color.green), Number(data.red[scout].color.blue), 0.5)))
    }
    gamePlay.blue.teams.push(new gp.Team(data.admin.name, '', 'blue', new gp.MarkerColor(Number(data.admin.color.red), Number(data.admin.color.green), Number(data.admin.color.blue), 0.5)))
    gamePlay.red.teams.push(new gp.Team(data.admin.name, '', 'red', new gp.MarkerColor(Number(data.admin.color.red), Number(data.admin.color.green), Number(data.admin.color.blue), 0.5)))
    
    gamePlay.blue.gameState = "auton"
    gamePlay.red.gameState = "auton"
    
    //fw.addScout(scoutData.name, scoutData);
    fw.addNewGame('match1');
}

httpserver.listen(5500)