const {Strategy: JwtStrategy,ExtractJwt}=require('passport-jwt');
const User=require('../models/user');
require('dotenv').config();

module.exports=function(passport){
    const opts={}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey=process.env.SECRET_KEY
    passport.use(new JwtStrategy(opts, async(jwt_payload,done)=>{
        try{
            const user=await User.findById(jwt_payload.id);
            if (!user){
                return done(null,false,{message:'user not found!'})
            }
            return done(null,user);
        }catch(err){
            return done(err,false);
        }
    }));
}
