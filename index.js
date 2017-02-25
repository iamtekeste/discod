#!/usr/bin/env node

'use strict';

const fs = require('fs');
const readline = require('readline');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

let config = {
    'branchesTxtPath': `${process.env['HOME']}/.detective/branches.txt`,
    'branches': [],
    'currentBranch': '',
    'searchTerm': 'noActiveFilters',
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
    const rl = readline.createInterface({
        input: fs.createReadStream(config.branchesTxtPath)
    });

    rl.on('line', (line) => {
        line = line.trim();
        if (line.length > 0)
            config.branches.push(line);
    });

    //call cb after the last line is read
    rl.on('close', doGitFetch);
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
        	console.log('Checkout Exception', e.message);
        }

    }
}

function doSearch() {
	console.log(`Looking for '${config.searchTerm}' in branch ${config.currentBranch}`);
	try {
		let searchResult = execSync(`ag --js ${config.searchTerm}`);
		displaySearchResult(searchResult);
	} catch(e) {
		console.log(`Could not find '${config.searchTerm}' in the branch ${config.currentBranch}`);
	}
}

function displaySearchResult(searchResult) {
	
}
init();