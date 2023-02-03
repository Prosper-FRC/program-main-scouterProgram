class Field {
    constructor(bg, width, height) {
        this.bg = bg
        this.width = width
        this.height = height
    }
    draw() {
        ctx.drawImage(this.bg, 0, 0, this.width, this.height)
    }
    clear() {
        ctx.clearRect(0, 0, this.width, this.height)
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
    }
    draw() {
        ctx.beginPath()
        for (let x = 1; x < this.gridWidth; x++) {
            ctx.moveTo(x * this.boxWidth, 0)
            ctx.lineTo(x * this.boxWidth, this.height)
        }
        for (let y = 1; y < this.gridHeight; y++) {
            ctx.moveTo(0, y * this.boxHeight)
            ctx.lineTo(this.width, y * this.boxHeight)
        }
        ctx.stroke()
    }
    getMousePosition(event) {
        return {
            x: Math.floor(event.offsetX / this.boxWidth),
            y: Math.floor(event.offsetY / this.boxHeight)
        }
    }
    placeMarker(x, y, markerColor) {
        ctx.fillStyle = 'rgba(' + markerColor.red + ',' + markerColor.green + ',' + markerColor.blue + ',' + markerColor.alpha +')'
        ctx.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight)
    }
}