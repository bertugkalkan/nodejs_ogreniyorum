import express from 'express';
import dotenv from 'dotenv';
import userRouter from './src/routes/users.mjs';
import productRouter from './src/routes/products.mjs';
import authRouter from './src/routes/auth.mjs';
import cartRouter from './src/routes/cart.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import './src/strategies/local-strategy.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser('BU-COK-GIZLI-BIR-ANAHTARDIR'));
app.use(session({
    secret: 'bertug',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000*60}
}))
app.use(passport.initialize());
app.use(passport.session());

// Router'ları Ana Uygulamaya Tanıtma
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);

app.get("/", (request, response) => {
    console.log('Session on root:', request.session);
    console.log('Session ID on root:', request.sessionID);
    request.session.visited = true;
    response.send("Welcome! Session has been initialized.");
});

app.listen(port, () => console.log(`Server is running on localhost:${port}`));

