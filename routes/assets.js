const express = require('express');
const router = express.Router();


const assetController = require('../controllers/assets');

router.get('/', assetController.getAllAssets);
router.get('/getAllRequest', assetController.getAllRequest);
router.get('/getAssignedAsset', assetController.getAssignedAsset);
router.put('/getRequestStatus/:id', assetController.getRequestStatus);
router.get('/AssetsSummary', assetController.AssetsSummary);

router.post('/', assetController.addAsset);
router.post('/getAssetByID', assetController.getAssetByID);
router.post('/updateAsset', assetController.updateAsset);
router.post('/requestAsset', assetController.requestAsset);

router.post('/rejectRequest', assetController.rejectRequest);
router.post('/acceptRequest', assetController.acceptRequest);

router.delete('/:id', assetController.checkAssetId, assetController.deleteAsset);

module.exports = router;
