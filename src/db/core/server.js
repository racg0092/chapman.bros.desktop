const MongoClient = require('mongodb').MongoClient;
const { dialog } = require('electron');

class Server {

    constructor(username, password) {
        const devAtlas = `mongodb+srv://${username}:${password}@questuniversal-ukowr.mongodb.net/test?retryWrites=true&w=majority`;
        const local = `mongodb://universal-rw:local-access@localhost:28011/?authSource=admin&replicaSet=quest-repl&readPreference=primary`;
        const connection = false ?
            devAtlas :
            local;
        this.uri = connection
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