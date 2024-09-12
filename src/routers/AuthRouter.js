import jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcrypt';
import { Router } from "express";
import validator from '../helpers/Validator.js';

const db = {};

const generateTokens = (payload) => {
    let AccessKey = process.env.JWT_ACCESS_KEY;
    let RefreshKey = process.env.JWT_REFRESH_KEY;

    let AccessToken = jwt.sign(payload, AccessKey, { expiresIn: '30m' })
    let RefreshToken = jwt.sign(payload, RefreshKey, { expiresIn: '30d' })

    return { AccessToken, RefreshToken }
}

class Controller {
    async signin(req, res) {
        await validator(res, () => {
            const { login, password } = req.body;
            
            ensureFields(login, password);
            ensureLoginNotTaken(login);
            saveUser(login, password);
            sendSuccessResponse(login);


            function ensureFields(login, password) {
                if (!login || !password) {
                    res.status(400).json({ message: 'Заполнены не все поля' });
                    throw new Error("handledError");
                };
            }

            function ensureLoginNotTaken(login) {
                const isLoginTaken = !!db[login];

                if (isLoginTaken) {
                    res.status(400).json({ message: 'Логин уже занят' });
                    throw new Error("handledError");
                };
            }

            function saveUser(login, password) {
                const hashedPassword = hashSync(password, 5);

                db[login] = {login, password: hashedPassword};
            }

            function sendSuccessResponse(login) {
                const { AccessToken, RefreshToken } = generateTokens({ login });

                const jsonResponse = {
                    user: { login },
                    AccessToken
                };

                res.status(201);
                res.cookie('refresh_token', RefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                    .json(jsonResponse);
            }
        })
    }

    async login(req, res) {
        await validator(res, () => {
            const { login, password } = req.body;
            
            ensureFields(login, password);
            ensureUserExists(login, password);
            sendSuccessResponse(login);

            
            function ensureFields(login, password) {
                if (!login || !password) {
                    res.status(400).json({ message: 'Заполнены не все поля' });
                    throw new Error("handledError");
                };
            }

            function ensureUserExists(login, password) {
                const user = db[login];

                if (!user) {
                    res.status(400).json({ message: 'Пользователя с таким логином нет' });
                    throw new Error("handledError");
                };

                const isPasswordValid = compareSync(password, user.password);
                
                if (!isPasswordValid) {
                    res.status(400).json({ message: 'Пароль неверный' });
                    throw new Error("handledError");
                }
            }

            function sendSuccessResponse(login) {
                const { AccessToken, RefreshToken } = generateTokens({ login });

                const jsonResponse = {
                    user: { login },
                    AccessToken
                };

                res
                    .status(200)
                    .cookie('refresh_token', RefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                    .json(jsonResponse)
            }
        })
    }

    async refresh(req, res) {
        await validator(res, () => {
            const login = parseRefreshToken();

            ensureUserExists(login);
            sendSuccessResponse(login);


            function parseRefreshToken() {
                const OldRefreshToken = req.cookies.refresh_token;

                if (!OldRefreshToken) {
                    res.sendStatus(400);
                    throw new Error("handledError");
                }

                const decryptedToken = jwt.verify(OldRefreshToken, process.env.JWT_REFRESH_KEY);
                
                if (!decryptedToken) {
                    res.sendStatus(400);
                    throw new Error("handledError");
                }

                const { login } = decryptedToken;

                return login;
            }

            function ensureUserExists(login) {
                let DoesUserExist = !!db[login];

                if (!DoesUserExist) {
                    res.status(400).json({ message: 'Пользователя с таким логином нет' });
                    throw new Error("handledError");
                }
            }

            function sendSuccessResponse(login) {
                const { AccessToken, RefreshToken } = generateTokens({ login })
                const jsonResponse = {
                    user: { login },
                    AccessToken
                }

                res
                    .status(200)
                    .cookie('refresh_token', RefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                    .json(jsonResponse)
            }
        })
    }
}


const GetAuthRouter = () => {
    const router = Router();
    router.post('/signin', new Controller().signin);
    router.post('/login', new Controller().login);
    router.get('/refresh', new Controller().refresh);
    return router;
}

export default GetAuthRouter;


