import express from 'express';
import dotenv from 'dotenv';
import { query, body, validationResult } from 'express-validator';
import { createUserSchema, listQuerySchema } from './utils/validationSchemas.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const resolveUserIndex = (request, response, next) => {
    const {
        params: {id}
    } = request;

    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
        return response.status(404).send('User not found');
    }
    request.userIndex = userIndex;
    request.userId = parseInt(id);
    next();
}
const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'John Smith' },
    { id: 4, name: 'Jane Smith' },
]

const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
]

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/users', listQuerySchema, (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const {
        query: {filter, value}
    } = request;

    // Eğer filter ve value parametreleri yoksa tüm kullanıcıları döndür
    if (!filter || !value) {
        return response.status(200).json(users);
    }

    // Filtreleme işlemi
    const filteredUsers = users.filter(user => {
        if (user[filter] === undefined) {
            return false;
        }
        return String(user[filter]).toLowerCase().includes(String(value).toLowerCase());
    });

    return response.status(200).send(filteredUsers);
});

app.post('/api/users', createUserSchema, (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const {
        body: {name}
    } = request;
    const newUser = {id: users.length + 1, name};
    users.push(newUser);
    return response.status(201).send(newUser);
});

app.get('/api/users/:id', resolveUserIndex, (request, response) => {
    const { userIndex } = request;
    const user = users[userIndex]
    if (!user) {
        return response.status(404).send('User not found');
    }
    return response.status(200).send(user);
})

app.put('/api/users/:id', resolveUserIndex, (request, response) => {
    const {
        body,
        userIndex,
        userId
    } = request;
    // PUT: Kaynağı tamamen body ile değiştirir. ID'nin değişmemesini sağlar.
    users[userIndex] = {id: userId, ...body };
    return response.status(200).send(users[userIndex]);
})
app.patch('/api/users/:id', resolveUserIndex, (request, response) => {
    const {
        body,
        userIndex,
    } = request;
    
    // PATCH: Var olan kaynağın üzerine sadece body'de gelen alanları ekler/günceller.
    users[userIndex] = { ...users[userIndex], ...body };
    return response.status(200).send(users[userIndex]);
})
app.delete('/api/users/:id', resolveUserIndex, (request, response) => {
    const { userIndex } = request;
   
    users.splice(userIndex, 1);
    return response.status(204).send();
})
 

app.get("/api/products", listQuerySchema, (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const {
        query: {filter, value}
    } = request;
    
    if (!filter || !value) {
        return response.status(200).json(products);
    }

    const filteredProducts = products.filter(product => {
        // Bu kontrol artık büyük ölçüde gereksiz çünkü validation katmanı
        // 'id' ve 'name' dışında bir key gelmesini engelleyecektir.
        // Yine de bir güvenlik katmanı olarak kalmasında sakınca yok.
        if (product[filter] === undefined) {
            return false; 
        }
        return String(product[filter]).toLowerCase().includes(String(value).toLowerCase());
    });

    return response.status(200).send(filteredProducts);
})

app.get("/api/products/:id", (req, res) => {
    const product = products.find(product => product.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).send('Product not found');
    }
    return res.status(200).send(product);
})


app.listen(port, () => console.log(`Server is running on localhost:${port}`));

