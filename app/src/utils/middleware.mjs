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

const isAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }
    response.status(401).json({ message: "Bu işlemi yapmak için giriş yapmalısınız." });
};

export { resolveProductIndex, resolveUserIndex, isAuthenticated };