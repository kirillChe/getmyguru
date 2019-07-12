const {User} = require('../models')
    , utils = require('../utils');

const createUser = async ({req, email, profile}) => {
    const {language, country, userType} = JSON.parse(req.query.state);

    let filter = {
        where: { email },
    };
    let user = await User.findOne(filter);

    if (!user) {
        let userData = {
            email,
            language,
            userType,
            password: utils.randomString(10),
            firstName: profile.name && profile.name.givenName || null,
            lastName: profile.name && profile.name.familyName || null,
            info: {},
            languages: [
                { code: language }
            ]
        };

        // may not be provided for some reason
        if (country)
            userData.info.country = country;

        user = await User.create(userData, {
            include: [
                {
                    association: User.associations.info,
                    as: 'info'
                },
                {
                    association: User.associations.languages,
                    as: 'languages'
                }
            ]
        });
    }

    //transform user instance to plain object
    return user.get({ plain: true });
};

module.exports = {
    createUser
};