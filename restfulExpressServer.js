const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
var path = require('path')
var petsPath = path.join(__dirname, 'pets.json')
const app = express();
const parser = require('body-parser');
//connect to pool, using pg library (pool is basically a connection)
// research how to link database for route, 
app.use(parser.json());

console.log(petsPath)

app.post('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf-8', function(err, JSONpets) {
        if (err) throw err;


        let petsJS = JSON.parse(JSONpets);
        let name = req.body.name;
        let kind = req.body.kind;
        let age = parseInt(req.body.age);
        let pet = {age, kind, name};

        if (!name || Number.isNaN(age) || !kind) {
            res.set('Content-Type', 'text/plain');
            return res.sendStatus(400);
        }

        petsJS.push(pet);

        let petsJSON = JSON.stringify(petsJS);

        fs.writeFile(petsPath, petsJSON, function(err) {
            if (err)  {
                console.err(err.stack);
                return res.sendStatus(404);
            }
            res.sendStatus = 200;
            res.set('Content-Type', 'application/json');
            res.send(pet);
        })
    })
});


app.get('/pets', (req,res) => {
    fs.readFile(petsPath, 'utf-8', (err, data) => {
        if (err)  {
            console.log(err.stack);
            return res.sendStatus(500);
        }

        // if (req.url !== '/pets') {
        //     res.set('Content-Type', 'text/plain');
        //     return res.sendStatus(404);
        //     res.end(err);
        // }

        res.sendStatus = 200;
        res.set('Content-Type', 'application/json');
        res.end(data)
    })
})

app.get('/pets/:id', (req, res) => {
    fs.readFile(petsPath, 'utf-8', (err, data) => {
      if(err)   {
        console.error(err.stack);
        return res.sendStatus(404);
      }


      let id = Number.parseInt(req.params.id);

      if(id < 0 || id >= JSON.parse(data).length || Number.isNaN(id)){
        res.set('Content-Type', 'text/plain');
        res.sendStatus(404);
        res.end(err)
      }
      res.sendStatus = 200;
      res.set('Content-Type', 'application/json');
      res.end(JSON.parse(data)[id])
    })
})

app.patch('/pets/:id', (req, res, next) => {
    fs.readFile(petsPath, 'utf-8', (err, JSONpets) => {
        if (err)  {
            console.err(err.stack);
            return res.sendStatus(500)
        }
        // let id = Number.parseInt(req.params.id);

        // if(id < 0 || id >= JSON.parse(data).length || Number.isNaN(id)){
        //     return res.sendStatus(500);
        // }
        let petsJS = JSON.parse(JSONpets)
        let name = req.body.name;
        let age = parseInt(req.body.age);
        let kind = req.body.kind;
        let id = parseInt(req.params.id);
        // let pet = {age, kind, name}
        let selectedPet = petsJS[id];
        
        if (name) {
            selectedPet.name = name;
        };

        if (age)  {
            selectedPet.age = age;
        };

        if (kind)  {
            selectedPet.kind = kind;
        }
        // selectedPet = pet;
        let petsJSON = JSON.stringify(petsJS);


        fs.writeFile(petsPath, petsJSON, (err) => {
            if (err) {
                console.err(err.stack);
                return res.sendStatus(500);
            }
            res.set('Content-Type', 'application/json');
            res.send(selectedPet)
        })

    })
})

app.delete('/pets/:id', (req, res) => {
    fs.readFile(petsPath, 'utf-8', (err, JSONpets) => {
        if (err)  {
            console.err(err.stack);
            return res.sendStatus(404);
        }
        let JSpets = JSON.parse(JSONpets);
        let id = parseInt(req.params.id);
        let selectedPet = JSpets[id];
        JSpets.splice(id, 1);
        // console.log(req.params.id)
        let petsJSON = JSON.stringify(JSpets);

        fs.writeFile(petsPath, petsJSON, (err) => {
            if (err)  {
                console.err(err.stack);
                res.sendStatus(500);
            }
            res.set('Content-Type', 'application/json');
            res.send(selectedPet);
        })

    })
})



app.listen(8000, function () {
    console.log('Listening on port 8000')
})

