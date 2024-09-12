import bodyParser from "body-parser";
import express from "express";
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import validator from "./src/helpers/Validator.js";
import jwt from "jsonwebtoken";
dotenv.config();

export const app = express();

let jsonBodyMiddleware = express.json();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(jsonBodyMiddleware);

app.post('/validateAccessToken', async (req, res) => {
    await validator(res, () => {
        validateAccesToken();
        sendSuccessResponse();


        function validateAccesToken() {
            const AccessToken = req.headers.authorization.split(" ")[1];

            if (!AccessToken) {
                res.status(400).json("Токен не передан");
                throw new Error("handledError");
            }

            let decryptedToken;

            try {
                decryptedToken = jwt.verify(AccessToken, process.env.JWT_ACCESS_KEY);
            } catch(e) {
                console.log(e);
                res.status(400).json({success: false, message: "Токен недействителен"});
                throw new Error("handledError");
            }
            
            const { login } = decryptedToken;

            return login;
        }

        function sendSuccessResponse() {
            const jsonResponse = {
                success: true
            }

            res
                .status(200)
                .json(jsonResponse)
        }
    })
});