'use strict';

const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const on = require('await-handler');
const filePath = __dirname + '/../../public';

module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
        location: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {});

    File.associate = ({User}) => {
        File.belongsTo(User, {as: 'user'})
    };

    File.beforeDestroy(file => {
        fs.unlink(filePath + file.location, err => {
            if (err)
                throw new Error('Failed to delete file: ', err);
        });
    });

    File.upload = function (ctx, cb) {
        let {userId, req, res} = ctx;
        let busboy = new Busboy({headers: req.headers});
        //@todo add image size validation
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            let date = Date.now();
            let name = `${userId}-${date}`;
            let saveTo = path.join(filePath, name);
            file.on('error', (error) => {
                console.log('Upload file failed with error: ', error);
            });
            file.on('end', async () => {
                let data = {
                    userId,
                    location: `/api/public/${name}`
                };
                let [err, file] = await on(File.create(data));
                if (err) {
                    console.log('Failed to create file model: ', err);
                    fs.unlinkSync(saveTo);
                } else {
                    console.log('File model is created successfully: fileId: ', file.id);
                }
            });
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('error', function (error) {
            console.log('Upload failed: ', error);
        });
        busboy.on('finish', function () {
            console.log('Upload complete');
            res.writeHead(200, {'Connection': 'close'});
            res.end("That's all folks!");
        });
        return req.pipe(busboy);
    };

    return File;
};