import passport from 'passport';
import {Strategy} from 'passport-local';
import {users} from '../utils/constants.mjs';

export default passport.use(
    new Strategy((username, password, done) => {
        try {
            const user = users.find(user => user.name === username);
            if (!user) {
                throw new Error("Kullanıcı Bulunamadı.")
            }
            if (user.password !== password) {
                throw new Error("Hatalı Şifre.")
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
});
