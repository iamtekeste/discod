# DISCOD
> `discod` which is short for DISCO(the name of my team) detective is a `cli` tool when given a list of `git` branches and a search criteria
will perfom a search on one branch at a time and go through all the branches in the list printing filenames and line numbers that match the search criteria.

## Install
discod makes use of [`ripgrep`](https://github.com/BurntSushi/ripgrep) which is a search tool with more features and better perfomance than `grep`.
Run the following command to install it.
```shell
$ brew install ripgrep
```
You are now ready to install `discod` from `npm`
```
$ npm install -g discod
```
## Usage

```sh
discod searchTerm [fileExtension]
```
To edit the list of git branches to search through, run the following command
```sh
discod --edit-list #this will open up a text file in your default editor
```

## License

MIT © [Tekeste](https://github.com/iamtekeste)
