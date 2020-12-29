const db = require('../util/database');
const { v4: uuidv4 } = require('uuid');


// use in Admin Dashbord Module & Manager Dashbord Module(Available) 
const AssetsSummary = (req, res, next) => {
    const query = `SELECT SUM(assigned) as assigned_sum,
                            SUM(quantity) as quantity_sum,
                            SUM(total_price) as total_price_sum,
                            SUM(pending) as pending_sum,
                            SUM(rejected) as rejected_sum
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
                     // *********** Admin *************
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
// Admin Asset Module
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
// Use in Admin Status Module 
const getAllRequest = (req, res, next) => {
    const query =  `SELECT  request_info.id as req_id,
                            request_info.employee as employee, 
                            request_info.quantity as req_quantity,
                            request_info.status as status,
                            asset_info.id as asset_id,
                            asset_info.title as title,
                            asset_info.category as category,
                            asset_info.assigned as assigned, 
                            asset_info.pending as pending,
                            asset_info.rejected as rejected,
                            user_info.name as manager
                    FROM    request_info, asset_info, user_info 
                    WHERE   request_info.manager_id = user_info.id and 
                            request_info.asset_id = asset_info.id`;
    db.query(query).then(dbRes => {
        res.json({
            error: false,
            assets: dbRes.rows
        });
    }).catch(dbErr => {
        res.json({
            error: true,
            message: "unable to perform action"
        })
        next(dbErr);
    });
}

// Use in Admin Status Module
const rejectRequest = (req, res, next) => {
    const assetQuery = `
        UPDATE asset_info
        SET 
            pending='${req.body.pending}',
            rejected= '${req.body.rejected}'
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
// Use in Admin Status Module
const acceptRequest = (req, res, next) => {
    const assetQuery = `
        UPDATE asset_info
        SET 
            assigned=${req.body.assigned},
            pending=${req.body.pending}
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
    // ********** Admin Ends here  ********
    // ********** Manager **************
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
// used in Manager Status Module and Manager Dashbord
const getRequestStatus = (req, res, next) => {
    const query = `SELECT asset_info.title as title, 
                          asset_info.category as category,
                          request_info.employee as employee, 
                          request_info.quantity as quantity, 
                          request_info.status as status
                   FROM   request_info, asset_info
                   WHERE  manager_id='${req.params.manager_id}' AND
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
// *********** Manager Ends here ************
module.exports = {
    checkAssetId,
    getAllAssets,
    getAllRequest,
    getRequestStatus,
    addAsset,
    updateAsset,
    requestAsset,
    rejectRequest,
    acceptRequest,
    deleteAsset,
    AssetsSummary
};