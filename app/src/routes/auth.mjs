import { Router } from 'express';
import passport from 'passport';

const router = Router();

// POST /api/auth - Kullanıcı Girişi
// passport.authenticate middleware'i kimlik doğrulamayı yapar.
// Başarılı olursa, `request.user` nesnesini oluşturur ve bir sonraki adıma geçer.
router.post('/', passport.authenticate('local'), (request, response) => {
    response.status(200).json({ message: "Giriş başarılı.", user: request.user });
});

// GET /api/auth/status - Oturum Durumunu Kontrol Etme
router.get('/status', (request, response) => {
    if (request.isAuthenticated()) {
        return response.status(200).json({ message: "Giriş yapıldı.", user: request.user });
    }
    response.status(401).json({ message: "Oturum bulunamadı veya geçerli değil." });
});

// POST /api/auth/logout - Kullanıcı Çıkışı
router.post('/logout', (request, response, next) => {
    request.logout((err) => {
        if (err) { 
            return next(err); // Hata durumunda Express'in hata işleyicisine yönlendir.
        }
        request.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            response.clearCookie('connect.sid');
            response.status(200).json({ message: "Başarıyla çıkış yapıldı." });
        });
    });
});

export default router; 