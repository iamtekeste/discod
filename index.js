#!/usr/bin/env node

'use strict';

const fs = require('fs');
const readline = require('readline');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const chalk = require('chalk');
const mkdirp = require('mkdirp');

let config = {
    'branchesTxtPath': `${process.env['HOME']}/.discod/branches.txt`,
    'branches': [],
    'currentBranch': '',
    'searchTerm': '',
    'fileExtension': ''
};

function init() {

	setupBranchesTxt();
	let continueToSearch = parseArgs();
	if(continueToSearch === false) {
		return;
	}

    //we are now ready for searching but first we have to do check up
    let goodToGo = doCheckup();
    if (goodToGo) {
        //parse branches.txt
        parseBranchesTxt();
    }
}

function setupBranchesTxt() {
	mkdirp.sync(`${process.env['HOME']}/.discod`);
	execSync(`touch ${config.branchesTxtPath}`);
}

function parseArgs() {
	let continueToSearch = false;
	let firstParam = process.argv[2];
	let secondParam = process.argv[3];

	if(firstParam === undefined) {
		printHelp() ;
	} else {
		if(firstParam === "--edit-list") {
			editBranchesTxt();
		} else {
			//it is a search term then
			config.searchTerm = firstParam;
			continueToSearch = true;
		}
	}

	if(secondParam !== undefined) {
		config.fileExtension = secondParam;
	}
	return continueToSearch;
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

function printHelp() {
	console.log('usage: tk searchTerm [fileExtension]');
}

function editBranchesTxt() {
	execSync(`open ${config.branchesTxtPath}`);
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
    	if(config.branches.length === 0) {
    		console.log(chalk.bgRed.white.bold('You gotta have some branches to search in. Do discod --edit-list to update your branches list.'));
    		return;
    	}
    	doGitFetch();
    });
}

function doGitFetch() {
    try {
    	execSync('git fetch', {stdio: ['ignore', 'ignore', 'ignore']});
    	doGitCheckout();
    } catch( e ) {
    	let errorMessage = getFormattedError(e);
    	console.log(errorMessage);
    }
}

function doGitCheckout() {

    for (let i = 0; i < config.branches.length; i++) {
        try {
        	// console.log('Switching to branch', chalk.bgWhite.bold.black(config.branches[i]));
	        let result = execSync(`git checkout ${config.branches[i]}`, {stdio: ['ignore', 'ignore', 'ignore']});
	        config.currentBranch = config.branches[i];
	        doSearch();
        } catch( e ) {
        	let errorMessage = getFormattedError(e);
        	console.log(errorMessage);
			console.log('=======================================================================================');
        }

    }
}

function doSearch() {
	let formattedSearchTerm = chalk.bgBlue.black.italic(config.searchTerm);
	let formattedCurrentBranch = chalk.bgWhite.black(config.currentBranch);
	let fileExtension = config.fileExtension;
	console.log(`Searching for ${formattedSearchTerm} in branch ${formattedCurrentBranch}`);
	try {
		let searchCommand = `rg -F '${config.searchTerm}'`;
		
		if(config.fileExtension !== '') {
			searchCommand = `rg -F --type-add '${fileExtension}:*.${fileExtension}'  -t${fileExtension} '${config.searchTerm}'`;
		}

		let searchResult = execSync(searchCommand);

		displaySearchResult(searchResult.toString());

	} catch(e) {
		// console.log(chalk.bgRed.bold(`Could not find '${config.searchTerm}' in the branch ${config.currentBranch} within files of type ${config.fileExtension}`));
		// console.log('=======================================================================================');
	}
}

function displaySearchResult(searchResult) {
	let lines = searchResult.trim().split("\n");
	if(lines.length === 0) {
		return;
	}

	let formattedCurrentBranch = chalk.black.italic(config.currentBranch);
	let formattedFileExtension = chalk.black.italic(config.fileExtension);

	console.log(chalk.bgYellow.black(`Search results found in ${formattedCurrentBranch}  within files of type ${formattedFileExtension}`));
	
	lines.forEach( line => {
		let fileName = chalk.green.bold(line.split(":")[0]);
		let lineNumber = chalk.yellow.bold(line.split(":")[1]);
		console.log(`${fileName} : ${lineNumber}`);
	});
}

function getFormattedError(e) {
	return chalk.bgRed(e.message.trim());
}

init();