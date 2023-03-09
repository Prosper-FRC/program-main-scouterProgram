class Script {
    constructor(script) {
        this.script = `<script>` + script + `; window.location.href = "/page_location";</script>`
    }

    toString() {
        return this.script
    }
}

const notification = (text) => {
    return `${new Script("alert(\'" + text + "\')")}`
}

module.exports = {Script, notification}