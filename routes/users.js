const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../util/database');
const config = require('../config/config.json');


//  use in signup Module
const checkEmailAvailability = (req, res, next) => {
    const query = `
        SELECT * FROM user_info
        WHERE email='${req.body.email}'
    `;
    db.query(query).then(dbRes => {
        if (dbRes.rows.length > 0) {
            res.json({
                error: true,
                message: 'Email already exists'
            });
        } else {
            next();
        }
    }).catch(dbErr => {
        next(dbErr);
    });
}
//  use in signup Module
router.post('/signup', checkEmailAvailability, (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const query = `INSERT INTO user_info
            VALUES (
            '${uuidv4()}',
            '${req.body.name}', 
            '${req.body.email}', 
            '${hashedPassword}',
            'user'
            )`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            message: 'User registered successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
});
//  use in signIn Module
router.post('/login', (req, res, next) => {
    const query = `
        SELECT * FROM user_info
        WHERE email='${req.body.email}'
    `;
    db.query(query).then(dbRes => {
        if (dbRes.rows.length === 0) {
            res.json({
                error: true,
                message: 'Email not found. Please Register'
            });
        } else {
            const passwordMatched = bcrypt.compareSync(req.body.password, dbRes.rows[0].password);
            if (passwordMatched) {
                const payload = {
                    email: dbRes.rows[0].email,
                    name: dbRes.rows[0].name,
                    role: dbRes.rows[0].user_type,
                    id: dbRes.rows[0].id
                };
                const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '1hr'});
                res.json({
                    error: false,
                    message: 'Login Successfull',
                    token: token,
                    payload: payload
                });
            } else {
                res.json({
                    error: true,
                    message: 'Invalid credentials'
                });
            }
        }
    }).catch(dbErr => {
        next(dbErr);
    })
});
//  use in profile Module
router.put('/getProfile/:email', (req, res, next) => {
    const query = `SELECT * FROM user_info WHERE email='${req.params.email}'`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            profile: dbRes.rows,
            message: "data found"
        });
        // console.log(dbRes.rows)
    }).catch(dbErr => {
        next(dbErr);
    });
});
//  use in profile Module
router.post('/updateProfile', (req, res, next) => {
    const updateQuery = `
        UPDATE user_info
        SET 
            name='${req.body.name}', 
            number=${req.body.number}, 
            address='${req.body.address}',
            country='${req.body.country}',
            state='${req.body.state}'
        WHERE id='${req.body.id}'
    `;
    db.query(updateQuery)
    .then(dbRes => {
        res.json({
            error: false,
            status: "success",
            message: 'Profile updated successfully'
        });
    })
    .catch(dbErr => {
        next(dbErr);
    });
});
module.exports = router;