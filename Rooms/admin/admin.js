const socket = io.connect('http://localhost:5500')
let match = false
let compLen = 0
let flipped = false

let canvas = {
    "blue": document.getElementById("blue-canvas"),
    "red": document.getElementById("red-canvas")
}

let image = {
    "blue": new Image(),
    "red": new Image()
}

image.blue.src = "../Assets/blueField.png"
image.red.src = "../Assets/redField.png"

let field = {
    "blue": new Field(image.blue, 775, 820),
    "red": new Field(image.red, 775, 820)
}
field.blue.setCanvas(canvas.blue)
field.red.setCanvas(canvas.red)

let grid = {
    "blue": new Grid(field.blue.width, field.blue.height, 55, 68),
    "red": new Grid(field.red.width, field.red.height, 55, 68)
}
grid.blue.setCanvas(canvas.blue)
grid.red.setCanvas(canvas.red)

let scoresheet = {}

let blueTotalScore = document.getElementById("total-blue")
let blueLinksScore = document.getElementById("links-blue")
let blueCoopScore = document.getElementById("coop-blue")
let blueRankingPoints = document.getElementById("rank-blue")

let redTotalScore = document.getElementById("total-red")
let redLinksScore = document.getElementById("links-red")
let redCoopScore = document.getElementById("coop-red")
let redRankingPoints = document.getElementById("rank-red")

let scoreboard = {
    "blue": new ScoreBoard(blueTotalScore, redTotalScore, blueTotalScore, blueLinksScore, blueCoopScore, blueRankingPoints),
    "red": new ScoreBoard(redTotalScore, blueTotalScore, redTotalScore, redLinksScore, redCoopScore, redRankingPoints)
}

let matchDropDown = document.getElementById("match")
let gameStateSlider = document.getElementById("game-state")
let gameStateLabel = document.getElementById("game-state-label")

window.onload = function() {
    drawField()
}

function drawField() {
    canvas.blue.width = field.blue.width
    canvas.blue.height = field.blue.height

    canvas.red.width = field.red.width
    canvas.red.height = field.red.height

    field.blue.draw()
    field.red.draw()

    grid.blue.draw()
    grid.red.draw()
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

socket.on('AssignRobot', (team) => 
{
    document.getElementById("robot-" + team.idx).innerHTML = team.teamNumber
    document.getElementById("robot-" + team.idx).style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)
    document.getElementById("name-" + team.idx).innerHTML = team.scout
    document.getElementById("name-" + team.idx).style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)

    let autonScore = document.getElementById("autonpts-robot-" + team.idx)
    let autonParking = document.getElementById("autonpark-robot-" + team.idx)
    let teleopScore = document.getElementById("teloppts-robot-" + team.idx) 
    let teleopParking = document.getElementById("teloppark-robot-" + team.idx)

    scoresheet[team.idx] = new ScoreCard(autonScore, teleopScore, autonParking, teleopParking)
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
    
    if(!(JSON.stringify(score.teleopScore) === '{}'))
    {
        scoresheet[score.team.idx].renderTeleopScore(score.teleopScore.markerScore)
        scoresheet[score.team.idx].renderTeleopParkingScore(score.teleopScore.parkingScore)
    }
    if(!(JSON.stringify(score.autonScore) === '{}'))
    { 
        scoresheet[score.team.idx].renderAutonScore(score.autonScore.markerScore)
        scoresheet[score.team.idx].renderAutonParkingScore(score.autonScore.parkingScore)
    }

    scoreboard.blue.renderAllianceScore(score.totalScore.blueAllianceScore)
    scoreboard.blue.renderLinksScore(score.totalScore.blueAllianceLinks)
    scoreboard.blue.renderCoopScore(score.totalScore.blueCoopScore)
    scoreboard.blue.renderRankingPoints(score.totalScore.blueRankingPoints)

    scoreboard.red.renderAllianceScore(score.totalScore.redAllianceScore)
    scoreboard.red.renderLinksScore(score.totalScore.redAllianceLinks)
    scoreboard.red.renderCoopScore(score.totalScore.redCoopScore)
    scoreboard.red.renderRankingPoints(score.totalScore.redRankingPoints)
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

    delete scoresheet[team.idx]

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
            scoreboard = {}
            socket.emit('endMatch')
            gameChange(gameStateSlider)
            break
    }
}

const flip = () => {
    if (!flipped) {
        document.getElementById("row").style.flexDirection = "row-reverse"
        document.getElementById("row").style.justifyContent = "flex-end"
        document.getElementById("panel").style.order = "-1"

        image.blue.src = "../Assets/blueField_alt.png"
        image.red.src = "../Assets/redField_alt.png"

        field.blue = new Field(image.blue, 775, 820)
        field.red = new Field(image.red, 775, 820)

        field.blue.setCanvas(canvas.blue)
        field.red.setCanvas(canvas.red)

        canvas.blue.style.transform = "rotate(180deg)"
        canvas.red.style.transform = "rotate(180deg)"

        drawField()

        flipped = true
    } 
    else 
    {
        document.getElementById("row").style.flexDirection = "row"
        document.getElementById("row").style.justifyContent = "flex-start"
        document.getElementById("panel").style.order = "1"
        
        image.blue.src = "../Assets/blueField.png"
        image.red.src = "../Assets/redField.png"

        field.blue = new Field(image.blue, 775, 820)
        field.red = new Field(image.red, 775, 820)

        field.blue.setCanvas(canvas.blue)
        field.red.setCanvas(canvas.red)

        canvas.blue.style.transform = "rotate(0deg)"
        canvas.red.style.transform = "rotate(0deg)"

        drawField()
        
        flipped = false
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