#!/usr/bin/env node
'use strict';

const fs = require('fs');
const readline = require('readline');
const spawn = require('child_process').spawn;

let config = {
	'branchesTxtPath': `${process.env['HOME']}/.detective/branches.txt`,
	'branches': [],
	'searchTerm': ''
};

function init() {
	//do check up before running
	let goodToGo = doCheckup();
	if(goodToGo) {
		//parse branches.txt
		parseBranchesTxt();
		//
	}
}

function doCheckup() {
	//check that branches.txt exists & we have at least one branch in in it
	//check that they have supplied a searchTerm
	//check that it is a git repo
	//check that we have a remote setup
	return true;
}

function parseBranchesTxt() {
	const rl = readline.createInterface({
		input: fs.createReadStream(config.branchesTxtPath)
	});

	rl.on('line', (line) => {
		line = line.trim();
		if(line.length > 0)
			config.branches.push(line);
	});

	//call cb after the last line is read
	rl.on('close', doGitFetch);
}

function doGitFetch() {
	let gitFetch = spawn('git', ['fetch'], {stdio: 'inherit'});
	
	process.stdout.on('data', data => {
		console.log('fetching...')
	});
	process.stdout.on('close', doGitCheckout);
}

function doGitCheckout() {
	
}
init();