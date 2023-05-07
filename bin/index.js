#!/usr/bin/env node
const axios = require('axios')
const yargs = require('yargs')
const chalk = require('chalk')
const boxen = require('boxen')
const os = require('os')

const welcomeMessage = chalk.blue.bold('Welcome to Caliex CLI!')

const developedBy = chalk.blue.yellowBright(
    'Developed with ❤️  by Devanshu Mahapatra'
)

yargs
    .scriptName('caliex')
    .usage(welcomeMessage)
    .usage('')
    .usage(developedBy)
    .usage('')
    //Add color to usage message
    .usage(chalk.magenta('Usage: $0 <command> [options]'))

    .command(
        'set-token <token>',
        'set your Github access token',
        {},
        async (argv) => {
            try {
                const token = argv.token
                if (process.platform === 'win32') {
                    // Set token as an environment variable in Windows
                    const { execSync } = require('child_process')
                    execSync(`setx GITHUB_TOKEN ${token}`)
                } else {
                    // Export token as an environment variable in macOS/Linux
                    const { appendFileSync } = require('fs')
                    const bashProfile =
                        process.platform === 'darwin'
                            ? '.bash_profile'
                            : '.bashrc'
                    const envVarLine = `export GITHUB_TOKEN=${token}\n`
                    appendFileSync(
                        `${process.env.HOME}/${bashProfile}`,
                        envVarLine
                    )
                }
                console.log(chalk.green.bold('Access token set successfully!'))
            } catch (error) {
                console.error(chalk.red.bold(error.message))
            }
        }
    )

    .command(
        'create-repo <name>',
        'create a new Github repository',
        (yargs) => {
            yargs.option('license', {
                alias: 'l',
                describe: 'License for the repository',
                demandOption: false,
                type: 'string',
            })
            yargs.option('readme', {
                alias: 'r',
                describe: 'Create a default README.md file',
                demandOption: false,
                type: 'boolean',
            })
        },
        async (argv) => {
            try {
                const token =
                    process.env.GITHUB_TOKEN ||
                    require('child_process')
                        .execSync(
                            '~/.bash_profile && echo $GITHUB_TOKEN'
                        )
                        .toString()
                        .trim()
                const url = 'https://api.github.com/user/repos'
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
                const data = {
                    name: argv.name,
                    license_template: argv.license,
                    auto_init: argv.readme || false,
                }
                const response = await axios.post(url, data, config)
                const successMessage = chalk.green.bold(
                    `Created new repository ${response.data.html_url}`
                )
                console.log(boxen(successMessage, { padding: 1, margin: 1 }))
            } catch (error) {
                const errorMessage = chalk.red.bold(error.message)
                console.error(boxen(errorMessage, { padding: 1, margin: 1 }))
            }
        }
    )

    .command('list-repos', 'list all Github repositories', {}, async (argv) => {
        try {
            const token =
                process.env.GITHUB_TOKEN ||
                require('child_process')
                    .execSync('~/.bash_profile && echo $GITHUB_TOKEN')
                    .toString()
                    .trim()
            const url = 'https://api.github.com/user/repos'
            let repos = []
            let page = 1
            let response = null
            do {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        per_page: 100, // the maximum number of items per page allowed by the GitHub API
                        page,
                    },
                }
                response = await axios.get(url, config)
                repos = [...repos, ...response.data]
                page++
            } while (
                response.headers.link &&
                response.headers.link.includes('rel="next"')
            )

            const repoNames = repos.map((repo) => repo.name)
            const successMessage = chalk.blueBright.bold(
                `Repository Names:\n${repoNames.join('\n')}`
            )
            console.log(boxen(successMessage, { padding: 1, margin: 1 }))
        } catch (error) {
            const errorMessage = chalk.red.bold(error.message)
            console.error(boxen(errorMessage, { padding: 1, margin: 1 }))
        }
    })

    .command(
        'delete-repo <owner> <repo>',
        'delete a Github repository',
        {},
        async (argv) => {
            try {
                const readline = require('readline')
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                })
                rl.question(
                    `Are you sure you want to delete ${argv.owner}/${argv.repo}? [y/n] `,
                    async (answer) => {
                        if (answer.toLowerCase() === 'y') {
                            const token =
                                process.env.GITHUB_TOKEN ||
                                require('child_process')
                                    .execSync(
                                        '~/.bash_profile && echo $GITHUB_TOKEN'
                                    )
                                    .toString()
                                    .trim()
                            const url = `https://api.github.com/repos/${argv.owner}/${argv.repo}`
                            const config = {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                    Accept: 'application/vnd.github+json',
                                    'X-GitHub-Api-Version': '2022-11-28',
                                },
                            }
                            const response = await axios.delete(url, config)
                            const successMessage = chalk.red.bold(
                                `Deleted repository ${argv.owner}/${argv.repo}`
                            )
                            console.log(
                                boxen(successMessage, { padding: 1, margin: 1 })
                            )
                        } else {
                            console.log('Cancelled delete operation.')
                        }
                        rl.close()
                    }
                )
            } catch (error) {
                console.error(error.message)
            }
        }
    )
    .command(
        'get-repo-url <repo_name>',
        'Get Github Repository URL',
        {},
        async (argv) => {
            try {
                const token =
                    process.env.GITHUB_TOKEN ||
                    require('child_process')
                        .execSync(
                            '~/.bash_profile && echo $GITHUB_TOKEN'
                        )
                        .toString()
                        .trim()
                const url = 'https://api.github.com/user/repos'
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
                const response = await axios.get(url, config)
                const filteredRepos = response.data.filter(
                    (repo) => repo.name === argv.repo_name
                )
                if (filteredRepos.length === 0) {
                    console.log(
                        chalk.red(`Repository '${argv.repo_name}' not found.`)
                    )
                } else {
                    const repoUrl = filteredRepos[0].git_url
                    const successMessage = chalk.blueBright.bold(
                        `Repository URL:\n${repoUrl}`
                    )
                    console.log(
                        boxen(successMessage, { padding: 1, margin: 1 })
                    )
                }
            } catch (error) {
                console.error(error.message)
            }
        }
    )

    .option('license', {
        alias: 'l',
        describe: 'Add License to the repository',
        demandOption: false,
        type: 'string',
    })
    .option('readme', {
        alias: 'r',
        describe: 'Add README.md file to the repository',
        demandOption: false,
        type: 'boolean',
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .strict()
    .help().argv
