/* eslint-disable no-underscore-dangle  */
const mongoose = require('mongoose');

const publisher = require('./collection_db/publisher.js');
const newspaper = require('./collection_db/newspaper.js');

async function check(db, collectionName, items) {
    const response = await db.collection(collectionName).find({}).toArray();
    if (response.length === 0) {
        await db.collection(collectionName).insertMany(items);
    }
}

module.exports.connect = async () => mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

module.exports.disconnect = async () => {
    await mongoose.connection.close();
};

// Called once in the setup before all test
module.exports.load = async () => {
    let db;
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        ({ db } = mongoose.connection);

        await check(db, 'publisher', publisher);
        await check(db, 'newspaper', newspaper);
        await mongoose.connection.close(() => {});
    } catch (e) {
        console.error(e); /* eslint-disable-line no-console */
    }
};
