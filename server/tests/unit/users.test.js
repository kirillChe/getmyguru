const should = require('chai').should();
const app = require('../../app');
const request = require('supertest');

// wait till app is started
before(function (done) {
    if (app.started)
        return done();
    app.once('started', done);
});


// let wpmsCtx = {
//     requester: {
//         id: 12345,
//         type: 'user',
//         ip: '127.0.0.1'
//     },
//     scope: {
//         resellerId: 'webs',
//         accountId: 1000,
//         siteId: 9999
//     }
// };


describe('Test user CRUD APIs', function () {

    let userId;

    it('(POST /users) - create user', function (done) {

        request(app)
            .post('/users')
            // .set('x-wpms-ctx', JSON.stringify(wpmsCtx))
            .send({
                firstName: 'Test',
                lastName: 'Test',
                userType: 'adept',
                nickname: 'test',
                email: 'test@yopmail.com',
                password: 'qwerty12345',
                phone: '+9721111111',
                age: 30
            })
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                let item = {};
                should.not.throw(function () {
                    item = JSON.parse(res.text);
                }, 'response is not a JSON');
                item.should.be.an('object');
                item.should.include.keys(['id']);
                userId = item.id;

                done();
            });

    });

    it('(GET /users) - list users', function (done) {

        request(app)
            .get('/users')
            // .set('x-wpms-ctx', JSON.stringify(wpmsCtx))
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                let items = {};
                should.not.throw(function () {
                    items = JSON.parse(res.text);
                }, 'response is not a JSON');
                items.should.be.an('array');
                items.length.should.be.above(0);

                done();
            });

    });

    it('(GET /users/:id) - find user by id', function (done) {
        console.log('users.test.js :92', userId);

        if (!userId)
            return this.skip();

        request(app)
            .get(`/users/${userId}`)
            // .set('x-wpms-ctx', JSON.stringify(wpmsCtx))
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                let item = {};
                should.not.throw(function () {
                    item = JSON.parse(res.text);
                }, 'response is not a JSON');
                item.should.be.an('object');
                item.id.should.equal(userId);
                // item.should.include.keys(['id', 'name', 'templateId']);
                // item.name.should.equal('My Cool Site');
                // item.templateId.should.equal(1);

                done();
            });

    });

    it('(PUT /users/:id) - update user', function (done) {

        if (!userId)
            return this.skip();

        request(app)
            .put(`/users/${userId}`)
            // .set('x-wpms-ctx', JSON.stringify(wpmsCtx))
            .send({
                firstName: 'Test Huest'
            })
            .expect(204)
            .end(done);

    });

    it('(DELETE /users/:id) - delete user', function (done) {

        if (!userId)
            return this.skip();

        request(app)
            .delete(`/users/${userId}`)
            // .set('x-wpms-ctx', JSON.stringify(wpmsCtx))
            .send()
            .expect(204)
            .end(done);
    });
});
