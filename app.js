require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mMongoDB = require('./libs/mongodb/index');
const mConfig = require('./src/modules/config');
const constants = require('./src/constants');
const mErrors = require('./src/modules/errors');

// Load configurations
const config = mConfig.getConfig();

// Load connections
mMongoDB.initConnection();

// Declaration of the all routes
const routes = require('./src/rcm/routes');

// Middleware
app.use(helmet({
    noCache: true,
}));
app.use(bodyParser.json({ limit: constants.LIMIT_SIZE_JSON }));
app.use(mErrors.parseError);
app.use(expressValidator({}));
app.use(bodyParser.urlencoded({ limit: constants.LIMIT_SIZE_JSON, extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

routes.initRoutes(app);

app.use(mErrors.pageNotFound); // Handle response 404 for non-existent endpoints
app.use(mErrors.errorHandler); // Handle controlled errors

// Start server listening
server.listen(config.server.port, config.server.internal_ip, () => {
    console.info(`Express listening on port ${config.server.port}`);
});

// Events
process.on('SIGINT', () => {
    process.emit('to_close_connections'); // Closing databases connections
    process.exit(0);
});
