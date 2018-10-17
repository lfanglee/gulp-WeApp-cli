#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

program
    .version('1.0.0')
    .usage('init [project name]')
    .description('create a new project powered by gulp-WeApp-cli');

program
    .command('init', 'create a new project', {isDefault: true})
    ;

program.parse(process.argv);


const makeRed = (txt) => {
    return colors.red(txt);
};

if (!process.argv.slice(2).length) {
    program.outputHelp(makeRed);
}
