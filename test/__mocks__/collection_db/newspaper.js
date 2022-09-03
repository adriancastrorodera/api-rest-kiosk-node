const { ObjectId } = require('mongodb');

module.exports = [
    {
        _id: ObjectId('5fe98e824a0d6b1e670c4cd6'),
        id: 1,
        title: 'La Sombra del Viento.',
        image: 'https://images-na.ssl-images-amazon.com/images/I/81wLkU+opPL.jpg',
        link: 'https://www.amazon.es/Sombra-Viento-Biblioteca-Carlos-Zaf%C3%B3n',
        abstract: 'Un amanecer de 1945, un muchacho es conducido por su padre a un misterioso lugar oculto en el corazón de la ciudad vieja: el Cementerio de los Libros Olvidados. Allí, Daniel Sempere encuentra un libro maldito que cambia el rumbo de su vida y le arrastra a un laberinto de intrigas y secretos enterrados en el alma oscura de la ciudad. La Sombra del Viento es un misterio literario ambientado en la Barcelona de la primera mitad del siglo xx, desde los últimos esplendores del Modernismo hasta las tinieblas de la posguerra.',
        publisherId: 10,
        languages: ['en', 'es', 'fr'],
        creation_date: '2019-08-05T12:12:44Z',
    },
    {
        _id: ObjectId('5fe98e824a0d6b1e670c4aaa'),
        id: 2,
        title: 'Michigan City dispatch.',
        image: 'public/image/michigan.png',
        link: 'https://www.britannica.com/place/Michigan',
        abstract: "Michigan, constituent state of the United States of America. Although by the size of its land Michigan ranks only 22nd of the 50 states, the inclusion of the Great Lakes waters over which it has jurisdiction increases its area considerably, placing it 11th in terms of total area. The capital is Lansing, in south-central Michigan. The state's name is derived from michi-gama, an Ojibwa (Chippewa) word meaning 'large lake.'",
        publisherId: 11,
        languages: ['en', 'es', 'fr', 'de'],
        creation_date: '2019-08-05T12:12:44Z',
    },
];
