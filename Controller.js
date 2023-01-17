const { Server } = require("socket.io");

const io = new Server();

io.on("connection", (socket) => 
{
    // nan 
}) 

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
