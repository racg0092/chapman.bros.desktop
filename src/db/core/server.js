const MongoClient = require('mongodb').MongoClient;
const { dialog } = require('electron');

class Server {

    constructor(username, password) {
        this.uri = `mongodb+srv://${username}:${password}@questuniversal-ukowr.mongodb.net/test?retryWrites=true&w=majority`
        this.server = new MongoClient(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    connect() {
        const that = this;
        return (async ()=>{
            that.server = await that.server.connect()
                .catch(e => dialog.showErrorBox('Unespected Error', e.message))
            return that.server;
        })();
    }

    close() {
        this.server.close();
    }
}


module.exports = Server;