const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const miniMatch = require('minimatch');
const fs = require('fs');
const path = require('path');
const fsExtra = require('./file');

const parseConfFile = (src, meta) => {
    return new Promise((resolve, reject) => {
        fs.readFile(src, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(Handlebars.compile(data.toString())(meta).split('\n').filter(item => {
                if (item.trim().startsWith('#')) {
                    return false;
                }
                return !!item.length;
            }));
        });
    });
};

module.exports = function (metaData = {}, src, dest = '.') {
    if (!src) {
        return Promise.reject(new Error(`无效的sourse: ${src}`));
    }
    return new Promise((resolve, reject) => {
        const templateConfFile = path.join(src, 'template.conf');
        let templateConfFileExist = true;
        try {
            fs.accessSync(templateConfFile);
            templateConfFileExist = true;
        } catch (e) {
            templateConfFileExist = false;
        }
        Metalsmith(process.cwd())
            .metadata(metaData)
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata();
                templateConfFileExist ? parseConfFile(templateConfFile, meta).then(confFiles => {
                    Object.keys(files).map(fileName => {
                        confFiles.map(pattern => {
                            if (miniMatch(fileName, pattern)) {
                                const contents = files[fileName].contents.toString();
                                files[fileName].contents = new Buffer(Handlebars.compile(contents)(meta));
                            }
                        });
                    });
                    done();
                }).catch(err => {
                    reject(err);
                }) : done();
            }).build(err => {
                fsExtra.remove(src); // 正常开放需解除注释
                fsExtra.remove(path.join(dest, 'template.conf'));
                err ? reject(err) : resolve({dest});
            });
    });
};