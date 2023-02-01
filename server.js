const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];

//************************* END OF PHYSICS ENGINE ***/

/*class MarkerColor {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}*/

const express = require('express')
const fs = require('fs')
const bodyParser = require("body-parser")
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

express.static('public');
app.use(express.static(__dirname + "/Rooms"))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/index.html'))
})

app.get('*', function(req, res) {
    res.redirect('/game')
})

let playerPos = {}
let gamePlay = {}
//let scoutDatas
//let score = new ref.ScoreLive(gamemarkers);
let score

initGame();
io.on('connection', connected);

function connected(socket) {

    socket.on('newScouter', data => {
        console.log("New client connected, with id (yeah): " + socket.id)
        for (let scout in gamePlay.teams) {
            if (gamePlay.teams[scout].id == '') {
                gamePlay.teams[scout].id = socket.id
                break
            }
        }
        let scout = gamePlay.teams.find(item => item.id === socket.id)
        let scoreData = fw.getScoreData()
        io.emit('AssignRobot', scout, scoreData)
    })

    socket.on('drawMarker', data => {
        let scout = gamePlay.teams.find(item => item.id === socket.id)
        let drawMarker = {
            x: data.x,
            y: data.y,
            markerColor: scout.markerColor
        }
        let markerId = "x" + drawMarker.x + "y" + drawMarker.y;
        if(!(markerId in gamePlay.telopMarkers))
        {
            //addMarker(drawMarker, markerId);
            //console.log(score);
            gamePlay.addTelopMarker(drawMarker, markerId)
            io.emit('placeMarker', drawMarker);
        } else if (
            gamePlay.telopMarkers[markerId].markerColor.red == scout.markerColor.red && 
            gamePlay.telopMarkers[markerId].markerColor.green == scout.markerColor.green && 
            gamePlay.telopMarkers[markerId].markerColor.blue == scout.markerColor.blue
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
        gamePlay.teams.push(
            new gp.Team(
                '',
                data.blue[scout].name,
                '',
                'Blue',
                new gp.MarkerColor(
                    Number(data.blue[scout].color.red),
                    Number(data.blue[scout].color.green),
                    Number(data.blue[scout].color.blue),
                    0.5
                )
            )
        )
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