const socket = io.connect("http://localhost:80")
//const socket = io.connect("http://localhost:5500")

let clientBalls = {}
let scoutData = {}

let canvas = document.getElementById("canvas")

let image = new Image()
let field
let grid

let scoreItems = {

    "blueAllianceScore": document.getElementById("B-point"),
    "redAllianceScore": document.getElementById("A-point"),
    "autonAmpCount": document.getElementById("autonAmpCount"),
    "autonAmpScore": document.getElementById("autonAmpScore"),
    "autonSpeakerCount": document.getElementById("autonSpeakerCount"),
    "autonSpeakerScore": document.getElementById("autonSpeakerScore"),
    "autonTrapCount": document.getElementById("autonTrapCount"),
    "autonTrapScore": document.getElementById("autonTrapScore"),
    "teleopAmpCount": document.getElementById("teleopAmpCount"),
    "teleopAmpScore": document.getElementById("teleopAmpScore"),
    "teleopSpeakerCount": document.getElementById("teleopSpeakerCount"),
    "teleopSpeakerScore": document.getElementById("teleopSpeakerScore"),
    "teleopTrapCount": document.getElementById("teleopTrapCount"),
    "teleopTrapScore": document.getElementById("teleopTrapScore"),

    "autonScore": document.getElementById("auton"),
    "teleopScore": document.getElementById("telop"),
    "totalScore": document.getElementById("total"),
    "teleopParking": document.getElementById("telopParking")
}


function gameChange() {
    socket.emit("gameChange")
}

socket.on("connect", () => {
    socket.emit("newScouter")
})

socket.on("AssignRobot", (team) => {
    if (!Object.keys(scoutData).length) {
        scoutData = team
    }
    document.getElementById("number-display").style.backgroundColor = rgb(
        team.markerColor.red,
        team.markerColor.green,
        team.markerColor.blue
    )
    document.getElementById("team-number").textContent = team.teamNumber
})

socket.on("drawfield", (gameField, gameGrid) => {
    //alert(gameField.bg)
    image.src = gameField.bg

    canvas.width = gameField.width
    canvas.height = gameField.height

    field = new Field(canvas, image, gameField.width, gameField.height)
    grid = new Grid(
        canvas,
        gameGrid.width,
        gameGrid.height,
        gameGrid.boxWidth,
        gameGrid.boxHeight
    )

    image.onload = () => {
        field.draw()
        grid.draw()
    }
})

socket.on("placeMarker", (marker) => {
    if (marker.isSingleSpace == "true" && marker.isMarkedOnce == "true")
        grid.drawImage(marker)
    else if (marker.isSingleSpace == "false" && marker.isMarkedOnce == "false")
        grid.drawFlash(marker)
    else
        grid.placeMarker(
            marker.x,
            marker.y,
            marker.markerColor,
            marker.gameState
        )
})

socket.on("rotate", (rotation) => {
    canvas.style.transform = rotation
})

socket.on("clear", () => {
    field.clear()
    field.draw()
    grid.draw()
})

socket.on("draw", (markers) => {
    for (let index in markers) {

        let marker = markers[index]
        
        if (marker.isSingleSpace == "true" && marker.isMarkedOnce == "true")
            grid.drawImage(marker)
        else if (marker.isSingleSpace == "false" && marker.isMarkedOnce == "false")
            grid.drawFlash(marker)
        else
            grid.placeMarker(
                marker.x,
                marker.y,
                marker.markerColor,
                marker.gameState
            )
    }
})

socket.on("gameOver", () => {
    document.getElementById("session-handler").submit()
})

socket.on("getRobot", (robots) => {})
