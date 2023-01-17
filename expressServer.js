const express = require('express')
const app = express()
var path = require('path')
var petsPath = path.join(__dirname, 'pets.json')
const regExp = /^\/pets\/(.*)$/;
let fs = require('fs');
const { urlencoded } = require('express');
const parser = require('body-parser');
app.use(parser.json())


function routeWithNext(req, res, next) {
  next();
} 

function backUp(req, res, next) {
    let petIndex = req.url.substring(req.url.lastIndexOf('/') + 1)
    fs.readFile(petsPath, 'utf-8', function(err, JSONpets, next) {
        if (err) {
          console.error(err);
          res.sendStatus(500)
        }
        res.set('Content-Type', 'application/json')
        res.send(JSONpets)
    })  
}

app.get('/pets', routeWithNext)
app.get('/pets',  backUp)
 
app.get('/pets/:id', (req, res) => {
    fs.readFile(petsPath, 'utf-8', (err, data) => {
      if(err){
        console.error(err.stack);
        return res.sendStatus(404);
      }
      let id = Number.parseInt(req.params.id);
      if(id < 0 || id >= JSON.parse(data).length || Number.isNaN(id)){
        return res.sendStatus(500);
      }
      res.set('Content-Type', 'application/json');
      res.send(JSON.parse(data)[id])
    })
})



// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.post('/pets', function(req, res) {
      fs.readFile(petsPath, 'utf-8', (err, data) => {
        if (err)  {
        console.error(err.stack);
        return res.sendStatus(500);
      }

      let name = req.body.name;
      let age = parseInt(req.body.age);
      let kind = req.body.kind;
      let pet = {age, kind, name};
      let parsedPets = JSON.parse(data);

      if (!name || Number.isNaN(age) || !kind) {
        return res.sendStatus(400)
      }

      parsedPets.push(pet)
      console.log(parsedPets)


      let JSONpets = JSON.stringify(parsedPets)

      fs.writeFile(petsPath, JSONpets, function(err) {
        if (err) {
          console.error(err.stack);
          return res.sendStatus(404)
        }
        res.set('Content-Type', 'application/json');
        res.send(pet)
      })
    })
  })




app.listen(8000, function() {
    console.log('Listening on port 8000')
})