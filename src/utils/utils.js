const moment = require('moment');
const randomWords = require('random-words');
const {
    PUBLISHER_EXAMPLE_NAMES, PUBLISHER_EXAMPLE_SURNAME, WORDS,
} = require('../constants');

const getRandomItemFromArray = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1) + from);

module.exports.getPublisherExamples = (from, to) => {
    const publishers = [];
    for (let i = from; i <= to; i += 1) {
        publishers.push({
            id: i,
            name: `${getRandomItemFromArray(PUBLISHER_EXAMPLE_NAMES)} ${getRandomItemFromArray(PUBLISHER_EXAMPLE_SURNAME)} ${getRandomItemFromArray(PUBLISHER_EXAMPLE_SURNAME)}`,
            joined_date: moment().toISOString(),
        });
    }
    return publishers;
};

module.exports.getNewspaperExamples = (from, to) => {
    const newspapers = [];
    for (let i = from; i <= to; i += 1) {
        const base = getRandomItemFromArray(WORDS);
        newspapers.push({
            id: i,
            title: `${base} ${getRandomItemFromArray(WORDS)} ${getRandomItemFromArray(WORDS)}`,
            image: `public/image/${base}.png`,
            link: `https://www.britannica.com/${base}`,
            abstract: randomWords(50).toString().replace(/,/g, ' '),
            publisherId: getRandomNumber(from, to),
            languages: ['en', 'es', 'fr'],
            creation_date: moment().toISOString(),
        });
    }
    return newspapers;
};
