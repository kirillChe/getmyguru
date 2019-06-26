const Op = require('sequelize').Op;
const R = require('ramda');
const moment = require('moment');
const {User, UserInfo, UserLanguage, File} = require('../../models');

function getBaseSearchFilter (filter, rawFilters) {
    filter.where = R.merge(
        filter.where,
        {
            [Op.or]: [
                {
                    firstName: {
                        [Op.in]: rawFilters.baseSearch
                    }
                },
                {
                    lastName: {
                        [Op.in]: rawFilters.baseSearch
                    }
                }
            ]
        },
    );
    return filter;
}

function getCustomSearchFilter(filter, rawFilters) {
    // declare supported filters
    let userWhereFilter = {};
    let userInfoWhereFilter = {};
    let userLanguageWhereFilter = {};

    // get supported filter keys
    let userKeys = R.keys(User.rawAttributes);
    let userInfoKeys = R.keys(UserInfo.rawAttributes);

    // just filling the correct model filter by filter key
    let fillCorrectModel = (val, key) => {
        R.contains(key, userKeys) ?
            userWhereFilter[key] = val :
            R.contains(key, userInfoKeys) ?
                userInfoWhereFilter[key] = val :
                key === 'languages' ?
                    userLanguageWhereFilter.code = val :
                    null;
    };

    // iterate all raw filters and fill the correct filter value
    R.forEachObjIndexed((val, key) => {
        if (Array.isArray(val)) {
            if (key === 'age') {
                userWhereFilter.birthDate = {
                    [Op.between]: [
                        /**
                         * Why last is first?
                         * [20, 40]
                         * last => 1979-06-24
                         * first => 1999-06-24
                         */
                        moment().startOf('day').subtract(R.last(val), 'years'),
                        moment().startOf('day').subtract(R.head(val), 'years')
                    ]
                };
            } else if (key === 'rating') {
                userWhereFilter.rating = {
                    // multiply by 10 because like that rating is saved in DB
                    [Op.between]: R.map(R.multiply(10), val)
                };
            } else {
                fillCorrectModel({[Op.in]: val}, key);
            }
        } else if (key === 'withPhotoOnly') {
            userWhereFilter.avatar = {[Op.ne]: null};
        } else if (R.contains(key, ['competitiveExperience', 'education'])) {
            /**
             * these fields have string type, so if field is required
             * just check that it is not null
             * Empty string is equal not empty field
             */
            userInfoWhereFilter[key] = {[Op.ne]: null};
        } else {
            fillCorrectModel(val, key);
        }
    }, rawFilters);

    filter.where = R.merge(
        userWhereFilter,
        filter.where
    );
    filter.include.push(
        {
            model: UserInfo,
            as: 'info',
            where: userInfoWhereFilter
        },
        {
            model: UserLanguage,
            as: 'languages',
            where: userLanguageWhereFilter
        }
    );
    return filter;
}

const prepareGuruFilter = ({filter, rawFilters}) => {
    filter.where = {
        userType: 'guru'
    };

    filter.include = [{
        model: File,
        as: 'files',
        where: {
            id: {
                [Op.col]: 'User.avatar'
            }
        },
        required: false
    }];

    //if action wasn't called with custom filters
    if (!rawFilters)
        return filter;

    try{
        rawFilters = JSON.parse(rawFilters);
    }catch (e) {
        throw e;
    }

    //free search by firstName/lastName/Country
    if (rawFilters.baseSearch)
        return getBaseSearchFilter(filter, rawFilters);

    //search with custom filters
    return getCustomSearchFilter(filter, rawFilters);
};

module.exports = {
    prepareGuruFilter
};
