function createServer() {



var path = require('path')
var petsPath = path.join(__dirname, 'pets.json')
var fs = require('fs')
var http = require('http')
var port = process.env.PORT || 8000;
const petRegExp = /^\/pets\/(.*)$/;

var server = http.createServer(function(req,res) {
    let petIndex = req.url[req.url.length-1]
    if (req.method === 'GET' && req.url === '/pets')  {
        fs.readFile(petsPath, 'utf-8', function (err, data) {
            if (err) {
                console.error(err.stack)
                res.statusCode = 500
                res.setHeader('Content-Type', 'text/plain')
                return res.end('Internal Server Error')
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
        })
    }
    else if (req.method === 'GET' && req.url === `/pets/${petIndex}`)  {
        fs.readFile(petsPath, 'utf-8', function (err, data) {
            let pet = JSON.parse(data);
            if(parseInt(petIndex) >= 0 && parseInt(petIndex) <= JSON.parse(data).length -1) {
            if (err) {
                console.error(err.stack)
                res.statusCode = 500
                res.setHeader('Content-Type', 'text/plain')
                return res.end('Internal Server Error')
            }
            let JSONpet = JSON.stringify(pet[petIndex])
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSONpet)
            }
        })
    
    } else if (req.method === 'POST' && req.url === '/pets')  {
            let body = ''
            req.on('data', function(chunk) {
                body += chunk
            })
            req.on('end', function() {
                // res.writeHead(200, {"Content-Type": "application/json"})
                // res.end(body)
                fs.readFile(petsPath, 'utf-8', function (err, data) {
                    if (err)  {
                        console.error(err.stack)
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'text/plain')
                    return res.end('Internal Server Error')
                    }
                    let parsedBody = JSON.parse(body)
                    let parsedData = JSON.parse(data)
                    let name = body.name
                    let kind = body.kind
                    let age = body.age
                    let pet = {age, kind, name}

                    parsedData.push(pet)
                    
                    let JSONpet = JSON.stringify(pet)
                    let JSONbody = JSON.stringify(parsedData)

                    // fs.writeFile(petsPath, JSONbody, function (err) {
                    //     if (err) {
                    //         console.error(err.stack)
                    //         res.statusCode = 500
                    //         res.setHeader('Content-Type', 'text/plain')
                    //         return res.end('Internal Server Error')
                    //     }
                    //     res.setHeader('Content-Type', 'application/json')
                    //     res.end(JSONpet)
                    // })
                })

            })        
    }
    
    else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end('Not found')
    }
})

server.listen(port, function() {
    console.log('Listening on port,', port)
})




}


createServer()