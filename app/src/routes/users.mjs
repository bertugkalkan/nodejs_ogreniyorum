import { Router } from 'express';
import { validationResult } from 'express-validator';
import { createUserSchema, listQuerySchema } from '../utils/validationSchemas.mjs';
import { users } from '../utils/constants.mjs';
import { resolveUserIndex } from '../utils/middleware.mjs';

const router = Router();

// Rotalar
// GET /api/users
router.get('/', listQuerySchema, (request, response) => {
    // Session logları istendiği gibi korunuyor.
    console.log(request.session);
    console.log(request.sessionID);
    
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    // Filtreleme mantığı artık doğrudan bu fonksiyonun içinde.
    const { query: { filter, value } } = request;

    if (!filter || !value) {
        return response.status(200).json(users);
    }
    
    const filteredUsers = users.filter(user => {
        if (user[filter] === undefined) return false;
        return String(user[filter]).toLowerCase().includes(String(value).toLowerCase());
    });

    if (filteredUsers.length === 0) {
        return response.status(404).send({ message: 'No users found.' });
    }
    
    return response.status(200).send(filteredUsers);
});

// POST /api/users
router.post('/', createUserSchema, (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const { body: { name } } = request;
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    return response.status(201).send(newUser);
});

// GET /api/users/:id
router.get('/:id', resolveUserIndex, (request, response) => {
    const user = users[request.userIndex];
    return response.status(200).send(user);
});

// PUT /api/users/:id
router.put('/:id', resolveUserIndex,createUserSchema, (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    
    const { body, userIndex, userId } = request;
    users[userIndex] = { id: userId, ...body };
    return response.status(200).send(users[userIndex]);
});

// PATCH /api/users/:id
router.patch('/:id', resolveUserIndex, createUserSchema, (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const { body, userIndex } = request;
    users[userIndex] = { ...users[userIndex], ...body };
    return response.status(200).send(users[userIndex]);
});

// DELETE /api/users/:id
router.delete('/:id', resolveUserIndex,createUserSchema, (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    users.splice(request.userIndex, 1);
    return response.status(204).send();
});

export default router; 