import express from 'express';
import dotenv from 'dotenv';
import userRouter from './src/routes/users.mjs';
import productRouter from './src/routes/products.mjs';
import mainpageRouter from './src/routes/mainpage.mjs';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// User Router'ını Ana Uygulamaya Tanıtma
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use("/", mainpageRouter);


app.listen(port, () => console.log(`Server is running on localhost:${port}`));

