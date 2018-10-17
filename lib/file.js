const fs = require('fs');
const path = require('path');

class File {
    constructor() {
        this.copy = this._copyFolder.bind(this);
        this.remove = this._removeDir.bind(this);
    }
    _copyFile(src, target) {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(src);

            stream.on('error', err => {
                reject(err);
            });

            stream.on('close', err => {
                resolve();
            });

            stream.pipe(fs.createWriteStream(target));
        });
    }
    _isDir(src) {
        return new Promise((resolve, reject) => {
            fs.stat(src, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                stats.isDirectory() ? resolve(true) : resolve(false);
            });
        });
    }
    _isSrcExist(src) {
        return new Promise((resolve, reject) => {
            fs.access(src, fs.constants.F_OK, err => {
                err ? resolve(false) : resolve(true);
            });
        });
    }
    _copyFolder(src, target) {
        return new Promise((resolve, reject) => {
            this._isDir(src).then(isDir => {
                if (!isDir) {
                    this._copyFile(src, target).then(() => {
                        resolve();
                    }, err => {
                        reject(err);
                    });
                } else {
                    this._isSrcExist(target).then(exist => {
                        !exist && fs.mkdirSync(target);
                        fs.readdir(src, (err, files) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            Promise.all(files.map(file => {
                                const srcPath = path.join(src, file);
                                const targetPath = path.join(target, file);
                                return this._copyFolder(srcPath, targetPath);
                            })).then(() => {
                                resolve();
                            }, err => {
                                reject(err);
                            });
                        });
                    });
                }
            }, err => {
                reject(err);
            });
        });
    };
    _removeDir(src){
        return new Promise((resolve, reject) => {
            this._isDir(src).then(isDir => {
                if (!isDir) {
                    fs.unlink(src, resolve);
                } else {
                    fs.readdir(src, (err, files) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        Promise.all(files.map(file => {
                            return this._removeDir(path.join(src, file));
                        })).then(() => {
                            fs.rmdir(src, resolve);
                        }, err => {
                            reject(err);
                        });
                    });
                }
            }, err => {
                reject(err);
            });
        });
    }
}
module.exports = new File();
