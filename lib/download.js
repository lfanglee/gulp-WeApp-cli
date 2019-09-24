const download = require('download-git-repo');
const path = require('path');
const ora = require('ora');

const GIT_REPO_URL = 'https://github.com:kindboy/gulp-WeApp-boilerplate#template-for-cli';

module.exports = function (target) {
    target = path.join(target || '.', '.download-temp');
    return new Promise((resolve, reject) => {
        const spinner = ora('Downloading template...');
        spinner.start();
        download(GIT_REPO_URL, target, {
            clone: true
        }, err => {
            if (err) {
                spinner.fail();
                reject(err);
            } else {
                spinner.succeed();
                resolve(target);
            }
        });
    });
};