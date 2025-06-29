import { Router } from 'express';
import { products } from '../utils/constants.mjs';
import { isAuthenticated } from '../utils/middleware.mjs';

const router = Router();

router.use(isAuthenticated);

// POST /api/cart - Sepete Ürün Ekleme
router.post('/', (request, response) => {
    const { body: { productId } } = request;
    const product = products.find(p => p.id === productId);

    if (!product) {
        return response.status(404).json({ message: "Ürün bulunamadı veya parametre hatalı." });
    }

    // Oturuma sepeti ekle/güncelle
    const cart = request.session.cart || [];
    cart.push(product);
    request.session.cart = cart;

    response.status(200).json({ message: "Ürün sepete eklendi.", cart: request.session.cart });
});

// GET /api/cart - Sepeti Görüntüleme
router.get('/', (request, response) => {
    const cart = request.session.cart || [];
    
    // Sepetin boş olması bir hata durumu değildir, bu yüzden 200 OK ile boş sepeti döndürebiliriz.
    response.status(200).json({ message: "Sepetiniz.", cart: cart });
});

export default router; 