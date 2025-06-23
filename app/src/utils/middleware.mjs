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

export { resolveProductIndex, resolveUserIndex };