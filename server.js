const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];

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
app.use(bodyParser.urlencoded({ extended: true }));

//import { MarkerColor } from './gamePieces'
//MarkerColor = require('./gamePieces')

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

app.post("/waitingroom", (req, res) => {
    req.session.authenticated = true
    res.redirect('/game')
    //res.status(204).end();
  })

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/index.html'))
})

app.get('/lobby', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/lobby.html'))
})

app.get('*', function(req, res) {
    res.redirect('/lobby')
})

let currentSession
let playerPos = {}
let gamePlay = {}
//let scoutDatas
//let score = new ref.ScoreLive(gamemarkers);
let score

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

//don't delete this commented code plz
//commented for debugging purposes; uncomment to enable user verification
/*io.use(wrap(sessionMiddleware))

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
        next();
    } else {
        console.log("unauthorized user joined")
        next(new Error("unauthorized"))
    }
})*/

initGame();
io.on('connection', connected);

function connected(socket) {
    console.log(socket.request.session)
    socket.on('newScouter', data => {
        console.log("New client connected, with id (yeah): " + socket.id)
        for (let scout in gamePlay.teams) {
            if (gamePlay.teams[scout].id == '') {
                gamePlay.teams[scout].id = socket.id
                break
            }
        }
        //let scout = gamePlay.teams.find(item => item.id === socket.id)
        let team = gamePlay.findTeam(socket.id)
        let scoreData = fw.getScoreData()
        io.emit('AssignRobot', team, scoreData)
    })

    socket.on('drawMarker', data => {
        //let scout = gamePlay.teams.find(item => item.id === socket.id)
        let team = gamePlay.findTeam(socket.id)
        let drawMarker = {
            x: data.x,
            y: data.y,
            markerColor: team.markerColor
        }
        let markerId = "x" + drawMarker.x + "y" + drawMarker.y;
        if(!(markerId in gamePlay.telopMarkers))
        {
            //addMarker(drawMarker, markerId);
            //console.log(score);
            gamePlay.addTelopMarker(drawMarker, markerId)
            io.emit('placeMarker', drawMarker);
        } else if (
            gamePlay.telopMarkers[markerId].markerColor.red == team.markerColor.red && 
            gamePlay.telopMarkers[markerId].markerColor.green == team.markerColor.green && 
            gamePlay.telopMarkers[markerId].markerColor.blue == team.markerColor.blue
            ) {
            //deleteMarker(markerId)
            gamePlay.deleteTelopMarker(markerId)
            io.emit('redraw', gamePlay.telopMarkers)
        }
        // scoring compoentents here 
        score.UpdateMarkers();
        console.log(score.ScoreRaw());
    })

    socket.on('disconnect', function(){
        let scout = gamePlay.teams.find(item => item.id === socket.id)
        scout.id = ''
        console.log("Goodbye client with id " + socket.id);
        console.log("Current number of players: " + Object.keys(playerPos).length);
        //io.emit('updatePlayers', playerPos);
    })

}

function initGame()
{
    //let markerColor = new gp.MarkerColor(235,255,137,0.5)
    //scoutData = new gp.Team('Scott', '5411', 'Red', markerColor)
    //score = new ref.ScoreLive(gamemarkers)
    gamePlay = new gp.GamePlay()
    score = new ref.ScoreLive(gamePlay.telopMarkers)
    const data = fw.getScoutData()
    for (let scout in data.blue) {
        gamePlay.teams.push(new gp.Team('', data.blue[scout].name, '', 'Blue', new gp.MarkerColor(Number(data.blue[scout].color.red), Number(data.blue[scout].color.green), Number(data.blue[scout].color.blue), 0.5)))
    }
    //fw.addScout(scoutData.name, scoutData);
    fw.addNewGame('match1');
}

function addMarker(gameMarker, markerId)
{
    let newMarker = new gp.Markers(gameMarker.x, gameMarker.y);
    newMarker.markerColor = gameMarker.markerColor;
    gamePlay.telopMarkers[markerId] = newMarker
    let scoreData = fw.getScoreData()
    scoreData["telop"] = gamePlay.telopMarkers
    fw.saveScoreData(scoreData)
}

function deleteMarker(markerId) {
    delete gamePlay.telopMarkers[markerId]
    let scoreData = fw.getScoreData()
    scoreData["teleop"] = gamePlay.telopMarkers
    fw.saveScoreData(scoreData)
}

httpserver.listen(5500)