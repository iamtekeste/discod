#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const os = require('os');

function isBrewPresent() {
    return new Promise(function (resolve, reject) {
        exec('hash brew 2>/dev/null', (error, stdout, stderr) => {
            if (error) {
                reject();
                return;
            }

            resolve();
        });
    });
}

function isRipgrepPresent() {
    return new Promise(function (resolve, reject) {
        exec('hash rg 2>/dev/null', (error, stdout, stderr) => {
            if (error) {
                reject();
                return;
            }

            resolve();
        });
    });
}

function logError(message) {
    console.error(chalk.red.bold(message));
}

function onMac() {
    return os.platform() === 'darwin';
}

if (onMac()) {
    isBrewPresent().then(() => {
        isRipgrepPresent().then(() => {
            //do nothing
        }).catch(() => {
            console.log('Installing ripgrep...');
            execSync('brew install ripgrep');
        });
    }).catch(() => {
        logError(`Homebrew doesn't appear to be installed, please install ripgrep before use.`);
    });
} else {
    console.log('Please ensure that ripgrep is installed before use.');
}
