# Address Book App API (Serverless)

Address Book App API is a RESTful API service using Serverless framework which allows users to list, filter, get, add, edit and delete their contacts.

## Requirements

* [Node.js](https://nodejs.org/en/download/)
* [MySQL](https://www.mysql.com/downloads/)

## Installation

Install Node.js and MySQL using the links above.

Clone the GitHub repository

```bash
$ cd /path/to/destination/
$ git clone https://github.com/gurhankokcu/address-book-app-api-serverless.git
```

Install npm modules

```bash
$ cd address-book-app-api-serverless
$ npm install
```

Create MySQL database

```sql
CREATE SCHEMA `address_book` DEFAULT CHARACTER SET utf8;
```

Confirm database name, server, username and password in `/config/config.json` and `/config/default.json`. Update the configuration if necessary.

Run Sequelize migration and seeder scripts to create tables and populate initial data

```bash
$ npm run migrate
$ npm run seed
```

## Usage

Deploy code using serverless

```bash
$ npm run deploy
```

Deployed version can be found at [https://jv59t84tx9.execute-api.us-east-1.amazonaws.com/dev](https://jv59t84tx9.execute-api.us-east-1.amazonaws.com/dev)

## Tests

ESLint is used for checking the code style.

```bash
$ npm run lint
```

Jest is used for testing the application. 

```bash
$ npm test
```

Postman collection is included (`postman-requests.json`). Requests can be imported to test each endpoint with sample data.

## Credits

* [REST API Tutorial](https://www.restapitutorial.com/lessons/httpmethods.html) is used to confirm paths and http status codes
* [Random Name Generator](https://www.random-name-generator.com/?country=united-kingdom&gender=&n=50&s=59504) is used to create sample data


## License
[ISC](https://choosealicense.com/licenses/isc/)
