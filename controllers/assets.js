const db = require('../util/database');
const { v4: uuidv4 } = require('uuid');

// Used in Manager and Admin for showing all assets list
const getAllAssets = (req, res, next) => {
    const query = 'SELECT * FROM asset_info';
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            assets: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}
//  use in Admin Asset Module
const addAsset = (req, res, next) => {
    const query = `
        INSERT INTO asset_info
        VALUES (
            ${req.body.total_price},
            '${req.body.title}',
            ${req.body.quantity},
            ${req.body.price}, 
            '${req.body.category}',
            '${req.body.details}',
            0,
            0,
            '${uuidv4()}',
            0
            )`;
    db.query(query).then(()=> {
        res.json({
            error: false,
            status: "success",
            message: "added successfully"
        });
    }).catch(dbRes => {
        next(dbRes);
    });
}
// use in admin asset module
const updateAsset = (req, res, next) => {
    const updateQuery = `
        UPDATE asset_info
        SET 
            title='${req.body.title}', 
            category='${req.body.category}', 
            quantity=${req.body.quantity},
            price=${req.body.price},
            total_price=${req.body.total_price},
            details='${req.body.details}'
        WHERE id='${req.body.id}'
    `;
    db.query(updateQuery).then(dbRes => {
        res.json({
            error: false,
            status: "success",
            message: 'Asset details updated successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

// Admin Asset Module
const deleteAsset = (req, res, next) => {
    const query = `
        DELETE FROM asset_info
        WHERE id='${req.params.id}'
    `;
    db.query(query).then(() => {
        res.json({
            error: false,
            message: 'Asset Deleted Successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

// Manager Asset Module 
const requestAsset = (req, res, next) => {
    const updateQuery = `
        UPDATE asset_info
        SET  
            pending=${req.body.pending}
        WHERE id='${req.body.asset_id}'
    `;
    db.query(updateQuery).then().catch();
    const query = `
        INSERT INTO request_info
        VALUES (
            '${req.body.asset_id}',
            '${req.body.manager_id}',
            '${req.body.employee}',
            ${req.body.quantity},
            'pending',
            '${uuidv4()}'
            )`;
    db.query(query).
    then(() => {
        res.json({
            error: false,
            status: "success",
            message: 'Asset requested successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });

}

module.exports = {
    // ***** Admin******
    getAllAssets,
    addAsset,
    updateAsset,
    deleteAsset,
    //***** manager*****
    requestAsset
    // getAllAssets
    
};