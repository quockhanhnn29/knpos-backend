const graphql = require('./graphql')
const jwt = require('express-jwt')
const cors = require('cors')

module.exports = class Routes {
    
    /**
     * Applies the routes to specific paths
     * @param {*} app - The instance of express which will be serving requests.
     */
    constructor(app) {
        //Throws if no instance of express was passed
        if (app == null) throw new Error("You must provide an instance of express")
        const auth = jwt({
            secret: process.env.JWT_SECRET || 'bff5c869-b6bd-47d2-a262-747d3f9402fa',
            credentialsRequired: false
        })
        //Registers the base GraphQLi base endpoint
        app.use(auth)
        app.use(cors())
        app.use(function(req, res, next) {
            var send = res.send;
            res.send = function (string) {
                var body = string instanceof Buffer ? string.toString() : string;
                let bodyObj = JSON.parse(body)
                bodyObj.success = bodyObj.errors ? false: true
                send.call(this, JSON.stringify(bodyObj));
            }
            next();
        });
        app.use(function(err, req, res, next) {
            let isSupperAdmin = req.headers["authorization"] == "Bearer eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMjQ4MTM0NCwiaWF0IjoxNzAyNDgxMzQ0fQ.W4iSp7lul0VO79Wj5W21CsQnFxw__i8MqrkeYYLbPQY";
            if(err.name === 'UnauthorizedError' && !isSupperAdmin) {
              res.status(err.status).send({message:err.message, success: false});
              return;
            }
            var send = res.send;
            res.send = function (string) {
                var body = string instanceof Buffer ? string.toString() : string;
                let bodyObj = JSON.parse(body)
                bodyObj.success = bodyObj.errors ? false: true
                send.call(this, JSON.stringify(bodyObj));
            }
            next();
        });
       
        app.use('/api', graphql)
    }

}
