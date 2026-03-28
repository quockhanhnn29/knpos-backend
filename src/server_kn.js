const express = require('express')
const http = require('http')
const { graphqlUploadExpress } = require('graphql-upload')
const bodyParser = require('body-parser')
const compression = require('compression')
const Routes = require('./routes')
require('dotenv').config()
const fs = require('fs')
const util = require('util')
const { Server } = require("socket.io");

class App {

    /**
     * 
     * 
     * Sets the properties to be used by this class to create the server
     * 
     */
    constructor() {
        this.expressApp = express()

        //Literal object containing the configurations
        this.configs = {
            get port() {
                return process.env.PORT || 2030
            }
        }
    }

    /**
     * 
     * 
     * Applies any middleware to be used by this app
     * 
     */
    applyMiddleware() {
        //Allows the server to parse json
        this.expressApp.use(bodyParser.json({limit: '50mb'}), graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
        this.expressApp.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        // this.expressApp.use(express.json())
        // this.expressApp.use(express.urlencoded({ extended: true }))
        this.expressApp.use('/downloads', express.static('downloads'))
        this.expressApp.use('/uploads', express.static('uploads'))
        // compress all responses
        this.expressApp.use(compression())
        //Registers the routes used by the app
        new Routes(this.expressApp)
    }
    /**
     * 
     * 
     * Runs the app
     * 
     */
    run() {
        
        const log_file = fs.createWriteStream('debug.log', {flags : 'a'});
        const log_stdout = process.stdout;

        console.log = function(d) { //
            log_file.write(new Date().toISOString() + ': ' + util.format(d) + '\n');
            log_stdout.write(new Date().toISOString() + ': ' + util.format(d) + '\n');
        };

        this.http_server = http.createServer(this.expressApp).listen(this.configs.port, '0.0.0.0', () => {
            console.log(`🚀 The server is running on http://localhost:${this.configs.port}/api`)
            console.log(`Environment: ${process.env.STAGE || "development"}`)
        })

        const io = new Server(this.http_server, {
            cors: {
                origin: '*',
            }
        });

        global._io = io;

        io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                console.log('user disconnected')
            });
            
            socket.on('get-guest-detail',  msg  =>  {
                _io.emit('get-guest-detail',  msg)
            })
        });
    }
}

//Runs the thing
const app = new App()
app.applyMiddleware()
app.run()
