const express = require("express");
const app = express();
const path = require('path');
const UserModel = require("./config/database");
const bcrypt = require("bcrypt");
const session = require('express-session');
const MongoStore= require('connect-mongo');
const passport = require("passport");
require("./config/passport");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view')); 


app.use(express.urlencoded({extended:true}));



app.use(session({
    secret :"keyboard cat",
    resave :false,
    saveUninitialized:true,
    store :MongoStore.create({mongoUrl : "mongodb://localhost:27017/passport" , collectionName:"sessions"}),
    cookie:{
        maxAge:1000*60
    }
}))

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());



app.get('/login', (req, res) => {
    res.render("login"); 
});


app.get('/register', (req, res) => {
    res.render("register");
});


app.post('/login',passport.authenticate('local',{successRedirect:'/protected'}) );


app.post('/register', async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let user = new UserModel({
        username: req.body.username,
       password :hashedPassword
    })

    user.save().then(user=>console.log(user));
    req.login(user ,function(err){
     if(err)
      return err;
    res.redirect('/protected')
    })
});


app.get('/auth/google', 
    passport.authenticate('google', { 
      scope: ['profile', 'email'] 
    })
  );
  
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }), 
    (req, res) => {
      res.redirect('/protected');
    }
  );









  app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) return next(err);
      
      req.session.destroy((err) => {
        if (err) return next(err);
        
        res.clearCookie('connect.sid', {
          path: '/',
          httpOnly: true,
          secure: false // or true if you're using HTTPS
        });
        
        res.redirect('/login');
      });
    });
  });
  

 


app.get('/protected', (req, res) => {
    if(req.isAuthenticated())
    {res.render("Protected"); }
    else
    {
        res.status(400).json({msg : "unauthorized user"})
    }
    });


    app.get('/user_data', (req, res) => {
        if ( req.isAuthenticated()) {
            res.send(req.user);
        } else {
            res.status(401).send('Unauthorized');
        }
    });
    




app.listen(5000, () => {
    console.log("listening to port 5000");

});
