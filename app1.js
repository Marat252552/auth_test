import bodyParser from "body-parser";
import express from "express";
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import GetAuthRouter from "./src/routers/AuthRouter.js";
dotenv.config();

export const app = express();

let jsonBodyMiddleware = express.json();

const AuthRouter = GetAuthRouter();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(jsonBodyMiddleware);

app.use('/auth', AuthRouter);