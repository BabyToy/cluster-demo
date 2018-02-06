/*eslint valid-jsdoc: "off"*/
/*eslint-env es6*/

'use strict';

const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  let workers = os.cpus().length;
  console.log('Master cluster setting up ' + workers + ' workers.');

  for (var i = 0; i < workers; i++) {
    cluster.fork();
  }

  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const app = require('express')();
  const parser = require('body-parser');
  // middleware configuration
  app.use(parser.json());
  app.use(parser.urlencoded({ extended: false }));

  app.all('/*', function (request, response) {
    response.send('process ' + process.pid + ' says hello!')
      .end();
  });

  const server = app.listen(80, function () {
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
    console.log('http://' + os.hostname() + ':' + server.address().port);
  });
}
