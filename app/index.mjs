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
    secret: 'bertug',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000*60}
}))

// User Router'ını Ana Uygulamaya Tanıtma
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.get("/", (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;
    response.cookie("userId", "123", { signed: true });
    response.send("Signed cookie set.");
});



app.listen(port, () => console.log(`Server is running on localhost:${port}`));

