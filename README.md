# API to shorten urls
Created with NodeJs + Postgresql

### install dependencies

`npm install`

### Create a postgresql data base

  CREATE DATABASE shorten_url
  WITH OWNER postgres;

  CREATE TABLE urls (
	id TEXT,
	short_url VARCHAR(100),
	long_url VARCHAR(200)
	);

### Change connection data to the postgres DB in the connectionString variable on queries.js file

`var connectionString = 'postgres://postgres:postgres@localhost:5432/shortlink';` 

### serve with host reload at localhost:3000

`npm serve`
