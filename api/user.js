const router = require('express').Router();
const {
    getUser,
    updateUser,
    getAllUsers,
} = require('../controller/user');

router.get('/me', getUser);
router.get('/', getAllUsers);
router.put('/update/me', updateUser);

module.exports = router;