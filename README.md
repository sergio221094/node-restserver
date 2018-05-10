## Rest Server Aplication

v0.0.1

This is a simple application developed with NodeJS that uses Mongo for data storage, the main function of this is to enhance a CRUD of users and perform validations through the use of JWT (Json Web Token)

To make it work, you have to execute the following command in the repository route

```
npm install
```

to carry out the consultations, it is recommended to use the Postman tool in the following way:

the application has a trial and launch version, is temporarily resting on heroku, with the help of mlab. For each the respective addresses are the following:

development: http: // localhost: 3000
Production: https://nameless-river-72177.herokuapp.com

Create the users through a POST in which the name, email and password are indicated as minimum.

To eliminate users it is necessary to create a DELETE method and send the user id to be deleted in the following way

url / user / id

To generate the token, a POST request is used, sending the mail and password as parameters, the query will return a token, then in a separate GET the users' query can be consulted, sending the token as a parameter.