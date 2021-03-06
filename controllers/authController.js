const jwt = require('jsonwebtoken'),
      loginValidator = require('./../validators/loginValidator'),
      registerValidator = require('./../validators/registerValidator'),
      User = require('./../models/User'),
      bcrypt = require('bcrypt');
      

module.exports = {

            Login(req,res){
                const {email,pass} = req.body
                let validate = loginValidator({email,pass})
                let error = validate.error
                if(!validate.isValid){
                    res.status(400).json(error)
                }
                else{
                    User.findOne({email:email})
                    .then(user => {
                        if(user){
                            

                            if(bcrypt.compareSync(pass, user.pass)) {
                            let token = jwt.sign({_id: user._id,email:user.email,pass:user.pass,name:user.name,role:user.role,timestamp:user.timestamp},'SECRET',{expiresIn: '7d'})
                            res.status(200).json({token: `Bearer ${token}`,success:true})}
                            else{
                                res.status(400).json({pass:"passwords don't match"})
                            }
                        }
                        else{
                            res.status(400).json({error: "user was not found"})
                        }
                    }).catch(error=> res.status(404).json(error))
                }
            },

            Register(req,res){

                const {email,pass,name,image} = req.body
                let validate = registerValidator({name,email,pass})
                let error = validate.error
                if(!validate.isValid){
                    res.status(400).json(error)
                }
                else{

                    User.findOne({email:email})
                    .then(user => {
                        console.log(user)
                        if(user){
                            res.json({error:"User already exists!"})
                        }
                        else{
                            
                            let user = new User()
                            user.email = email;
                            user.name = name;
                            user.image = image;
                            let hash = bcrypt.hashSync(pass,10)
                            user.pass = hash;
                            user.save().then(User => res.json({User,success:true})).catch(error=> res.status(400).json(error))
                        }
                    })                    
                }
                
            },

            getUsers(req,res){
                User.find()
                .then(users => {
                    if(users){
                        res.json(users)
                    }
                    else{
                        res.json({message: "No Users Found!"})
                    }
                })
                .catch(error => res.status(400).json(error))
            }



}