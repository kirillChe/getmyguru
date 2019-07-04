const Rating = require('../models').Rating;

const create = async (req, res) => {
    try {
        let rating = await Rating.create(req.body);
        res.status(201).json(rating);
    }catch (error) {
        res.status(502).send({
            message: 'Some error occurred while creating a rating',
            meta: {
                data: req.body,
                error
            }
        });
    }
};

module.exports = {
    create
};
