/**
 * Get system config.
 * @returns Config
 */
module.exports.getConfig = () => ({
    server: {
        internal_ip: process.env.INTERNAL_IP,
        port: process.env.INTERNAL_PORT,
    },
    interface_to_connect: {
        mongodb: {
            host: process.env.MONGODB_HOST,
            port: process.env.MONGODB_PORT,
            database: process.env.MONGODB_DBNAME,
        },
    },
});
