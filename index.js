const express = require('express')
const app = express();
const user = require('./database/model/user')
const connection = require('./database/connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const jWT_SECRET = "0";

app.use(cors(
    {
        origin: "https://cuhcodingclub.vercel.app",
        credentials: true
        // sameSite:'none'
    }
));

// app.use(cors({ origin: '*' }));
app.use(express.json())

app.post('/signup', async (req, res) => {

    const { firstname, Lastname, email, password } = req.body
    const encryptedpassword = await bcrypt.hash(password, 10);

    user.findOne({ email: email }).then((result) => {

        if (result == null) {
            const newUser = new user({ firstname: firstname, Lastname: Lastname, email: email, password: encryptedpassword });
            newUser.save().then(() => {
                res.send({ code: 200, message: "Register Succesfully" })
            }).catch((err) => {
                res.send({ code: 400, massage: "server_error" })

            })

        }
        else {
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
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    // console.log(email);

    user.findOne({ email: email }).then((result) => {
        if (result) {
            // Compare the password using bcrypt.compare
            bcrypt.compare(password, result.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    // console.log(result.email);
                    const tokenPayload = {
                        email: result.email,
                    };

                    const token = jwt.sign(tokenPayload, jWT_SECRET);
                    // console.log(token);
                    result.password = undefined;

                    res.send({
                        code: 200,
                        data: { result },
                        token: token,
                        // Username: result.firstname,
                        message: "Successful Login"
                    });
                    // console.log(result.firstname);
                } else {
                    res.send({
                        code: 300,
                        message: "Incorrect Password"
                    });
                }
            });
        } else {
            res.send({
                code: 400,
                message: "Email not registered"
            });
        }
    }).catch((err) => {
        res.send({
            code: 500,
            message: "Internal Server Error"
        });
    });
});


app.post('/validateToken', (req, res) => {
    const token = req.body.token;

    try {
        // Verify and decode the token
        const decodedToken = jwt.verify(token, jWT_SECRET);

        // Extract user details from the decoded token
        const userEmail = decodedToken.email;
        // console.log("decodedToken")
        // console.log(decodedToken);

        // console.log("userEmail");
        // console.log(userEmail);

        user.findOne({ email: userEmail }).then((userData) => {
            // console.log("user1");
            if (userData) {
                // console.log("2");
                userData.password = undefined;
                res.status(200).json({ code: 200, data: userData });
            } else {
                // console.log("3");
                res.status(404).json({ code: 404, message: 'User not found' });
            }
        }).catch((err) => {
            // console.log("4");
            res.status(500).json({ code: 500, message: 'Internal Server Error' });
        });
    } catch (err) {
        // console.log("5");
        res.status(401).json({ code: 401, message: 'Invalid token' });
    }
    // console.log("6");
});

// app.post('/validateToken', async (req, res) => {
// app.post('/validateToken', async (req, res) => {
//     console.log(req.body); // Log the request body to the console
//     const token = req.body.token;

//     try {
//         const decodedToken = jwt.verify(token, jWT_SECRET);

//         console.log(' Token:', token);
//         console.log('Decoded Token:', decodedToken);
//         const useremail = decodedToken.email;

//         const userData = await user.findOne({ email: useremail });

//         if (userData) {
//             res.status(200).json({ code: 200, data: userData });
//         } else {
//             res.status(404).json({ code: 300, data: "User not found" });
//         }
//     } catch (err) {
//         res.status(400).json({ code: 400, data: err.message });
//     }
// });

// app.post('/validateToken', (req, res) => {
//     const token = req.body.token;  // Retrieve the token from req.body.token
//     try {
//         const user = jwt.verify(token, jWT_SECRET);
//         const useremail = user.email;
//         user.findOne({ email: useremail })
//             .then((data) => {
//                 res.send({ code: 200, data: data });
//             })
//             .catch((err) => {
//                 res.send({ code: 300, data: err });
//             });
//     } catch (err) {
//         // Handle token verification errors
//         res.send({ code: 400, data: err });
//     }
// });

// app.post('/validateToken',(req,res)=>{
//     const token=req.body.token;
//     try {
//         const user=jwt.verify(token,jWT_SECRET);
//         const useremail=user.email;
//         user.findOne({email:useremail}).then((data)=>{
//             res.send({code:200,data:data});
//         }).catch((err)=> {
//             res.send({code:300,data:err});
//         })
//     } catch(err) {}
// });

// app.post('/signin', (req, res) => {
//     const { email, password } = req.body;
//     // console.log(email);

//     user.findOne({ email: email }).then((result) => {
//         if (result) {
//             // Compare the password using bcrypt.compare
//             bcrypt.compare(password, result.password, (err, isMatch) => {
//                 if (err) {
//                     throw err;
//                 }
//                 if (isMatch) {
//                     res.send({
//                         code: 200,
//                         Username: result.firstname,
//                         message: "Successful Login"
//                     });
//                     // console.log(result.firstname);
//                 } else {
//                     res.send({
//                         code: 300,
//                         message: "Password does not match"
//                     });
//                 }
//             });
//         } else {
//             res.send({
//                 code: 400,
//                 message: "Email not registered"
//             });
//         }
//     }).catch((err) => {
//         res.send({
//             code: 500,
//             message: "Internal Server Error"
//         });
//     });
// });

// if (await bcrypt.compare(password, user.password)) {

// app.post('/signin', (req, res) => {
//     const { email, password } = req.body
//     console.log(email)

//     user.findOne({ email: email }).then((result) => {
//         console.log(result)
//         if (result) {
//             const data=bcrypt.compare(password, user.password) ;
//             // => {
//                 if (data) {
//                     res.send({ code: 200, message: "sucessfull Login", "Username": result.firstname })
//                     console.log(result.firstname)
//                 }
//                 else {
//                     res.send({ code: 300, message: "password does not match" })
//                 }

//             // });
//         }
//         else {
//             res.send({ code: 400, message: "Email not register" })
//         }
//     }).catch((err) => {
//         res.send({
//             code: 500,
//             message: "Internal Server Error"
//         });
//     });
// });

app.get('/', (req, res) => {
    res.send({message:"everything is fine "})
})





app.listen(5000,(()=>{
    console.log("Server set ")
}))
