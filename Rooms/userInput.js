class Field {
    constructor(bg, width, height) {
        this.bg = bg
        this.width = width
        this.height = height
        //this.canvas = document.getElementById("canvas")
        //this.ctx = this.canvas.getContext('2d')
    }
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    draw() {
        this.ctx.drawImage(this.bg, 0, 0, this.width, this.height)
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}
class Grid {
    constructor(width, height, boxWidth, boxHeight) {
        this.width = width
        this.height = height
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        this.gridWidth = (width / boxWidth)
        this.gridHeight = (height / boxHeight)
        //this.canvas = document.getElementById("canvas")
        //this.ctx = this.canvas.getContext('2d')
    }
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    draw() {
        this.ctx.beginPath()
        for (let x = 1; x < this.gridWidth; x++) {
            this.ctx.moveTo(x * this.boxWidth, 0)
            this.ctx.lineTo(x * this.boxWidth, this.height)
        }
        for (let y = 1; y < this.gridHeight; y++) {
            this.ctx.moveTo(0, y * this.boxHeight)
            this.ctx.lineTo(this.width, y * this.boxHeight)
        }
        this.ctx.stroke()
    }
    getMousePosition(event) {
        return {
            x: Math.floor(event.offsetX / this.boxWidth),
            y: Math.floor(event.offsetY / this.boxHeight)
        }
    }
    placeMarker(x, y, markerColor) {
        this.ctx.fillStyle = 'rgba(' + markerColor.red + ',' + markerColor.green + ',' + markerColor.blue + ',' + markerColor.alpha +')'
        this.ctx.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight)
    }
    drawLink(x, y) {
        this.ctx.strokeRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight * 3)
    }
}
class ScoreBoard {
    constructor() {
        this.redAllianceScore = 0;
        this.blueAllianceScore = 0;
        this.redAllianceLinks = 0;
        this.blueAllianceLinks = 0;
        this.redAllianceAutonScore = 0;
        this.blueAllianceAutonScore = 0;
        this.redAllianceTelopScore = 0;
        this.blueAllianceTelopScore = 0;
        this.redCoopScore = 0;
        this.blueCoopScore = 0;
    }
    //functions to update the scoreboard table
    //if the table is being changed, remember to update the ID's of the tables and cells appropriately
    displayRedScore() {
        document.getElementById("redTotalScore").rows[0].cells.namedItem("redScore").innerHTML = this.redAllianceScore
    }
    displayBlueScore() {
        document.getElementById("blueTotalScore").rows[0].cells.namedItem("blueScore").innerHTML = this.blueAllianceScore
    }
    displayRedLinks() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redLinks").innerHTML = this.redAllianceLinks
    }
    displayBlueLinks() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueLinks").innerHTML = this.blueAllianceLinks
    }
    displayRedAuton() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redAuton").innerHTML = this.redAllianceAutonScore
    }
    displayBlueAuton() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueAuton").innerHTML = this.blueAllianceAutonScore
    }
    displayRedTelop() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redTeleop").innerHTML = this.redAllianceTelopScore
    }
    displayBlueTelop() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueTeleop").innerHTML = this.blueAllianceTelopScore
    }
    displayRedCoop() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redCoop").innerHTML = this.redCoopScore
    }
    displayBlueCoop() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueCoop").innerHTML = this.blueCoopScore
    }
}