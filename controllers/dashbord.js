const db = require('../util/database');

// ******************Admin*******************
// use in Admin  & Manager Dashbord Module(Available) 
const AssetsSummary = (req, res, next) => {
    const query = `SELECT   SUM(assigned) as assigned_sum,
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
// ******************Manager*****************
// getRequestStatus---> this function  used in manager status module
// AssetsSummary----> this function used in admin dashbord module

module.exports = {
    AssetsSummary
};