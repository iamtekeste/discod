#!/usr/bin/env node

'use strict';

const fs = require('fs');
const readline = require('readline');
const exec = require('child_process').exec;

let config = {
    'branchesTxtPath': `${process.env['HOME']}/.detective/branches.txt`,
    'branches': [],
    'searchTerm': 'meh'
};

function init() {
    //do check up before running
    let goodToGo = doCheckup();
    if (goodToGo) {
        //parse branches.txt
        parseBranchesTxt();
        //
    }
}

function doCheckup() {
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
    let gitFetch = exec('git fetch', (error, stdout, stderr) => {

        if (error && error.code !== 0) {
        	console.log('Fetching failed with the following error')
        	console.log(stderr);
            return;
        } else {
            doGitCheckout();
        }
    });
}

function doGitCheckout() {
	let badShitHappened = false;
    for (let i = 0; i < config.branches.length; i++) {
    	
    	if(badShitHappened)  {
    		break;
    	}
    	//do fancy loading animation
        console.log(`checking out ${config.branches[i]}`);

        exec(`git checkout ${config.branches[i]}`, (error, stdout, stderr) => {
        	//turn off loading animation here

            if (error && error.code !== 0) {
            	console.log(stderr);
                badShitHappened = true;
            } else {
            	//do search now
                console.log('checkout was success!');
                doSearch();
            }
        });
    }
}

function doSearch() {

}


init();