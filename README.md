## Caliex

A simple package developed using NodeJs and Github API in order to interact with Github right from the terminal

<p align="center">
 <img src="https://user-images.githubusercontent.com/93381397/235945837-edbc195c-30c0-4d8d-a850-9152955ae749.png" alt="app-screen" width="800" height="500" />
</p>


## Features

- Create and Delete Github Repositories right from your terminal
- Additional option to specify different types of License



## Installation
Install via NPM:

```bash
npm install caliex

```

## Usage: 

```bash
caliex <command> [options]
````

## Commands:

####  - Set your Github access token
```bash
  caliex set-token <token>           
```
####  - Create a new Github repository
```bash
  caliex create-repo <name>          
```
- You can also use the "-r" and "-l" option to create a readme and license file respectively:
```bash
  caliex create-repo <name> -r -l <license_name>
```
####   - List all Github repositories 
```bash
  caliex list-repos                  
```
####   - Delete a Github Repository
```bash
  caliex delete-repo <owner> <repo>
```
####   - Get Github Repository URL
```bash
  caliex get-repo-url <repo_name> 
```

## Options:
```bash
  -v, --version  Show version number                                   [boolean]
  -l, --license  Add License to the repository                          [string]
  -r, --readme   Add README.md file to the repository                  [boolean]
      --help     Show help                                             [boolean]
```


## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

## Contributing:

If you wish to contribute to Caliex, please submit a pull request with your proposed changes. We welcome contributions from the community and will do our best to review and incorporate them into the project.

## Author

[Devanshu-17](https://github.com/Devanshu-17)

## Contact:

If you have any questions or concerns about Caliex, please contact us at devanshumahapatra17@gmail.com. We appreciate your feedback and will do our best to respond as soon as possible.

### Thank you for choosing Caliex!
