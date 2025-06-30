import passport from 'passport';
import {Strategy} from 'passport-local';
import User from '../mongoose/schema/user.mjs';

export default passport.use(
    new Strategy(async (username, password, done) => {
        console.log(`Kimlik doğrulanıyor: ${username}`);
        
        const user = await User.findOne({ name: username });
        
        // 1. Kullanıcı bulunamadı mı? Bu bir hata değil, bir "başarısızlık" durumudur.
        if (!user) {
            // "Hata yok (null), kullanıcı doğrulaması başarısız (false), mesajım da bu."
            return done(null, false, { message: 'Böyle bir kullanıcı bulunamadı.' });
        }
        
        // 2. Şifre yanlış mı? Bu da bir "başarısızlık" durumudur.
        if (user.password !== password) {
            // "Hata yok (null), kullanıcı doğrulaması başarısız (false), mesajım da bu."
            return done(null, false, { message: 'Girilen şifre hatalı.' });
        }
        
        // 3. Her şey yolunda mı? Bu bir "başarı" durumudur.
        // "Hata yok (null), işte bulduğum kullanıcı nesnesi (user)."
        return done(null, user);
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("Kullanıcı Bulunamadı.")
    }
    done(null, user);
});
