#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const download = require('../lib/download');
const generator = require('../lib/generator');

program
    .usage('<project-name>')
    .option('-t, --test', 'test option')
    .parse(process.argv);

const projectName = program.args[0];
const options = program.opts();

if (!projectName) {
    program.help();
    return;
}

const setProjectRoot = (projectName) => {
    const list = glob.sync('*');
    const rootName = path.basename(process.cwd());

    return new Promise((resolve, reject) => {
        if (list.length) {
            if (list.filter(name => {
                const fileName = path.resolve(process.cwd(), path.join('.', name));
                const isDir = fs.statSync(fileName).isDirectory();
                return name.indexOf(projectName) !== -1 && isDir;
            }).length !==0) {
                // reject(new Error(`项目${projectName}已经存在`));
                resolve(projectName); // 调试代码
                return;
            }
            resolve(projectName);
        } else if (rootName === projectName) {
            resolve(inquirer.prompt([{
                name: 'buildInCurrent',
                message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
                type: 'confirm',
                default: true
            }]).then(answer => answer.buildInCurrent ? '.' : projectName));
        } else {
            resolve(projectName);
        }
    });
};

const promptQuestions = (config) => {
    return inquirer.prompt([{
        name: 'projectName',
        message: '项目名',
        default: config.name
    }, {
        name: 'projectVersion',
        message: '版本号',
        default: '1.0.0'
    }, {
        name: 'description',
        message: '项目简述',
        default: 'my WeApp project'
    }]).then(answer => ({
        ...config,
        metaData: {
            ...answer
        }
    })).catch(err => {
        throw err;
    });
};

const init = () => {
    setProjectRoot(projectName).then(projectRoot => {
        // download(projectRoot)
        // 以下为调试代码
        new Promise((resolve, reject) => {
            resolve(path.join(projectRoot, '.download-temp'));
        })
        .then(target => ({
            name: projectName,
            root: projectRoot,
            downloadTemp: target
        }))
        .then(context => {
            return promptQuestions(context).then((context) => {
                return generator(context.metaData, context.downloadTemp, path.parse(context.downloadTemp).dir);
            }).then(res => {
                console.log(logSymbols.success, chalk.green('found success :)'));
            }).catch(err => {
                throw err;
            });
        }).catch(err => {
            throw err;
        });  
    }).catch(err => {
        console.error(logSymbols.error, chalk.red(`found faild：${err.message}`));
    });
}

init();