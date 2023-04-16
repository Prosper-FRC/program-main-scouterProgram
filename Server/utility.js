class Script 
{
    constructor(script) 
    {
        this.script = `<script>` + script + `; window.location.href = "/page_location";</script>`
    }

    toString() 
    {
        return this.script
    }
}

const notification = (text) => {
    return `${new Script("alert(\'" + text + "\')")}`
}

class JsonTable
{
    constructor(...args)
    {
        this.obj = args[0]
        this.id = args[1]
        this.table = "<table id='" + this.id + "'>"
        Object.keys(this.obj).forEach((key) => 
        {
            this.table += "<tr><td>" + key + "</td>"
            for (let cell of this.obj[key]) 
            {
                this.table += "<td>" + cell + "</td>"
            }
            this.table += "</tr>"
        })
        this.table += "</table>"
    }

    html()
    {
        return this.table
    }

    json() 
    {
        return (JSON.stringify(this.table)).slice(1, -1)
    }
}

class DynamicJsonTable extends JsonTable
{
    constructor(...args)
    {
        super(...args)
        this.table = "<table id='" + this.id + "'>"
        Object.keys(this.obj).forEach((key) => 
        {
            this.table += "<tr><td>" + key + "</td>"
            for (let cell of this.obj[key]) 
            {
                this.table += "<td><input value='" + cell + "'></td>"
            }
            this.table += "</tr>"
        })
        this.table += "</table>"
    }
}

module.exports = {Script, notification, JsonTable, DynamicJsonTable}