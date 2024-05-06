import { Router } from 'express';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/index.js';
import { fetchAllUsers, fetchUser } from '../controllers/index.js';
import { getUserValidation } from '../validators/index.js';

export default class UserAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        const router = this.router;

        router.get('/', authMiddleware(Object.values(ROLES)), fetchAllUsers);
        // router.get('/un-assigned', authMiddleware(Object.values(ROLES)), getUnassignedUsers);
        // router.get('/sub-ordinates', authMiddleware(Object.values(ROLES)), getListOfSubordinates);
        router.get('/:userId', authMiddleware(Object.values(ROLES)), getUserValidation, fetchUser);

        // router.put('/update/:userId', authMiddleware(Object.values(ROLES)), updateUser);

        // router.put('/assign-lead', authMiddleware(Object.values(ROLES)), assignLead);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}