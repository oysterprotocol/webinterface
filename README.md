# Web Interface

Webinterface is Oyster's official interface for storage users to initiate an upload with the brokers to store their files securely on the tangle. It allows users to select how long they would like the tangle to retain their file, and it will calculate how much PRL they owe for storage and give them an address to send their payment. It shows upload progress as the user's file is attached to the tangle, and gives the user a handle to retrieve the file in the future. Webinterface allows them to download any file that they have the handle for.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

Clone the repo

```
git clone https://github.com/oysterprotocol/webinterface.git
```

Install dependencies

```
npm
```

Start web server

```
npm start
```

Navigate to url

[http://localhost:3001/](http://localhost:3001/)

## Running the tests

### Unit Tests (Jest)

Run Once

```
npm test
```

Run with watcher

```
npm test:watch
```

Run with code coverage

```
npm test:coverage
```

### End to End Tests ([Cypress](https://www.cypress.io/))

Run

```
npm cypress:open
```

Run and publish results to [Cypress Dashboard](https://dashboard.cypress.io/#/projects/runs)

```
npm cypress:publish
```

### Coding style tests

ES Lint is configured to run on compile, you will see warnings in the console in regards to code style. Eventually, we will start failing the build when code style warnings appear.

https://docs.cypress.io/guides/references/best-practices.html

## Deployment

Save the Oyster SSH Key for AWS (found on 1password) in ~/.ssh/oyster.pem

SSH into server

```
ssh ubuntu@18.218.209.199 -i ~/.ssh/oyster.pem
```

Run these commands

```
cd /var/www/storage
sudo su
git pull
```

## Built With

- [React](https://reactjs.org/) - The web framework used
- [Redux](https://redux.js.org/) - State Management
- [IOTA](https://github.com/iotaledger/iota.lib.js/) - IOTA Core API
- [Webpack](https://webpack.js.org/) - Build tools

## Project Status

- [Travis CI Builds](https://travis-ci.org/oysterprotocol/webinterface) - Build Report
- [E2E Test Dashboard (Cypress)](https://www.cypress.io/) - E2E test results
- [Code Climate](https://codeclimate.com/github/oysterprotocol/webinterface) - Reports code coverage, maintainability, and trends

## Contributing

Please read [CONTRIBUTING.md](https://google.com) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

See also the list of [contributors](https://github.com/oysterprotocol/webinterface/graphs/contributors) who participated in this project.
