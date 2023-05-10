const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// This route *should* return the logged in users pets
router.get('/', (req, res) => {
    console.log('/pet GET route');
    // req.isAuthenticated and req.user are provided by Passport
    console.log('is authenticated?', req.isAuthenticated());
    //  step: 1 Are we authenticated?
    if (req.isAuthenticated()) {
        // ! User is logged in
        console.log('user', req.user);
        let parameters = [req.user.id];
        let queryText = `SELECT * FROM "pets" WHERE "user_id" = $1;`;
        // ! This is authorization, very unlikely we will need this for solo projects
        // if (req.user.access_level > 5) {
        //     queryText = `SELECT * FROM "pets";`;
        //     parameters = [];
        // }
        // ! DO NOT pass the user id from the client for data that requires authentication
        // STEP: 2 Use the logged in users id (req.user.id) to GET the list of Pets
        pool.query(queryText, parameters).then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
    } else {
        // ! User is not logged in
        res.sendStatus(403);
    }

});

// This route *should* add a pet for the logged in user
router.post('/', (req, res) => {
    console.log('/pet POST route');
    console.log(req.body);
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    if (req.isAuthenticated()) {
        let queryText = `INSERT INTO "pets" ("name", "user_id") VALUES ($1, $2);`;
        pool.query(queryText, [req.body.name, req.user.id]).then((result) => {
            res.sendStatus(201);
        }).catch((error) => {
            console.log(`Error ${error}`);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }


});

module.exports = router;