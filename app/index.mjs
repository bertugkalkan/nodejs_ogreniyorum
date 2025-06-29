import express from 'express';
import dotenv from 'dotenv';
import userRouter from './src/routes/users.mjs';
import productRouter from './src/routes/products.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {users, products} from './src/utils/constants.mjs';
import passport from 'passport';
import {Strategy} from 'passport-local';
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

app.post("/api/auth", passport.authenticate('local'), (request, response) => {response.json({message: "Giriş yapıldı.", Kullanıcı: request.user})});

app.get("/api/auth/status", (request, response) => {
    if (request.isAuthenticated()) {
        return response.json({message: "Giriş yapıldı.", Kullanıcı: request.user})
    }
    response.json({message: "Giriş yapılmadı."})
})

app.post("/api/auth/logout", (request, response) => {
    request.logout((err) => {
        if (err) {
            return response.status(500).json({message: "Çıkış yapılırken bir hata oluştu."})
        }
        response.json({message: "Çıkış yapıldı."})
    });
})

app.post("/api/cart", (request, response) => {
    const {
        body: {productId}
    } = request;
    const product = products.find(product => product.id === productId);
    if (!product) {
        return response.status(404).json({message: "Ürün bulunamadı."})
    }
    if (!request.session.cart) {
        request.session.cart = [];
    }
    request.session.cart.push(product);
    response.json({message: "Ürün sepete eklendi."})
})

app.get("/api/cart", (request, response) => {
    if (!request.isAuthenticated()) {
        return response.status(401).json({message: "Giriş yapınız."})
    }
    if (!request.session.cart) {
        return response.status(404).json({message: "Sepetiniz boş."})
    }
    response.json({message: "Sepetiniz.", sepet: request.session.cart})
})

app.listen(port, () => console.log(`Server is running on localhost:${port}`));

