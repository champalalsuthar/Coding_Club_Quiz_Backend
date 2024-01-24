const express = require('express')
const app = express();
const user = require('./database/model/user')
const connection = require('./database/connection')
const cors = require('cors')
app.use(cors())
app.use(express.json())

app.post('/signup',(req ,res)=>{

    const {firstname , Lastname,email , password} = req.body

    user.findOne({email:email}).then((result)=>{
        
        if (result == null)
        {
            const newUser = new user({firstname:firstname ,Lastname:Lastname,email:email,password:password});
            newUser.save().then(()=>{
                res.send({code:200 ,message:"Register Succesfully"})
            }).catch((err)=>{
                res.send({code:400 ,massage:"server_error" })
    
            }) 

        }
        else{
            res.send({code:300 , message:"User already Register "})
        }

    })
    
    // const newUser = new user({firstname:firstname ,Lastname:Lastname,email:email,password:password});
    //     newUser.save().then(()=>{
    //         res.send({code:200 ,message:"register_succesfull"})
    //     }).catch((err)=>{
    //         res.send({code:400 ,massage:"server_error" })

    //     }) 

})

app.post('/signin',(req ,res)=>{
    const {email ,password} = req.body
    console.log(email)
    user.findOne({email:req.body.email}).then((result)=>{
        console.log(result)
        if (result.password == req.body.password)
        {
            res.send({code:200 , message:"sucessfull Login" ,"Username":result.firstname})
            console.log(result.firstname)
        }
        else{
            res.send({code:300 , message:"password does not match"})
        }

    }).catch((err)=>{
        res.send({code:400 ,message:"Email not register"})

    })
})






app.listen(5000,(()=>{
    console.log("Server set ")
}))