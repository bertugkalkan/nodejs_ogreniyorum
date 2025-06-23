import { body, query } from 'express-validator';

export const createUserSchema = [
    body('name')
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
        .isString().withMessage('Name must be a string'),
];

// Hem kullanıcılar hem de ürünler için kullanılabilecek tek, güçlü ve merkezi bir şema
export const listQuerySchema = [
    query().custom((value, { req }) => {
        const { filter, value: filterValue } = req.query;

        // Kural 1: filter ve value ya ikisi de olmalı ya da ikisi de olmamalı.
        if ((filter && !filterValue) || (!filter && filterValue)) {
            throw new Error('filter and value query parameters must be provided together.');
        }

        // Kural 2: Eğer filtreleme yapılıyorsa, kuralları uygula.
        if (filter) {
            // Kural 2a: filter'ın geçerli bir anahtar olup olmadığını kontrol et.
            if (!['id', 'name'].includes(filter)) {
                throw new Error('Invalid filter key. Must be "id" or "name".');
            }
            // Kural 2b: filter "id" ise, value'nun sayısal olmasını kontrol et.
            if (filter === 'id' && !/^\d+$/.test(filterValue)) {
                throw new Error('Value must be a numeric string when filtering by id.');
            }
        }
        
        // Tüm kontrollerden geçerse, doğrulama başarılıdır.
        return true;
    })
]; 