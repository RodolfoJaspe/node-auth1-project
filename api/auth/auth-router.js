// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

const router = require("express").Router()
const bcrypt = require("bcryptjs")
const Users = require("../users/users-model")
const { checkUsernameFree, checkUsernameExists } = require("./auth-middleware")

router.post("/register", checkUsernameFree ,async (req,res,next) => {
    try{
        const {username,password} = req.body
        const hash = bcrypt.hashSync(password,8)
        const user = {username,password:hash}
        const createdUser = await Users.add(user)
        console.log(createdUser)
        res.status(201).json(createdUser)
    }catch(err){
        next(err)
    }
    
})
router.post("/login", checkUsernameExists,async (req,res,next) => {
    try{
        const {username,password} = req.body
        const existing = await Users.findBy({username})
        if(existing && bcrypt.compareSync(password,existing.password)){
            // console.log(existing)
            req.session.user = existing
            res.status(200).json({message:`welcome ${existing.username}`})
        }else{
            res.status(404).json({message:"invalid Credentials!"})
        }

   }catch(err){
        next(err)
   } 
})
router.get("/logout", (req,res,next) => {
    if(req.session.user){
        req.session.destroy(err => {
            if(err){
                res.json({message:"there was an error on logout"})
            }else{
                res.json({message:"later!"})
            }
        })
    }else{
        res.json({message:"You are not logged in!"})
    }
})

module.exports = router
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
