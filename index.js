import express from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { app as app1 } from "./app1.js";
import { app as app2 } from "./app2.js";

dotenv.config();



const Start1 = () => {
    const PORT = process.env.AUTH1_PORT || 3000;

    try {
        app1.listen(PORT, () => {
            console.log('Сервер для аутентификации запущен на порте ' + PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

const Start2 = () => {
    const PORT = process.env.AUTH2_PORT || 3001;

    try {
        app2.listen(PORT, () => {
            console.log('Сервер авторизации запущен на порте ' + PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

Start1(); // Запускаем сервис аутентификации
Start2(); // Запускаем сервис авторизации