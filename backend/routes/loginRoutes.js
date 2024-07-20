import express from "express";
import {login} from "../database/loginController.js"

const router = express.Router();

router.use((req, res, next) => {
    console.log(`LoginRoute accessed: ${req.originalUrl}`); // Log access to loginRoute
    next();
});

router.post('/', (req, res) => {
    console.log('Login POST route'); // Log every POST request to the login route
    login(req, res);
});

export default router;
