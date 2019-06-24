const R = require('ramda');
const Op = require('sequelize').Op;

module.exports = () => {

    return (req, res, next) => {
        if (req.method !== 'GET')
            return next();

        if (req.query) {
            let query = req.query;

            query.filter = query.filter ? parseQuery(JSON.parse(query.filter)) : {};

            if (query._sort) {
                let order = R.split(',', query._order);
                let sort = R.split(',', query._sort);
                query.filter.order = [];
                sort.forEach((v, i) => {
                    //query.order should looks like [ ['rating', 'DESC'] ]
                    query.filter.order.push([v, order[i]]);
                });
            }

            query.filter.limit = query._limit ? Number(query._limit) : 25;
            query.filter.offset = query._page && query._limit ? ((query._page - 1) * query._limit) : 0;

            req.query = R.omit(['_limit', '_page', '_sort', '_order'], query);
        }

        next();
    };

    function parseQuery(root) {
        let parsed;
        if (Array.isArray(root)) {
            parsed = [];
            root.forEach((node) => parsed.push(parseQuery(node)));
        } else if (typeof root === 'object') {
            parsed = {};
            let keys = R.keys(root);
            keys.forEach(key => {
                let value = root[key];
                switch (key) {
                    case 'or':
                        key = Op.or;
                        break;
                    case 'in':
                        key = Op.in;
                        break;
                }
                parsed[key] = parseQuery(value);
            });
        } else {
            parsed = root;
        }
        return parsed;
    }
};
