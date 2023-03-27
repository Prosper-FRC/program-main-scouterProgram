let password = document.getElementById("password")

let schedule = {
    "blue": document.getElementById("blue-schedule"),
    "red": document.getElementById("red-schedule")
}

let deck = {
    "blue": document.getElementById("blue-deck"),
    "red": document.getElementById("red-deck")
}

const savePassword = () => 
{
    localStorage.setItem("password", password.value)
    return false
}

const loadPassword = () => 
{
    password.value = localStorage.getItem("password")
}

const getBlueSchedule = () => {
    fetch("/schedule/blue", 
    {
        method: "POST"
    })
    .then((response) => 
    {
        return response.json()
    })
    .then((data) =>  
    {
        schedule.blue.innerHTML = data
    })
}

const getRedSchedule = () => {
    fetch("/schedule/red", 
    {
        method: "POST"
    })
    .then((response) => 
    {
        return response.json()
    })
    .then((data) =>  
    {
        schedule.red.innerHTML = data
    })
}

const getBlueOndeck = () => {
    fetch("/ondeck/blue", 
    {
        method: "POST"
    })
    .then((response) => 
    {
        return response.json()
    })
    .then((data) =>  
    {
        deck.blue.innerHTML = data
    })
}

const getRedOndeck = () => {
    fetch("/ondeck/red", 
    {
        method: "POST"
    })
    .then((response) => 
    {
        return response.json()
    })
    .then((data) =>  
    {
        deck.red.innerHTML = data
    })
}

const getSchedule = () => 
{
    getBlueSchedule()
    getRedSchedule()
    loadPassword()
    getBlueOndeck()
    getRedOndeck()
}

const reveal = () => {
    if (schedule.blue.style.display === "none") {
        schedule.blue.style.display = "inline-block"
    } else {
        schedule.blue.style.display = "none"
    }
    if (schedule.red.style.display === "none") {
        schedule.red.style.display = "inline-block"
    } else {
        schedule.red.style.display = "none"
    }
    return false
}