import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


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

app.get('/api/users', (request, response) => {
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

app.post('/api/users', (request, response) => {
    const {
        body: {name}
    } = request;
    const newUser = {id: users.length + 1, name};
    users.push(newUser);
    return response.status(201).send(newUser);
});

app.get('/api/users/:id', (request, response) => {
    const user = users.find(user => user.id === parseInt(request.params.id));
    if (!user) {
        response.status(404).send('User not found');
    }
    return response.status(200).send(user);
})

app.get("/api/products", (request, response) => {
    const {
        query: {filter, value}
    } = request;
    
    if (!filter || !value) {
        return response.status(200).json(products);
    }

    const filteredProducts = products.filter(product => {
        if (product[filter] === undefined) {
            return response.status(400).send('Invalid filter');
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

