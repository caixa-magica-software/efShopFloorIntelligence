# Data Storage Relational Database

This page will introduce how to use a relational database using, how to deal with security and some sample for each operation in order to achieve the goal of the developer


```
* Import SDK and basic features
* Security
* Create database
* Create Collections
* Create Itens
```


## Import SDK

```javascript
let datastorage = require('vfos-sdk').datastorageRelational;

//acess database operations
let database = datastorage.Database;
//acess tables operations
let database = datastorage.Tables;
//acess rows operations
let database = datastorage.Rows;
//acess views operations
let database = datastorage.views;
```
## Security

To enable security first you need to get a security token from the platform then use that token in SDK security class to authenticate request over the call with all components
```javascript
let datastorage = require('vfos-sdk').datastorageRelational;
let security = require('vfos-sdk').security;

//set token in security class
security.setToken('<token_getted_from_plataform>');

```


## Create Database

To create database access database class of realational database component and set the security
```javascript
let datastorage = require('vfos-sdk').datastorageRelational;
let security = require('vfos-sdk').security;

//set token in security class
security.setToken('<token_getted_from_plataform>');

//require the database class
let database = datastorage.Database;
let dbName = 'person'
//call operation add database
Database.addDatabase(dbName, (err, data) => {
	if (err) {
		//error
	else {
		//sucess
	}
});
```


## Delete Database

To delete database access database class of relational database component  
```javascript
let datastorage = require('vfos-sdk').datastorageRelational;
let security = require('vfos-sdk').security;

//set token in security class
security.setToken('<token_getted_from_plataform>');

//require the database class
let database = datastorage.Database;
let dbName = 'person'
//call operation add database
Database.dropDatabase(dbName, (err, data) => {
	if (err) {
		//error
	else {
		//sucess
	}
});
```


## Create Colletions

To create collections access table class of realational database component 
```javascript
let datastorage = require('vfos-sdk').datastorageRelational;
let security = require('vfos-sdk').security;

//set token in security class
security.setToken('<token_getted_from_plataform>');

//require the database class
let tables = datastorage.Tables;
let dbName = 'persons';
let tableDefinations = {
	
}
//call operation add database
tables.addTable(dbName, tableDefinations, (err, data) => {
	if (err) {
		//error
	else {
		//sucess
	}
});
```

## List Colletions

To list collections access table class of realational database component 
```javascript
let datastorage = require('vfos-sdk').datastorageRelational;
let security = require('vfos-sdk').security;

//set token in security class
security.setToken('<token_getted_from_plataform>');

//require the database class
let tables = datastorage.Tables;
let dbName = 'persons';
let tableDefinations = {
	
}
//call operation add database
tables.listTables(dbName, (err, data) => {
	if (err) {
		//error 
	else {
		//sucess
	}
});
```