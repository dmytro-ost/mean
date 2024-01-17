<img src="https://img.shields.io/badge/Node%20v12.20-Node.js-green" alt="">
<img src="https://img.shields.io/badge/Express%204.17-Express.js-green" alt="">
<img src="https://img.shields.io/badge/Mongoose%205.11.18-mongoose.js-green" alt="">
<img src="https://img.shields.io/badge/Morgan%201.10-morgan.js-green" alt="">
<img src="https://img.shields.io/badge/joi%2017.4.0-joi.js-green" alt="">
<img src="https://img.shields.io/badge/JWT%208.5.1-jsonwebtoken.js-green" alt="">
<img src="https://img.shields.io/badge/draft-api-yellow" alt="">
<img src="https://img.shields.io/badge/eslint-eslint%20config%20google-green" alt="">

# API service in REST style

Implement UBER like service for freight trucks, in REST style, using MongoDB as database. This service should help
regular people to deliver their stuff and help drivers to find loads and earn some money. Application contains 2 roles,
driver and shipper.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing
purposes.

### Prerequisites

[Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your work station or remotely

### Installing

First install Node.js and MongoDB. Then:

Verify installation.
Open a command prompt (or PowerShell), and enter the following:

```
node –v
```

The system should display the Node.js version installed on your system.
You can do the same for NPM:

```
npm –v
```

Create a copy of repository

```
git clone https://gitlab.com/dmytro-ost/rd-lab-fe-nodejs-hw3.git

```

Install modules from npm

```
npm install
```

Open in text editor .env file in the root directory of project.
Setup environment-specific variables on new lines in the form of NAME=VALUE. For example:

```
PORT=8080
DB_CONNECT_STRING='mongodb+srv://YOUR_DATABASE_LOGIN:YOUR_DATABASE_PASSWORD@cluster0.yyfim.mongodb.net/db_app'
JWT_SECRET='JustAnySecretWords'
```

Launch application with command:

```
npm start
```


## Usage

Application provide a collection of APIs that enable you to process and manage loads delivery.
[Learn API specification](https://gitlab.com/dmytro-ost/rd-lab-fe-nodejs-hw3/-/blob/master/swagger.yaml)


## License

ISC