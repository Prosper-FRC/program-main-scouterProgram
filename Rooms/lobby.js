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