const { notFound, errorHandler } = require('../middlewares/errorHandling');
const router = require('express').Router();

const { isAuth } = require('../middlewares');
const authApi = require('./auth');
const userApi = require('./user');


router.use("/auth", authApi);
router.use(isAuth);
router.use('/users', userApi);

router.use(notFound);
router.use(errorHandler);

module.exports = router;