const express = require("express");
const app = express();
const dotenv = require("dotenv");
import mqtt from "./config/mqtt";
const cors = require("cors");
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require("body-parser"),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");


dotenv.config();
const PORT = process.env.PORT || 5000;
// Create router
const route = require("./routes");
const db = require("./config/db");
app.use(cors({
    origin: "*",
}))
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
const server = http.createServer(app);
export const io = socketIO(server,  { cors: {
    origin: "*"
} });

// Connect to DB
db.connect();
// Connect to MQTT Broker
mqtt.mqttconnect();
// Route init
route(app);

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/auth/login`));
