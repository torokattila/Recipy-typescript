import express from 'express';
import { createConnection } from 'typeorm';
require('dotenv').config();
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import { User } from './Entities/User';
import { Recipe } from './Entities/Recipe';
import { authRouter } from './Routes/authRoute';
import { loginRouter } from './Routes/loginRoute';
import { registerRouter } from './Routes/registerRoute';
import { createRecipeRouter } from './Routes/createRecipeRoute';
import { getRecipesRouter } from './Routes/getRecipesRoute';
import { deleteRecipeRouter } from './Routes/deleteRecipeRoute';
import { editProfileRouter } from './Routes/editProfileRoute';
import { deleteProfileRouter } from './Routes/deleteProfileRoute';
const PORT = process.env.PORT || 3001;

app.use(express.json());

const init = async () => {
    try {
        await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User, Recipe],
            synchronize: true
        });

        console.log('Connected to mysql');

        app.use(
            cors({
                origin: ['http://localhost:3000'],
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
            })
        );

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(authRouter);
        app.use(loginRouter);
        app.use(registerRouter);
        app.use(createRecipeRouter);
        app.use(getRecipesRouter);
        app.use(deleteRecipeRouter);
        app.use(editProfileRouter);
        app.use(deleteProfileRouter);

        app.listen(PORT, () => {
            console.log(`App is listening on PORT ${PORT}`);
        })
    } catch (error) {
        console.log(error);
        throw new Error('Unabled to connect to mysql');
    }
}

init();
