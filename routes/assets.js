const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assets');

// use in Admin Dashbord Module & Manager Dashbord Module
router.get('/AssetsSummary', assetController.AssetsSummary);
// Used in Manager and Admin for showing all assets list
router.get('/getAllAssets', assetController.getAllAssets); // CRUD -> R
 
// *********** Admin *************
// Admin Asset Module
router.post('/addAsset', assetController.addAsset);  // CRUD -> C
router.post('/updateAsset', assetController.updateAsset); // CRUD -> U
router.delete('/deleteAsset/:id', assetController.checkAssetId, assetController.deleteAsset); // CRUD -> D
// Admin Status Module
router.get('/getAllRequest', assetController.getAllRequest);
router.post('/rejectRequest', assetController.rejectRequest);
router.post('/acceptRequest', assetController.acceptRequest);
// ********** Admin Ends here  ********

// ********** Manager **************
// Manager Asset Module 
router.post('/requestAsset', assetController.requestAsset); // CRUD -> C
// used in Manager Status Module and Manager Dashbord
router.put('/getRequestStatus/:manager_id', assetController.getRequestStatus);
// *********** Manager Ends here ************

module.exports = router;
