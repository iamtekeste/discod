#!/usr/bin/env node

'use strict';

const fs = require('fs');
const readline = require('readline');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const chalk = require('chalk');

let config = {
    'branchesTxtPath': `${process.env['HOME']}/.detective/branches.txt`,
    'branches': [],
    'currentBranch': '',
    'searchTerm': 'awesome',
    'fileExtension': ''
};

function init() {
    //do check up before running
    let goodToGo = doCheckup();
    if (goodToGo) {
        //parse branches.txt
        parseBranchesTxt();
    }
}

function doCheckup() {
	//check that we have a searchterm in the config and does not contain a space
    //check that branches.txt exists & we have at least one branch in in it
    //check that they have supplied a searchTerm
    //check that it is a git repo
    //check that the repo is not dirty, if it is do a stash?
    //check that we have a remote setup
    return true;
}

function parseBranchesTxt() {
    let rl = readline.createInterface({
        input: fs.createReadStream(config.branchesTxtPath)
    });

    rl.on('line', (line) => {
        line = line.trim();
        if (line.length > 0)
            config.branches.push(line);
    });

    //call cb after the last line is read
    rl.on('close', () => {
    	rl = null;
    	doGitFetch();
    });
}

function doGitFetch() {
    try {
    	execSync('git fetch');
    	doGitCheckout();
    } catch( e ) {
    	console.log(e);
    }
}

function doGitCheckout() {

    for (let i = 0; i < config.branches.length; i++) {
        try {
	        let result = execSync(`git checkout ${config.branches[i]}`);
	        config.currentBranch = config.branches[i];
	        doSearch();
        } catch( e ) {
        	console.log(chalk.bgRed('Checkout Exception', e.message.trim()));
			console.log('=======================================================================================');
        }

    }
}

function doSearch() {
	let formattedSearchTerm = chalk.bgBlue.black(config.searchTerm);
	let formattedCurrentBranch = chalk.bgWhite.black(config.currentBranch);

	console.log(`Searching for ${formattedSearchTerm} in branch ${formattedCurrentBranch}`);
	try {
		let searchResult = execSync(`ag ${config.searchTerm}`);
		displaySearchResult(searchResult.toString());
	} catch(e) {
		console.log(chalk.bgRed(`Could not find '${config.searchTerm}' in the branch ${config.currentBranch}`));
		console.log('=======================================================================================');
	}
}

function displaySearchResult(searchResult) {
	let lines = searchResult.trim().split("\n");
	console.log(chalk.bgYellow.black('Search results'));
	lines.forEach( line => {
		let fileName = chalk.green.bold(line.split(":")[0]);
		let lineNumber = chalk.yellow.bold(line.split(":")[1]);
		console.log(`${fileName} : ${lineNumber}`);
	});
}
init();