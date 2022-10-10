import express from 'express';
import path from 'path';
import { intilizeDb }  from './database';
import loginRoutes from './app/login/routes';
import listRoutes from './app/list/routes';

import { authMiddleware } from './app/authentication/authentication';

const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/login', loginRoutes);
app.use('/list', authMiddleware, listRoutes)

app.get('/', (req, res) => {
    res.redirect('/login')
});

app.listen(PORT, async () => {
    console.log(`Server started on port: ${PORT}`);
    await intilizeDb();
})

