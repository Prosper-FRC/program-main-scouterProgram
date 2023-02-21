const socket = io.connect('http://localhost:5500')
let match = false

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
//image.blue.src = "../Assets/FRC_PlayingField_blue.png"
//image.red.src = "../Assets/FRC_PlayingField_red.png"
image.blue.src = "../Assets/blueField.png"
image.red.src = "../Assets/redField.png"

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

let autonScore = {
    "blue": document.getElementById("auton-blue"),
    "red": document.getElementById("auton-red")
} 
let teleopScore = {
    "blue": document.getElementById("telop-blue"),
    "red": document.getElementById("teleop-red")
}
let totalScore = {
    "blue": document.getElementById("total-blue"),
    "red": document.getElementById("total-red")
}
let links = {
    "blue": document.getElementById("links-blue"),
    "red": document.getElementById("links-red")
}
let coopScore = {
    "blue": document.getElementById("co-op-blue"),
    "red": document.getElementById("co-op-red")
}
let rankingPoints = {
    "blue": document.getElementById("ranking-points-blue"),
    "red": document.getElementById("ranking-points-red")
}

/*let scoreboard = {
    "blue": new ScoreBoard(blueAllianceScore, autonScore.blue, teleopScore.blue, totalScore.blue, links.blue, coopScore.blue, rankingPoints.blue),
    "red": new ScoreBoard(redAllianceScore, autonScore.red, teleopScore.red, totalScore.red, links.red, coopScore.red, rankingPoints.red)
}*/

let scoreboard = {}

let checkboxes = document.getElementsByName("scout")
let rows = document.getElementsByName("row")

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

socket.on('connect', () => {
    socket.emit('newAdmin')
})

socket.on('AssignRobot', (data) => {
    try {

        checkboxes.forEach((item, index) => {
            if (item.value == "" && item.className == data.allianceColor) {
                item.parentElement.style.display = "block"
                item.parentElement.style.backgroundColor = "rgb(" + data.markerColor.red + "," + data.markerColor.green + "," + data.markerColor.blue + ")"
                item.parentElement.style.color = data.allianceColor
                item.value = data.scout
                item.previousElementSibling.innerHTML = data.teamNumber + " - " + data.scout

                let row = rows[index]
                row.style.backgroundColor = "rgb(" + data.markerColor.red + "," + data.markerColor.green + "," + data.markerColor.blue + ")"
                let cells = row.getElementsByTagName('*')
                row.setAttribute("id", data.scout)

                for (let i = 0; i < cells.length; ++i) {
                    cells[i].style.backgroundColor = "rgb(" + data.markerColor.red + "," + data.markerColor.green + "," + data.markerColor.blue + ")" 
                }

                throw BreakException
            }
        })

      } catch (e) {

        if (e !== BreakException) throw e

      } /*finally {

        if (data.allianceColor = "blue") {
            scoreboard[data.scout] = new ScoreBoard(blueAllianceScore, getScoreCell(data.scout, "auton-blue"), getScoreCell(data.scout, "telop-blue"), getScoreCell(data.scout, "total-blue"), getScoreCell(data.scout, "links-blue"), getScoreCell(data.scout, "co-op-blue"), getScoreCell(data.scout, "ranking-points-blue"))
        } else if (data.allainceColor == "red") {
            scoreboard[data.scout] = new ScoreBoard(blueAllianceScore, getScoreCell(data.scout, "auton-red"), getScoreCell(data.scout, "telop-red"), getScoreCell(data.scout, "total-red"), getScoreCell(data.scout, "links-red"), getScoreCell(data.scout, "co-op-red"), getScoreCell(data.scout, "ranking-points-red"))
        }

      }*/
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
        marker.markerColor.alpha = indicator[marker.gameState]
        grid[color].placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

/*socket.on('scoreboard', (color, score) => {
    if (color == "blue") {
        scoreboard[color].drawAllianceScore(score.blueAllianceScore)
        scoreboard[color].drawTeleopScore(score.blueAllianceTelopScore)
    } else if (color == "red") {
        scoreboard[color].drawAllianceScore(score.redAllianceScore)
        scoreboard[color].drawTeleopScore(score.redAllianceTelopScore)
    }
})*/

socket.on('scoreboard', (score, scout) => {
    console.log(scoreboard[scout])
    scoreboard[scout].drawTeleopScore(score.totalScore.blueAllianceTelopScore)
})

socket.on('confirm', () => {
    const response = confirm("Match 1 was already scouted, do you want to scout it again?")
    if (response) {
        document.getElementById("start").innerText = "Start Auton"
    } else {
        document.getElementById("start").innerText = "Start Match"
    }
})

socket.on('disconnected', team => {

    location.reload()

    /*try {

        checkboxes.forEach((item, index) => {
            if (item.value == team.scout && item.className == team.allianceColor) {
                item.parentElement.style.display = "hidden"
                //item.parentElement.style.backgroundColor = "rgb(" + data.markerColor.red + "," + data.markerColor.green + "," + data.markerColor.blue + ")"
                //item.parentElement.style.color = data.allianceColor
                //item.value = data.scout
                item.previousElementSibling.innerHTML = ""

                let row = rows[index]
                row.style.backgroundColor = "rgb(" + data.markerColor.red + "," + data.markerColor.green + "," + data.markerColor.blue + ")"
                let cells = row.getElementsByTagName('*')

                for (let i = 0; i < cells.length; ++i) {
                    cells[i].style.backgroundColor = "#ccc" 
                }

                throw BreakException
            }
        })

      } catch (e) {

        if (e !== BreakException) throw e

      }*/
})

function setGame(button) {
    switch (button.innerText) {
        case "Start Match":
            button.innerText = "Start Auton"
            socket.emit('setMatch', document.getElementById("match").value)
            match = true
            break
        case "Start Auton":
            button.innerText = "Start TeleOp"
            document.getElementById("game-state").value = 1
            document.getElementById("game-state-label").value = "auton"
            gameChange(document.getElementById("game-state"))
            socket.emit('start')
            break
        case "Start TeleOp":
            button.innerText = "End Match"
            document.getElementById("game-state").value = 2
            document.getElementById("game-state-label").value = "teleop"
            gameChange(document.getElementById("game-state"))
            break
        case "End Match":
            button.innerText = "Start Match"
            document.getElementById("game-state").value = 0
            document.getElementById("game-state-label").value = "pregame"
            match = false
            gameChange(document.getElementById("game-state"))
            break
    }
}

function getGameState(value) {
    switch(value) {
        case "0":
            return "pregame"
        case "1":
            return "auton"
        case "2":
            return "teleop"
    }
}

function blueGameChange() {
    socket.emit('gameChange', 'blue')
}

function redGameChange() {
    socket.emit('gameChange', 'red')
}

function gameChange(slider) {
    socket.emit('gameChange', 'blue', slider.value)
    socket.emit('gameChange', 'red', slider.value)
    switch (slider.value) {
        case "0":
            document.getElementById("start").innerText = "Start Match"
            break
        case "1":
            document.getElementById("start").innerText = "Start TeleOp"
            break
        case "2":
            document.getElementById("start").innerText = "End Match"
            break
    }
}

function getScoreCell(scout, scoreType) {
    let row = document.getElementById(scout)
    let cells = row.getElementsByTagName('*')
    for (let i = 0; i < cells.length; ++i) {
        if (cells[i].id == scoreType) {
            return cells[i]
        }
    }
}