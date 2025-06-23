import express from 'express';
import dotenv from 'dotenv';
import userRouter from './src/routes/users.mjs';
import productRouter from './src/routes/products.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser('BU-COK-GIZLI-BIR-ANAHTARDIR'));
app.use(session({
    secret: 'BU-COK-GIZLI-BIR-ANAHTARDIR',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000*60}
}))

// User Router'ını Ana Uygulamaya Tanıtma
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.get("/", (request, response) => {
    response.cookie("userId", "123", { signed: true });
    response.send("Signed cookie has been set! Now go to /profile to see it.");
});

app.get("/profile", (request, response) => {
    const { userId } = request.signedCookies;

    console.log('Regular Cookies (unsigned):', request.cookies);
    console.log('Signed Cookies (verified):', request.signedCookies);

    if (userId) {
        response.send(`Welcome to your profile, User #${userId}! Your identity is verified.`);
    } else {
        response.status(401).send("Access Denied. Your cookie is either missing or has been tampered with. Please visit the homepage to get a new one.");
    }
});

app.get("/clear-cookie", (request, response) => {
    response.clearCookie('userId');
    response.send('Cookie cleared');
})

app.listen(port, () => console.log(`Server is running on localhost:${port}`));

