import { Router } from "express";
import { validationResult } from "express-validator";
import { listQuerySchema } from "../utils/validationSchemas.mjs";
import { products } from "../utils/constants.mjs";
import { resolveProductIndex } from "../utils/middleware.mjs";



const router = Router();

router.get("/", listQuerySchema, (request, response) => {
    console.log(request.headers.cookie);
    console.log(request.cookies);
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
        // Yine de bir güvenlik katmanı olarak kalmasında sakınca yokmuş.
        if (product[filter] === undefined) {
            return false; 
        }
        return String(product[filter]).toLowerCase().includes(String(value).toLowerCase());
    });

    return response.status(200).send(filteredProducts); 
})

router.get("/:id", resolveProductIndex, (request, response) => {
    const { productIndex } = request;
    return response.status(200).send(products[productIndex]);
})


export default router;