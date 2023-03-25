const socket = io.connect('http://localhost:5500')
let match = false
let compLen = 0

let indicator = {
    "pregame": 1,
    "auton": 0.7,
    "teleop": 0.3
}

let canvas = {
    "blue": document.getElementById("blue-canvas"),
    "red": document.getElementById("red-canvas")
}

let image = {
    "blue": new Image(),
    "red": new Image()
}

//old field assets
//image.blue.src = "../Assets/FRC_PlayingField_blue.png"
//image.red.src = "../Assets/FRC_PlayingField_red.png"

//traditional field orientation
image.blue.src = "../Assets/blueField.png"
image.red.src = "../Assets/redField.png"

//flipped field orientation
//image.blue.src = "../Assets/blueField_alt.png"
//image.red.src = "../Assets/redField_alt.png"

let field = {
    //"blue": new Field(image.blue, 800, 755),
    //"red": new Field(image.red, 800, 755)
    "blue": new Field(image.blue, 775, 820),
    "red": new Field(image.red, 775, 820)
}
field.blue.setCanvas(canvas.blue)
field.red.setCanvas(canvas.red)

let grid = {
    //"blue": new Grid(field.blue.width, field.blue.height, 47, 58),
    //"red": new Grid(field.red.width, field.red.height, 47, 58)
    "blue": new Grid(field.blue.width, field.blue.height, 55, 68),
    "red": new Grid(field.red.width, field.red.height, 55, 68)
}
grid.blue.setCanvas(canvas.blue)
grid.red.setCanvas(canvas.red)

let blueAllianceScore = document.getElementById("B-point")
let redAllianceScore = document.getElementById("A-point")

let scoreboard = {}

let checkboxes = document.getElementsByName("scout")
//let rows = document.getElementsByName("row")

let matchDropDown = document.getElementById("match")
let gameStateSlider = document.getElementById("game-state")
let gameStateLabel = document.getElementById("game-state-label")

window.onload = function() {
    canvas.blue.width = field.blue.width
    canvas.blue.height = field.blue.height

    canvas.red.width = field.red.width
    canvas.red.height = field.red.height

    field.blue.draw()
    field.red.draw()

    grid.blue.draw()
    grid.red.draw()
}

function makeSelection(checkbox) {
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })

    if (checkbox.checked) {
        socket.emit('scoutChange', checkbox.value)
    } else {
        socket.emit('adminChange')
    }
}

function scoutChange(button) {
    socket.emit('scoutChange', button.innerHTML)
}

canvas.blue.addEventListener("mousedown", function(e) {
    if (match) {
        socket.emit('drawMarker', 'blue', grid.blue.getMousePosition(e))
    } else {
        alert('please start the match before placing down markers')
    }
})

canvas.red.addEventListener("mousedown", function(e) {
    if (match) {
        socket.emit('drawMarker', 'red', grid.red.getMousePosition(e))
    } else {
        alert('please start the match before placing down markers')
    }
})

document.getElementById("match-increment").onclick = () => {
    let numVal = Number(matchDropDown.value)
    numVal += 1
    if (numVal > compLen) {
        numVal = compLen
    }
    matchDropDown.value = numVal
}

document.getElementById("match-decrement").onclick = () => {
    let numVal = Number(matchDropDown.value)
    numVal -= 1
    if (numVal <= 0) {
        numVal = 1
    }
    matchDropDown.value = numVal
}

socket.on('connect', () => {
    socket.emit('newAdmin')
})

socket.on('compLength', compLength => {
    compLen = compLength
    for (let i = 1; i <= Number(compLength); i++) 
    {
        let matchOption = document.createElement("option")
        matchOption.value = i
        matchOption.innerHTML = i
        matchDropDown.appendChild(matchOption)
    }
})

socket.on('AssignRobot', (team) => {

    document.getElementById("robot-" + team.idx).innerHTML = team.teamNumber
    document.getElementById("robot-" + team.idx).style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)
    document.getElementById("name-" + team.idx).innerHTML = team.scout
    document.getElementById("name-" + team.idx).style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)
})

socket.on('placeMarker', (color, marker) => {
    grid[color].placeMarker(marker.x, marker.y, marker.markerColor)
})

socket.on('redraw', (color, markers) => {
    field[color].clear()
    field[color].draw()
    grid[color].draw()
    for (let property in markers) {
        let marker = markers[property]
        grid[color].placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

socket.on('clear', color => {
    field[color].clear()
    field[color].draw()
    grid[color].draw()
})

socket.on('draw', (color, markers) => {
    for (let index in markers) {
        let marker = markers[index]
        grid[color].placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

socket.on('scoreboard', score => {
   // console.log("Score: " + JSON.stringify(score))
    
    if(!(JSON.stringify(score.teleopScore) === '{}'))
    {
        renderTelopScore(score.team.idx, score.teleopScore.markerScore)
        renderTelopParking(score.team.idx, score.teleopScore.parkingScore)
    }
    if(!(JSON.stringify(score.autonScore) === '{}'))
    { 
        renderAutonScore(score.team.idx, score.autonScore.markerScore)
        renderAutonParking(score.team.idx, score.autonScore.parkingScore)
    }
    document.getElementById("total-blue").innerHTML=score.totalScore.blueAllianceScore
    document.getElementById("coop-blue").innerHTML=score.totalScore.blueCoopScore
    document.getElementById("rank-blue").innerHTML=score.totalScore.blueRankingPoints
    document.getElementById("links-blue").innerHTML=score.totalScore.blueAllianceLinks
    document.getElementById("total-red").innerHTML=score.totalScore.redAllianceScore
    document.getElementById("coop-red").innerHTML=score.totalScore.redCoopScore
    document.getElementById("rank-red").innerHTML=score.totalScore.redRankingPoints
    document.getElementById("links-red").innerHTML=score.totalScore.redAllianceLinks

    /*if (scout.allianceColor == "blue") {
        scoreboard[scout].drawAllianceScore(score.totalScore.blueAllianceScore)
    } else if (scout.allianceColor == "red") {
        scoreboard[scout].drawAllianceScore(score.totalScore.redAllianceScore)
    }*/

    //console.log("score: " + JSON.stringify(score))
    //if(score.team.teamNumber === scoutData.teamNumber) {
       
    /*    if(!(JSON.stringify(score.teleopScore) === '{}'))
        {
            
            scoreboard[scout].drawTeleopScore(score.teleopScore.markerScore)
            //scoreboard[scout].drawTeleopParkingScore(score.teleopScore.parkingScore)
        }
        if(!(JSON.stringify(score.autonScore) === '{}'))
        {
          //  console.log("autonScore: " + JSON.stringify(score.autonScore))
            scoreboard[scout].drawAutonScore(score.autonScore.markerScore)
            //scoreboard[scout].drawAutonParkingScore(score.autonScore.parkingScore)
            
        }
    //}
    scoreboard[scout].drawCoopScore(score.totalScore.blueCoopScore)
    scoreboard[scout].drawAllianceLinks(score.totalScore.blueAllianceLinks)*/
    //scoreboard[scout].drawRankingPoints(score.totalScore.blueRankingPoints)
    
})

socket.on('confirm', () => {
    const response = confirm("Match " + matchDropDown.value + " was already scouted, do you want to scout it again?")
    if (response) {
        document.getElementById("start").innerText = "Start Auton"
    } else {
        document.getElementById("start").innerText = "Start Match"
    }
})

socket.on('disconnected', team => {

    document.getElementById("robot-" + team.idx).innerHTML = "-"
    document.getElementById("robot-" + team.idx).style.backgroundColor = "#ccc"
    document.getElementById("name-" + team.idx).innerHTML = "-"
    document.getElementById("name-" + team.idx).style.backgroundColor = "#ccc"

    //delet scoreboard[team.scout]

})

socket.on('returnGameState', gameState => {
    document.getElementById('game-state-label').value = gameState
})

const setGame = (button) => {
    switch (button.innerText) {
        case "Start Match":
            button.innerText = "Start Auton"
            socket.emit('setMatch', matchDropDown.value)
            match = true
            break
        case "Start Auton":
            button.innerText = "Start TeleOp"
            gameStateSlider.value = 1
            gameStateLabel.value = "auton"
            gameChange(gameStateSlider)
            socket.emit('start')
            break
        case "Start TeleOp":
            button.innerText = "End Match"
            gameStateSlider.value = 2
            gameStateLabel.value = "teleop"
            gameChange(gameStateSlider)
            break
        case "End Match":
            button.innerText = "Start Match"
            gameStateSlider.value = 0
            gameStateLabel.value = "pregame"
            match = false
            socket.emit('endMatch')
            gameChange(gameStateSlider)
            break
    }
}

const gameChange = (slider) => {
    let gameStateButton = document.getElementById("start")

    socket.emit('gameChange', 'blue', slider.value)
    socket.emit('gameChange', 'red', slider.value)

    switch (slider.value) {
        case "0":
            gameStateButton.innerText = "Start Match"
            break
        case "1":
            gameStateButton.innerText = "Start TeleOp"
            break
        case "2":
            gameStateButton.innerText = "End Match"
            break
    }

    socket.emit('gameState', 'blue')
}

const getScoreCell = (row, scoreType) => {
    let cells = row.getElementsByTagName('*')
    for (const cell of cells) {
        if (cell.getAttribute("id") == scoreType) {
            return cell
        }
    }
}

function renderAutonParking(teamNumber, autonParking)
{
    let autonparking = document.getElementById("autonpark-robot-" + teamNumber);
    autonparking.innerHTML=autonParking;
}

function renderAutonScore(teamNumber, autonScore)
{
    let autonscore = document.getElementById("autonpts-robot-" + teamNumber);
    autonscore.innerHTML=autonScore;
}

function renderTelopParking(teamNumber, telopParking)
{
    let telopparking = document.getElementById("teloppark-robot-" + teamNumber);
    telopparking.innerHTML=telopParking;
}

function renderTelopScore(teamNumber, telopScore)
{
    let telopscore = document.getElementById("teloppts-robot-" + teamNumber);
    telopscore.innerHTML=telopScore;
}