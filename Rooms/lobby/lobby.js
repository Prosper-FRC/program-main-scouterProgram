function savePassword() {
    localStorage.setItem("password", document.getElementById("password").value)
    return false
}

function loadPassword() {
    document.getElementById("password").value = localStorage.getItem("password")
}

function getScouts() {
    fetch("/scoutdata", {
        method: "POST"
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data)
        scoutData = data
    })
    .catch(function (error) {
        console.log(error)
    })
}

function getBlueSchedule() {
    fetch("/schedule/blue", {
        method: "POST"
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        //console.log(data)
        let order = JSON.parse(data)
        let table = "<table>"
        Object.keys(order["schedule"]).forEach(function(key) {
            table += "<tr><td>" + key + "</td>"
            for (let name of order["schedule"][key]) {
                table += "<td>" + name + "</td>"
            }
            table += "</tr>"
        })
        table += "</table>"
        document.getElementById("blue-schedule").innerHTML = table
    })
    .catch(function (error) {
        console.log(error)
    })
}

function getRedSchedule() {
    fetch("/schedule/red", {
        method: "POST"
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        //console.log(data)
        let order = JSON.parse(data)
        let table = "<table>"
        Object.keys(order["schedule"]).forEach(function(key) {
            table += "<tr><td>" + key + "</td>"
            for (let name of order["schedule"][key]) {
                table += "<td>" + name + "</td>"
            }
            table += "</tr>"
        })
        table += "</table>"
        document.getElementById("red-schedule").innerHTML = table
    })
    .catch(function (error) {
        console.log(error)
    })
}

function getSchedule() {
    getBlueSchedule()
    getRedSchedule()
    loadPassword()
}

function reveal() {
    let blueSched = document.getElementById("blue-schedule")
    let redSched = document.getElementById("red-schedule")
    if (blueSched.style.display === "none") {
        blueSched.style.display = "inline-block"
    } else {
        blueSched.style.display = "none"
    }
    if (redSched.style.display === "none") {
        redSched.style.display = "inline-block"
    } else {
        redSched.style.display = "none"
    }
    return false
}