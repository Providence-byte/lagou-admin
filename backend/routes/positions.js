var express = require('express');
var router = express.Router();


const { addPositions, removePositions, list, updatePositions,listOne } = require('../controller/positions-c')
const uploadMiddleware = require('../middleware/upload')

router.post('/add', uploadMiddleware, addPositions);
router.delete('/remove', removePositions);
router.get('/list', list);
router.patch('/update', uploadMiddleware, updatePositions);
router.post('/listone',listOne);

module.exports = router;