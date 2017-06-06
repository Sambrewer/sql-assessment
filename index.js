var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres:@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);
    //
    // db.user_create_seed(function(){
    //   console.log("User Table Init");
    // });
    // db.vehicle_create_seed(function(){
    //   console.log("Vehicle Table Init")
    // });
    app.get('/api/users', (req, res) => {
      db.read_users((err, users) => {
        if (!err) {
          res.send(users)
        } else {
          console.log(err);
        }
      })
    })
    app.get('/api/vehicles', (req, res) => {
      db.read_vehicles((err, vehicles) => {
        if (!err) {
          res.send(vehicles)
        } else {
          console.log(err);
        }
      })
    })
    app.post('/api/users', (req, res) => {
      let data = [req.body.firstname, req.body.lastname, req.body.email];
      db.create_user(data, (err, user) => {
        !err ? res.send(user) : console.log(err);
      })
    })
    app.post('/api/vehicles', (req, res) => {
      let data = [req.body.make, req.body.model, req.body.year];
      db.create_vehicle(data, (err, vehicle) => {
        !err ? res.send(vehicle) : console.log(err);
      })
    })
    app.get('/api/user/:userId/vehiclecount', (req, res) => {
      let id = parseInt(req.params.userId);
      db.read_vehicle_count([id], (err, count) => {
        !err ? res.send(count[0]) : console.log(err);
      })
    })
    app.get('/api/user/:userId/vehicle', (req, res) => {
      let id = parseInt(req.params.userId)
      db.read_vehicles_by_userid([id], (err, vehicles) => {
        !err ? res.send(vehicles) : console.log(err);
      })
    })
    app.get('/api/vehicle', (req, res) => {
      if (req.query.UserEmail) {
        db.read_vehicles_by_email([req.query.UserEmail], (err, vehicles) => {
          !err ? res.send(vehicles) : console.log(err);
        })
      }
      if (req.query.userFirstStart) {
        db.read_vehicles_by_query([req.query.userFirstStart + '%'], (err, vehicles) => {
          !err ? res.send(vehicles) : console.log(err);
        })
      }
    })
    app.get('/api/newervehiclesbyyear', (req, res) => {
      db.read_newervehicles((err, vehicles) => {
        !err ? res.send(vehicles) : console.log(err);
      })
    })
    app.put('/api/vehicle/:vehicleId/user/:userId', (req, res) => {
      let data = [req.params.vehicleId, req.params.userId]
      db.update_vehicle(data, (err, vehicle) => {
        !err ? res.send(vehicle) : console.log(err);
      })
    })
    app.delete('/api/user/:userId/vehicle/:vehicleId', (req, res) => {
      let data = [req.params.userId, req.params.vehicleId];
      db.remove_vehicle_from_user(data, (err, vehicle) => {
        !err ? res.send(vehicle) : console.log(err);
      })
    })
    app.delete('/api/vehicle/:vehicleId', (req, res) => {
      let id = req.params.vehicleId
      db.remove_vehicle(id, (err, vehicle) => {
        !err ? res.send(vehicle) : console.log(err);
      })
    })
})

app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})

module.exports = app;
