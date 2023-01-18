const { App } = require("uWebSockets.js");
const { Server } = require("socket.io");

const app = new App();
const io = new Server(3000, { /* options */});


io.on("connection", (socket) => 
{
    // nan 
});

app.listen(3000, (token) => 
{
    if(!token) 
    {
        console.warn("Port Already in use");
    }
});

// get user requests and then send it
// create user data points

function ConeOn()
{
    return null; 
}
function CubeOn()
{
    return null;
}
function Cycle()
{
    return null;
}

class GridInput
{
    constructor(type, color)
    {
        this.type = type;
        this.color = color;
    }
}

// todo 
// get the grid value 
// return the value of the grid and the responce 
// is it blue or red
// return a value based on the grid
// send a image to display on the grid 
