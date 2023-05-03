const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const axios = require('axios')
const yargs = require('yargs')
const app = require('./index.js')

describe('set-token command', () => {
    let consoleLogStub

    before(() => {
        // Stub console.log to prevent output during tests
        consoleLogStub = sinon.stub(console, 'log')
    })

    afterEach(() => {
        // Reset environment variable after each test
        delete process.env.GITHUB_TOKEN
    })

    after(() => {
        // Restore console.log after all tests are run
        consoleLogStub.restore()
    })

    it('should set the Github access token', async () => {
        const argv = yargs.parse('set-token test-token')
        await app.commands['set-token'].handler(argv)
        expect(process.env.GITHUB_TOKEN).to.equal('test-token')
        expect(consoleLogStub.calledOnceWith('Access token set successfully!'))
            .to.be.true
    })

    it('should throw an error if setting the token fails', async () => {
        const axiosStub = sinon
            .stub(axios, 'post')
            .rejects(new Error('Error setting token'))
        const argv = yargs.parse('set-token test-token')
        await expect(
            app.commands['set-token'].handler(argv)
        ).to.be.rejectedWith(Error, 'Error setting token')
        expect(process.env.GITHUB_TOKEN).to.be.undefined
        expect(consoleLogStub.notCalled).to.be.true
        axiosStub.restore()
    })
})
