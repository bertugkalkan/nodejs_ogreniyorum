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
        request.filteredData = users; // Not: filteredUsers yerine daha genel bir isim kullanmak daha iyi.
        return next();
    }
    const filteredUsers = users.filter(user => {
        return String(user[filter]).toLowerCase().includes(String(value).toLowerCase())
    });

    if (filteredUsers.length === 0) {
        return response.status(404).send('No users found');
    }

    request.filteredData = filteredUsers;
    next();
}

export { resolveProductIndex, resolveUserIndex, queryParser };