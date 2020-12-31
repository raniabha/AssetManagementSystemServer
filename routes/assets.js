const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assets');
const statusController = require('../controllers/status');
const dashbordController = require('../controllers/dashbord');

// ********************Dashbord Module**********************
// use in Admin & Manager Dashbord Module
router.get('/AssetsSummary', dashbordController.AssetsSummary);


// ***************** Asset Module *************
// Used in Manager and Admin for showing all assets list
router.get('/getAllAssets', assetController.getAllAssets); // CRUD -> R
 // Admin Asset Module
router.post('/addAsset', assetController.addAsset);  // CRUD -> C
router.post('/updateAsset', assetController.updateAsset); // CRUD -> U
router.delete('/deleteAsset/:id', assetController.deleteAsset); // CRUD -> D
// Manager Asset Module 
router.post('/requestAsset', assetController.requestAsset); // CRUD -> C


// *********Status Module**********
//  admin status
router.get('/getAllRequest', statusController.getAllRequest);
router.post('/rejectRequest', statusController.rejectRequest);
router.post('/acceptRequest', statusController.acceptRequest);
// used in Manager status & Dashbord
router.put('/getRequestStatus/:manager_id', statusController.getRequestStatus);

module.exports = router;
