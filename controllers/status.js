const db = require('../util/database');
 
//  *****************************Admin*******************************
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
//  ***************Manager status**************************
// used in Manager Status and Manager Dashbord Module
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
module.exports = {
    // admin
    getAllRequest,
    rejectRequest,
    acceptRequest,
    // manager
    getRequestStatus
};