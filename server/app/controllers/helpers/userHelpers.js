const Op = require('sequelize').Op
    , R = require('ramda')
    , moment = require('moment')
    , request = require('request-promise')
    , jwt = require('jsonwebtoken')
    , nodemailer = require('nodemailer')
    , {User, UserInfo, UserLanguage, File} = require('../../models')
    , {recaptcha, mailer, port} = require('../../../config/config.json')
    , transporter = nodemailer.createTransport(mailer);

const updateUserWithAssociations = async ({user, userData}) => {
    console.dir(userData, {colors: true, depth: 3});
    // declare supported models
    let userProps = {};
    let userInfoProps = {};
    let userLanguageProps = [];

    // get supported models keys
    let userKeys = R.keys(User.rawAttributes);
    let userInfoKeys = R.keys(UserInfo.rawAttributes);

    // iterate all userData and fill the correct model
    R.forEachObjIndexed((val, key) => {
        R.contains(key, userKeys) ?
            userProps[key] = val :
            R.contains(key, userInfoKeys) ?
                userInfoProps[key] = val :
                key === 'languages' ?
                    userLanguageProps = R.map(v => ({userId: user.id, code: v}), val) :
                    null;
    }, userData);

    //remove all existing languages of current user
    await UserLanguage.destroy({where: { userId: user.id }});

    //create new languages of current user
    await UserLanguage.bulkCreate(userLanguageProps);

    //update userInfo
    await UserInfo.update(userInfoProps, {where: { userId: user.id }});

    //update user
    await user.update(userProps);
};

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

const verifyCaptcha = async ({req}) => {
    return await request({
        uri: recaptcha.uri,
        method: 'POST',
        json: true,
        qs: {
            secret: recaptcha.secretKey,
            response: req.body.captcha,
            remoteip: req.connection.remoteAddress
        }
    });
};

const sendConfirmationEmail = async ({user, req}) => {
    let token = jwt.sign({}, user.password, {
        algorithm: 'HS256',
        subject: '' + user.id,
        // 12 hours
        expiresIn: 60 * 60 * 12
    });

    //@todo move host/port to config
    let url = `http://${req.host}:${port}/confirm`;
    let confirmEmailLink = `${url}/${token}`;

    return await transporter.sendMail({
        from: 'Info <info@getmyguru.online>', // sender address
        to: user.email, // list of receivers
        subject: `Hello, ${user.firstName} ${user.lastName}!`, // Subject line
        text: `Click to confirm your email ${confirmEmailLink}`
        // html: "<b>Hello world?</b>" // html body
    });
};

const getUserIdFromToken = async ({token}) => {
    let decoded = jwt.decode(token, {complete: true});
    return decoded.payload.sub;
};

module.exports = {
    updateUserWithAssociations,
    prepareGuruFilter,
    verifyCaptcha,
    sendConfirmationEmail,
    getUserIdFromToken
};
