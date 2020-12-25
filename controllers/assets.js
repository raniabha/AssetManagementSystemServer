const db = require('../util/database');
const { v4: uuidv4 } = require('uuid');

// checking id is present or not before deleting.
const checkAssetId = (req, res, next) => {
    const checkAvailability = `
        SELECT * FROM asset_info
        WHERE id='${req.params.id}'
    `;
    db.query(checkAvailability).then(dbRes => {
        if (dbRes.rows.length > 0) {
            next();
        } else {
            res.json({
                error: true,
                message: 'No asset found with the ID'
            });
        }
    });
}

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

const getAllRequest = (req, res, next) => {
    const query =  `SELECT request_info.id as req_id, request_info.employee as employee, request_info.quantity as req_quantity,
                        asset_info.id as asset_id, asset_info.title as title, asset_info.category as category, asset_info.assigned as assigned, asset_info.pending as pending,
                        user_info.name as manager
                    FROM request_info, asset_info, user_info 
                    WHERE   status='pending' and 
                            request_info.manager_id = user_info.id and 
                            request_info.asset_id = asset_info.id`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            assets: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const getAssignedAsset = (req, res, next) => {
    const query =  `SELECT  request_info.employee as employee, request_info.quantity as req_quantity,
                        asset_info.title as title, asset_info.category as category,
                        user_info.name as manager
                    FROM request_info, asset_info, user_info 
                    WHERE   status='assigned' and 
                            request_info.manager_id = user_info.id and 
                            request_info.asset_id = asset_info.id`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            assets: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const getRequestStatus = (req, res, next) => {
    const query = `SELECT asset_info.title as title, asset_info.category as category,
                    request_info.employee as employee, request_info.quantity as quantity, request_info.status as status
                FROM request_info, asset_info
                WHERE manager_id='${req.params.id}' AND
                    request_info.asset_id =  asset_info.id`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            assets: dbRes.rows
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const getAssetByID = (req, res, next) => {
    const query = `SELECT * FROM asset_info WHERE id='${req.body.id}'`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            assets: dbRes.rows,
            message: "data found"
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

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
            '${uuidv4()}'
            )`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            // data: dbRes.rows
            status: "success",
            message: "added successfully"
        });
    }).catch(dbRes => {
        next(dbRes);
    });
}

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
    then(dbRes => {
        res.json({
            error: false,
            status: "success",
            message: 'Asset requested successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });

}

const rejectRequest = (req, res, next) => {
    const assetQuery = `
        UPDATE asset_info
        SET 
            pending='${req.body.pending}'
        WHERE id='${req.body.asset_id}'
    `;
    db.query(assetQuery).then().catch();
    const updateQuery = `
        UPDATE request_info
        SET 
            status='rejected'
        WHERE id='${req.body.req_id}'
    `;
    db.query(updateQuery).then(dbRes => {
        res.json({
            error: false,
            status: "success",
            message: 'Asset request rejected successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const acceptRequest = (req, res, next) => {
    const assetQuery = `
        UPDATE asset_info
        SET 
            assigned='${req.body.assigned}',
            pending='${req.body.pending}'
        WHERE id='${req.body.asset_id}'
    `;
    db.query(assetQuery).then().catch();
    const updateQuery = `
        UPDATE request_info
        SET 
            status='assigned'
        WHERE id='${req.body.req_id}'
    `;
    db.query(updateQuery).then(dbRes => {
        res.json({
            error: false,
            status: "success",
            message: 'Asset request accepted successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}

const deleteAsset = (req, res, next) => {
    const query = `
        DELETE FROM asset_info
        WHERE id='${req.params.id}'
    `;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            message: 'Asset Deleted Successfully'
        });
    }).catch(dbErr => {
        next(dbErr);
    });
}


const AssetsSummary = (req, res, next) => {
    const query = `SELECT SUM(assigned) as assigned_sum,
                            SUM(quantity) as quantity_sum,
                            SUM(total_price) as total_price_sum,
                            SUM(pending) as pending_sum
                  FROM asset_info `;
    db.query(query)
    .then(dbRes => {
        res.json({
            error: false,
            asset_summary: dbRes.rows
        });
        // console.log(dbRes.rows)
    }).catch(dbErr => {
        next(dbErr);
    });
}

module.exports = {
    checkAssetId,
    getAllAssets,
    getAllRequest,
    getAssignedAsset,
    getRequestStatus,
    getAssetByID,
    addAsset,
    updateAsset,
    requestAsset,
    rejectRequest,
    acceptRequest,
    deleteAsset,
    AssetsSummary
};