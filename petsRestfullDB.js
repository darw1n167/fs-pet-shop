const express = require('express');
const app = express();
app.use(express.json());
const morgan = require('morgan');
app.use(morgan('tiny'));
const { Pool } = require('pg');
const basicAuth = require('express-basic-auth');

const pool = new Pool({
    host: 'localhost',
    user: 'WINDOWS_DWEEZY',
    password: '1234',
    database: 'petshop',
    port: 5432
})

app.get('/pets', async (req, res) => {   
    try {
    const { rows } = await pool.query('SELECT * FROM pets')
    console.log(rows)
    res.json(rows);

    } 
    catch(err) {
        console.error(err)
        res.status(500).send(err);
    }
});

app.get('/pets/:id', async(req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM pets WHERE id = $1`, [req.params.id])
        if (rows.length < 1)  {
            res.sendStatus(404);
        }
        res.json(rows);
    }
    catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});

app.post('/pets', async(req, res) => {
    const { name, age, kind } = req.body;
    if (!name || !age || !kind)  {
        res.sendStatus(400)
    } 
    try {
        const { rows } = await pool.query(`INSERT INTO pets (name, age, kind) VALUES ($1, $2, $3)`, [name, age, kind]);
        res.json(req.body)
    } 
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    } 
})

app.patch('/pets/:id', async (req, res) => {
    let id = req.params.id;
    let {age, kind, name} = req.body;

    // if (id < 1 || id > res.rows || Number.isNaN(id)) {
    //     console.error(err);
    //     res.sendStatus(400);
    // }
    try {
        let { rows } = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
        if(rows.length < 1) {
            res.sendStatus(404);
        }
        if (age) {
            await pool.query('UPDATE pets SET age = $1 WHERE id = $2', [age, id]);
        }
        if (name) {
            await pool.query('UPDATE pets SET name = $1 WHERE id = $2', [name, id]);
        }
        if (kind) {
            await pool.query('UPDATE pets SET kind = $1 WHERE id = $2', [kind, id]);
        }
        res.json(req.body)
    }
    catch(err) {
        console.error(err);
        res.sendStatus(400);
    }
})


app.put('/pets/:id', async (req, res) => {
    let id = req.params.id;
    let {age, kind, name} = req.body;

    if (!age || !kind || !name) {
        res.sendStatus(400);
    }
    try {
        await pool.query('UPDATE pets SET kind = $1, age = $2, name = 3$ WHERE id = $4', [kind, age, name, id]);
        res.json(req.body)
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
})


app.delete('/pets/:id', async (req, res) => {
    let id = req.params.id;

    try {
        if (rows.length < 1)  {
        res.sendStatus(404);
        }
        await pool.query('DELETE FROM pets WHERE id = $1', [id]);
        res.json('Deleted');
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
})
const port = process.env.PORT || 8000;


app.listen(port, () => {
    console.log('Server is listening on port 8000');
})

