#!/usr/bin/node

function cmdLineApp() {
    var name = process.argv[6];
    var kind = process.argv[5];
    var age = process.argv[4];
    var index = process.argv[3];
    var command = process.argv[2];
    var fs = require('fs');
    
    if (command === undefined) {
        console.error('Usage: node pets.js [ read | create | update | destroy ]');
    } else if (command === 'read')  {
        fs.readFile('./pets.json', 'utf8', function(err, data) {
            if (err)  {
                console.log(err)
            }
            const pets = JSON.parse(data)
            if (index < 0 || index >= pets.length)  {
                console.log('Usage: node pets.js read INDEX')
            } else if (index === undefined)  {
                console.log(pets)
            } else {
                console.log(pets[index])
            }
        })
    }
        else if (command === 'create')  {
            fs.readFile('./pets.json', 'utf-8', function(err, data) {
                if (err)  {
                    console.log(err)
                }
                const pets = JSON.parse(data);
                const obj = {};
                obj.age = Number(index);
                obj.kind = age;
                obj.name = kind;
                pets.push(obj);
                fs.writeFile('./pets.json', JSON.stringify(pets), function(err, data)  {
                    if (err)  {
                        console.log(err)
                    } else {
                        console.log(obj)
                    }
                })
            }) 
        }

        else if (command === 'update')  {
            fs.readFile('./pets.json', 'utf-8', function(err, data) {
                if (err) {
                    console.log(err)
                }
                const pets = JSON.parse(data);
                if (index === undefined || age === undefined || kind === undefined || name === undefined)  {
                    console.log('Usage: node pets.js update INDEX AGE KIND NAME')
                } else {
                    pets[index].age = Number(age)
                    pets[index].kind = kind
                    pets[index].name = name
                    console.log(pets[index])
                }
                fs.writeFile('./pets.json', JSON.stringify(pets), function(err, data) {
                    if (err) {
                        console.log(err)
                    }
                })
            })
        }
        else if (command === 'destroy')  {
            fs.readFile('./pets.json', 'utf-8', function(err,data) {
                if (err)  {
                    console.log(err)
                }
                const pets = JSON.parse(data)
                if (index === undefined)  {
                    console.log('Usage: node pets.js destroy INDEX')
                } else {
                    console.log(pets[index])
                    pets.splice(index, 1)
                }
                fs.writeFile('./pets.json', JSON.stringify(pets), function(err,data)  {
                    if (err) {
                        console.log(err)
                    } 
                })
            })
        }


}
cmdLineApp()