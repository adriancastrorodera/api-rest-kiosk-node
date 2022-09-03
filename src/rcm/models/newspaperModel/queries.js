const constants = require('../../../constants');

module.exports.NEWSPAPER_LOOKUP = {
    $lookup:
    {
        from: constants.PUBLISHER_COLLECTION_NAME,
        localField: 'publisherId',
        foreignField: 'id',
        as: 'publisher',
    },
};
module.exports.NEWSPAPER_UNWIND = {
    $unwind: {
        path: '$publisher',
    },
};
