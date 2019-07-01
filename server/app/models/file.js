'use strict';

const Busboy = require('busboy')
    , path = require('path')
    , fs = require('fs')
    , filePath = __dirname + '/../../public'
    , R = require('ramda');

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
    }, {
        indexes: [
            {
                unique: true,
                fields: ['location']
            }
        ]
    });

    File.associate = ({User}) => {
        File.belongsTo(User, {as: 'user'})
    };

    File.beforeDestroy(file => {
        let filename = R.replace('/api/public/', '', file.location);
        fs.unlink(path.join(filePath, filename), err => {
            if (err)
                throw new Error('Failed to delete file: ', err);
        });
    });

    File.upload = ctx => {
        let {userId, req, res} = ctx;
        let busboy = new Busboy({headers: req.headers});
        //@todo add image size validation
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            let name = `${userId}-${filename}`;
            let saveTo = path.join(filePath, name);
            file.on('error', (error) => {
                console.log('Upload file failed with error: ', error);
            });
            file.on('end', async () => {
                let data = {
                    userId,
                    location: `/api/public/${name}`
                };
                try{
                    let file = await File.upsert(data);
                    console.log('File model is created successfully: fileId: ', file);
                }catch (e) {
                    console.log('Failed to create file model: ', e);
                    fs.unlinkSync(saveTo);
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