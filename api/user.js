const router = require('express').Router();
const {
    getUser,
    updateUser,
    getAllUsers,
    logout
} = require('../controller/user');

router.get('/me', getUser);
router.get('/', getAllUsers);
router.put('/update/me', updateUser);
router.delete('/logout', logout);

module.exports = router;