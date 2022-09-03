/** ****************************************
    Module: Routes
    Description: Load all API endpoints
******************************************* */

// Load libraries
const newspaperRoutes = require('./newspaperRoutes');
const publisherRoutes = require('./publisherRoutes');

module.exports.initRoutes = (app) => {
    app.use('/newspaper', newspaperRoutes);
    app.use('/publisher', publisherRoutes);
};
