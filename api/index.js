require('dotenv').config();
const app = require('./app');

class Server {
    constructor(app) {
        this.app = app;
        this.port = process.env.PORT || 5000;
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port} (OOP Server)`);
        });
    }
}

const server = new Server(app);
server.start();