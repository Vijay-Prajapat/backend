// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');
// const UserModel = require('./database'); // adjust path if needed

// passport.use(new LocalStrategy(async (username, password, done) => {
//   try {
//     const user = await UserModel.findOne({ username });

//     if (!user) {
//       return done(null, false, { message: 'Incorrect username.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return done(null, false, { message: 'Incorrect password.' });
//     }

//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
  //   try {
    //     const user = await UserModel.findById(id);
    //     done(null, user);
    //   } catch (err) {
      //     done(err);
      //   }
      // });
      
      
      
//  require('dotenv').config();
// const passport= require('passport')
// const bcrypt= require('bcrypt')
// const UserModel = require("./database")
// const LocalStrategy = require('passport-local').Strategy

// passport.use(new LocalStrategy(async(username , password, done)=>{
//   try{
//   const user= await UserModel.findOne({username});
//   if(!user)
//   {
//     return done(null, false, {message : "NO User Found !!"})
//   }
//   const isMatch = await bcrypt.compare(password, user.password);
  
//   if(!isMatch)
//   {
//   return done(null, false, {message :"Username or password is wrong !!"})
//   }
//   return done(null ,user)

//   }catch(err){
//     return done(err)
//   }
// }))



// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//   const username = profile.displayName;

  
//   try {
//     const user = await UserModel.findOne({ username });

//     if (!user) {
//       return done(null, false, { message: "NO User Found !!" });
//     }

//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }


// }));



// passport.serializeUser((user,done)=>{
//   return done(null,user.id);
// })

// passport.deserializeUser(async(id, done)=>{
//   try{
//       const user= await  UserModel.findById(id);
//       done(null,user);
//   }catch(err){
//     return done(err);
//   }
// })

require('dotenv').config;
const bcrypt= reuqire('bcrypt');
const passport= reuqire('possoprt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require("./database");

passport.use(new LocalStrategy(async(username, password, done)=>{

try
{
 
  const user = await UserModel.findOne({username});
  if(!user)
    return done(null,false,{message:"USER NOT FOUND"});

  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch)
    return done(null, false, {message: "username or password is incorrect"});

  return done(null,user);

}
catch(err)
{
  return done(err);
}



}));

passport.serializeUser((user, done)=>{
  return  done(null, user.id);
})

passport.derializeUSer(async(id , done)=>{
try{
 const user= UserModel.findById(id);
 if(user)
 {
  return done(null,user);
 }
}catch(err)
{
  return done(err);
}
})


passport.use(new GoogleStrategy({
  clientID:process.env.clientID,
  clientSecret:process.env.clientSecret,
  callbackURL:"auth/google/callback",

},async(accessToken, refreshToken, profile, done)=>{
 
 try{
  const username = profile.displayName;
 const user = await UserModel.findOne({username});

 if(!user)
   return done(null, false , {message:"User NOT FOUND "});

 
 return done(null, user);

 }catch(err)
 {
  return done(err);
 }


}))