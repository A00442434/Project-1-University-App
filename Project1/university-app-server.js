const SERVER_PORT = 8144;
var express = require('express');
var mongodb = require('mongodb');
var fs = require('fs');
var user = 'k_ganesan';
var password = 'A00442434';
var database = 'k_ganesan';
var host = '127.0.0.1';
var port = '27017';

//Mongo Connection
var connectionString = 'mongodb://' + user + ':' + password + '@' +
    host + ':' + port + '/' + database;
console.log(connectionString);

//CORS Middleware, causes Express to allow Cross-Origin Requests
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};	

//set up the server variables
var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));

//variable for collection in mongodb
var uniCollectionCollection;
const NAME_OF_COLLECTION = 'uniCollection';

//connecting to the db
mongodb.connect(connectionString, function (error, db) {
    if (error) {
        throw error;
    }
    uniCollectionCollection = db.collection(NAME_OF_COLLECTION);
    // Close the database connection and server when the application ends
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });

//now start the application server
var server = app.listen(SERVER_PORT, function () {
        console.log('Listening on port %d',
                server.address().port);
    });
});

app.post('/saveUniDetail', function (request, response) {

    uniCollectionCollection.insert(request.body, 
        function (err, result) {//use empty to get all records
           if (err) {
               return response.send(400,'An error occurred saving a record.');
           }//end if

           return response.send(200, "Record saved successfully.");
       });
    });

app.post('/removeUni', function (request, response) {

    uniCollectionCollection.remove(
        {'Name': request.body.name},

        function (err, returnedStr) {
            if (err) {
                return response.send(400,'An error occurred retrieving records.');
            }//end if
        
            var obj = JSON.parse(returnedStr);//convert it to an obj
            console.log(obj.n + " records"); //contain # of removed docs
            return response.send(200, returnedStr);
    });
});

app.post('/findUni', function (request, response) {
   uniCollectionCollection.find(
        {'Name': request.body.name},
        function (err, result) {
           if (err) {
               return response.send(400,'An error occurred retrieving records.');
           }
           //now result is expected to be an array of uniCollection
        result.toArray(
            function (err, resultArray) {
            if (err) {
                return response.send(400, 'An error occurred processing your records.');
            }
            //if succeeded, send it back to the calling thread
            return response.send(200, resultArray);
        });
       });
    });

		
app.post('/showRecords', function (request, response) {
    uniCollectionCollection.find(
        function (err, result) {
           if (err) {
               return response.send(400,'An error occurred retrieving records.');
           }
           //now result is expected to be an array of uniCollection
        result.toArray(
            function (err, resultArray) {
            if (err) {
                return response.send(400, 'An error occurred processing your records.');
            }
            //if succeeded, send it back to the calling thread
            return response.send(200, resultArray);
        });
       });
    });
