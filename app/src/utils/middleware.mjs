import { products, users } from "./constants.mjs";

const resolveProductIndex = (request, response, next) => {
    const { params: { id } } = request;
    const productIndex = products.findIndex(product => product.id === parseInt(id));
    if (productIndex === -1) {
        return response.status(404).send('Product not found');
    }

    request.id = parseInt(id);
    request.productIndex = productIndex;
    next();
}

const resolveUserIndex = (request, response, next) => {
    const { params: { id } } = request;
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
        return response.status(404).send('User not found');
    }
    request.userIndex = userIndex;
    request.userId = parseInt(id);
    next();
};

const queryParser = (request, response, next) => {
    const { query: { filter, value } } = request;
    if (!filter || !value) {
        return response.status(200).json(users);
    }
    const filteredUsers = users.filter(user => {
        if (filteredUsers.length === 0) {
            return response.status(404).send('No users found');
        }
        return String(user[filter]).toLowerCase().includes(String(value).toLowerCase())
    });

    request.filteredUsers = filteredUsers;
    next();
}

export { resolveProductIndex, resolveUserIndex, queryParser };