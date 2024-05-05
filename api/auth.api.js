import { Router } from 'express';
import { login, register } from '../controllers/index.js';
import { loginValidation, registerValidation } from '../validators/index.js';

export default class AuthAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/register', registerValidation, register);
        this.router.post('/login', loginValidation, login);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}