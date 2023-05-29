var express = require('express');
var router = express.Router();
var db =require('../models/database');

router.get('/', (req, res) => {
    res.json('test')
})

router.get('/newproduct', (req, res, next) => {
    db.query('SELECT * FROM product ORDER BY capNhat DESC LIMIT 0,4',
    (err, data) => {
        if(err) throw new Error(err);
        res.json(data)
    })
})

router.get('/productview', (req, res, next) => {
    db.query('SELECT * FROM product ORDER BY soLanXem DESC LIMIT 0,4',
    (err, data) => {
        if(err) throw new Error(err);
        res.status(200).json(data)
    })
})

router.get('/producthot', (req, res, next) => {
    db.query('SELECT * FROM product WHERE hot=1 ORDER BY soLanXem DESC LIMIT 0,4',
    (err, data) => {
        if(err) throw new Error(err);
        res.status(200).json(data)
    })
})

router.get('/detail/:id', (req, res, next) => {
    let id = req.params.id;
    db.query(`SELECT * FROM product WHERE id=${id}`,
    (err, data) => {
        if(err) throw new Error(err);
        res.status(200).json(data)
    })
})

router.get('/loai/:id', (req, res, next) => {
    let id = req.params.id;
    db.query(`SELECT * FROM product WHERE idLoai=${id}`,
    (err, data) => {
        if(err) throw new Error(err);
        res.status(200).json(data)
    })
})



module.exports = router;
