var cluster = require('cluster');
var http = require('http');
var mongoose = require('mongoose');
var express = require('express');
var dbConfig = require('./configs/db');
var bodyParser = require('body-parser');

cluster.schedulingPolicy = cluster.SCHED_RR;
var app = express();
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.text());
app.use(bodyParser.json());

if(cluster.isMaster){
    const NUM_OF_CORES = require('os').cpus().length;
    console.log('Exam Project - node.js cluster exam');
    console.log('This Computer has ' + NUM_OF_CORES + ' cpu cores.');
    console.log('Master');

    mongoose.connect(dbConfig.dbURI);
    const db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
        console.log('connected to mongodb server.');
    });


    for(var i = 0; i < NUM_OF_CORES; i++){
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' started.');
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('pid of died Worker : ' + worker.process.pid);
        console.log('exit code of died Worker : ' + code);
        console.log('signal of died Worker : ' + signal);
    })
}else{

    http.createServer(app).listen(10001, function () {
        console.log('CANDY TREE Http Server listening on port 10001');
    });
    console.log('process (pid : ' + process.pid + ') create http server.');

}

// test