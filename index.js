const express = require('express')
const app = express();
const user = require('./database/model/user')
const u1 = require('./database/model/u1')
const quizsstore = require('./database/model/quizsstore')
const connection = require('./database/connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const jWT_SECRET = "0";
const UserResult = require('./database/model/UserResult');
const UserComment = require('./database/model/Comment');
const nodemailer = require("nodemailer");

app.use(cors(
    {
        // origin: "http://localhost:3000",
        origin: "https://cuhcodingclub.vercel.app",
        credentials: true
        // sameSite:'none'
    }
));

// app.use(cors({ origin: '*' }));
app.use(express.json())
app.post("/submit-form", async (req, res) => {

    // try {
    //     const { name, email, message } = req.body;
    //     const newfeedback = new feedback({
    //         name, email, message
    //     });
    //     await newfeedback.save();
    //     res.status(200).json({ message: 'User result saved successfully' })

    // } catch (error) {
    //     console.error('Error saving user result:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }

    // Create a Nodemailer transporter
    // let transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: "", // Replace with your Gmail address
    //         pass: "", // Replace with your Gmail password
    //     },
    // });

    // // Email content
    // let mailOptions = {
    //     from: `${email}`, // Sender address
    //     to: "", // Receiver address
    //     subject: "New Contact Form Submission",
    //     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    // };

    // // Send email
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log(error);
    //         res.status(500).send("Error sending email");
    //     } else {
    //         console.log("Email sent: " + info.response);
    //         res.send("Form submitted successfully");
    //     }
    // });
});


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
            res.send({ code: 300, message: "User already Register " })
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
app.post('/allquizes', async (req, res) => {
    try {
        const allQuizData = await quizsstore.find();


        res.json(allQuizData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

    // try{
    //     console.log(quizstore);
    //     res.status(200).json({code:200,data:quizstore});
    // }catch (err) {
    //     // console.log("5");
    //     res.status(401).json({ code: 401, message: "error" });
    // }
});
app.delete('/deletequiz', async (req, res) => {
    const { id } = req.query;
    console.log(id);

    try {
        console.log('Deleting quiz with ID:', _id);
        // Use Mongoose to find and remove the quiz by ID
        const deletedQuiz = await quizsstore.findOneAndDelete({ _id: id });

        if (!deletedQuiz) {
            console.log("Quiz not found");
            return res.status(404).json({ message: 'Quiz not found' });
        }

        console.log('Quiz deleted successfully');
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/:quizId', async (req, res) => {
    const _id = req.params;

    try {
        // Use Mongoose to find and remove the quiz by ID
        console.log(_id);
        const deletedQuiz = await quizsstore.findByIdAndDelete(_id);

        if (!deletedQuiz) {
            console.log("404");
            return res.status(404).json({ message: 'Quiz not found' });
        }
        console.log("done");
        res.json({ message: 'Quiz deleted successfully', deletedQuiz });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// app.post('/allquizes/:id', async (req, res) => {
//     try {

//         const quizId = req.params.id;
//         console.log(quizId);
//         // Query the database to get all quiz data
//         const QuizData = await quizsstore.find({ _id : quizId });

//         // Send the all quiz data as the response
//         console.log(QuizData)
//         res.json(QuizData);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }

//     // try{
//     //     console.log(quizstore);
//     //     res.status(200).json({code:200,data:quizstore});
//     // }catch (err) {
//     //     // console.log("5");
//     //     res.status(401).json({ code: 401, message: "error" });
//     // }
// });

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
// app.post('/createquiz', (req, res) => {
//     const { tittle, questions } = req.body;
//     console.log(tittle);
//     console.log(questions);
//     const newquiz=new quizstore({tittle:tittle,Questions:questions})
//     newquiz.save().then(()=>{
//         console.log("data saved ");
//     }).catch(()=>{
//         console.log(err);
//     })
//     res.send({ message: "ok " });
// })




app.post('/createquiz', (req, res) => {
    const { title, questions, name, userId } = req.body;
    // console.log(title);
    // console.log(questions);
    const newquiz = new quizsstore({ title: title, Questions: questions, userfullname: name, userid: userId })
    newquiz.save().then(() => {
        console.log("new quiz data saved");
        res.send({ code: 200, data: newquiz, message: "quiz created" });
    }).catch(() => {
        console.log(err);
        res.send({ code: 202, message: "error in creating quiz" });
    })

})

app.post('/saveUserResult', async (req, res) => {
    try {
        const { userId, quizid, username, quizTitle, score, numberOfQuestions } = req.body;

        // Check if there are existing user results for the provided userId and quizid
        const existingUserResult = await UserResult.findOne({ userId, quizid });

        if (existingUserResult) {
            // If existing user result found, update the score
            existingUserResult.score = score;
            await existingUserResult.save();
        } else {
            // If no existing user result found, save a new user result
            const newUserResult = new UserResult({
                userId,
                quizid,
                username,
                quizTitle,
                score,
                numberOfQuestions,
            });
            await newUserResult.save();
        }

        res.status(200).json({ message: 'User result saved successfully' })
    } catch (error) {
        console.error('Error saving user result:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/userAllResults', async (req, res) => {
    const { userId } = req.body;

    try {
        const userResults = await UserResult.find({ userId: userId });

        if (!userResults || userResults.length === 0) {
            return res.status(404).json({ message: 'No user results found for the specified user ID' });
        }

        res.status(200).json(userResults);
    } catch (error) {
        console.error('Error fetching user results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/leaderboard', async (req, res) => {
    const { quizid } = req.body;

    try {
        // const leaderboarddata = await UserResult.find({ quizid: quizid });
        const leaderboarddata = await UserResult.find({ quizid }).sort({ score: -1 });

        // if (!leaderboarddata || leaderboarddata.length === 0) {
        //     return res.status(404).json({ message: 'No user results found for the specified user ID' });
        // }

        res.status(200).json(leaderboarddata);
    } catch (error) {
        console.error('Error fetching user results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.post('/AllCreatedQuizzes', async (req, res) => {
    const { userId } = req.body;

    try {
        const userQuizes = await quizsstore.find({ userid: userId });

        if (!userQuizes || userQuizes.length === 0) {
            return res.status(404).json({ message: 'No user results found for the specified user ID' });
        }

        res.status(200).json(userQuizes);
    } catch (error) {
        console.error('Error fetching user results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// app.post('/allquizes', (req, res) => {
//     const { title, questions } = req.body;
//     // console.log(title);
//     // console.log(questions);
//     const newquiz=new quizsstore({title:title,Questions:questions})
//     newquiz.save().then(()=>{
//         console.log("new quiz data saved");
//         res.send({code:200,data:newquiz, message: "quiz created" });
//     }).catch(()=>{
//         console.log(err);
//         res.send({code:202, message: "error in creating quiz" });
//     })

// })



//comment add
// POST route to add a new comment
app.post('/comment', async (req, res) => {
    try {
        const { userid, quizid, Comment, firstname, Lastname } = req.body;
        const newComment = new UserComment({ userid, quizid, Comment, firstname, Lastname });
        // console.log(newComment);
        await newComment.save();
        console.log("Comment added successfully");
        res.json({ code: 200, success: true, message: "Comment added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to add comment" });
    }
});

app.post('/comments', async (req, res) => {
    const { quizid } = req.body;

    try {
        // const commentsdata = await UserComment.find({ quizid: quizid });
        const commentsdata = await UserComment.find({ quizid: quizid }).sort({ createdAt: -1 });

        // const commentsdata = await UserResult.find({ quizid }).sort({ score: -1 });
        console.log(commentsdata);
        res.status(200).json(commentsdata);
    } catch (error) {
        console.error('Error fetching user comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/', (req, res) => {
    res.send({ message: "everything is fine " })
})


app.listen(5000, (() => {
    console.log("Server set ")
}))
