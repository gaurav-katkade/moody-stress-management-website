//node
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require("mongoose");
// const { url } = require('inspector');
// const mailchimp = require("@mailchimp/mailchimp_marketing");

// mailchimp.setConfig({
//   apiKey: "3b7e828b5d88025c2d06b94ff6eca2a6-us12",
//   server: "us12",
// });
// mongodb+srv://gauravkatkade68:Gaurav%4012@moody.agjbahd.mongodb.net/moody?retryWrites=true&w=majority
try{
 mongoose.connect("mongodb://localhost:27017")
}
catch{
    (err)=>{
        console.log(err)
    }
}

const app = express();
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")))
console.log(path.join(__dirname,"public"));
// app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.urlencoded({extended:true}));

//connecting the model
const articleSchema = mongoose.Schema(
    {
        author:String,
        content:String
    }
)

const Article = mongoose.model("Article",articleSchema);

app.get('/',function(req,res){
   res.render("index.ejs",{});
 });

app.get('/signup',function(req,res){
    res.render("signup.ejs",{});
});

const myQuestion = ["l. In the last month, how often have you been upset because of something that happened unexpectedly?","2. In the last month, how often have you felt that you were unable to control the important things in our life?","3. In the last month, how often have you felt nervous and stressed?","4. In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "5. In the last month, how often have you felt that things were going your way?"
    ];

app.get("/moodtest",(req,res)=>{
    res.render('moodtest.ejs',{question:"(DEMO) CLICK ON ANY BUTTON TO START TEST"})
    
        // if(index < myQuestion.length){
        // res.render('moodtest.ejs',{question:myQuestion[index]});
        // }
        // else{
        //     res.render('index.ejs',{});
        // }
    
})

app.get("/article",(req,res)=>{
    Article.find({}).then(
        (items)=>{
            res.render('community.ejs',{Article:items})
        }).catch((err)=>{
            console.log(err);
        });
    
})
app.post("/article",(req,res)=>{
    console.log(req.body);
    content = new Article({
        author:req.body.Author,
        content : req.body.article

    })
    content.save();
    res.redirect("/article");
})

let index= 0;
let count = 0;
app.post("/moodtest",function(req,res){
    
    console.log(req.body);
    if(index < myQuestion.length){
        res.render('moodtest.ejs',{question:myQuestion[index++]});
        count = count + Number(req.body.checkbox); 
        console.log(req.body.checkbox);
        console.log("count "+count);
        }
        else{
            res.render('testresult.ejs',{score:count});
            index=0;
            count=0;
        }
    res.redirect("/moodtest");
})
app.post('/signup',function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email
    // console.log(fname);
    // console.log(lname);
    // console.log(req.body.email);

    const listId = "b83773db2d";
    const data = {
        members:[{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                  FNAME:firstName,
                  LNAME:lastName
                }
            }
            ]
    };

    const jsondata = JSON.stringify(data);
    const options={
        method:'POST',
        auth:'gauravk:3b7e828b5d88025c2d06b94ff6eca2a6-us12'
    }
    const url='https://us12.api.mailchimp.com/3.0/lists/b83773db2d'
    const request =https.request(url,options,function(response){
        response.on("data",function(data){
            console.log("Error GK : "+JSON.parse(data).error_count)
            if(JSON.parse(data).error_count===0){
            res.redirect('/');
            }
        else{
            res.send("fail");
        }
        });
         console.log(response);
        
    });
    
    request.write(jsondata);
    request.end();


});

app.listen(process.env.PORT || 3000,()=>{
    console.log("server started on the port 3000 ");
});

// 3b7e828b5d88025c2d06b94ff6eca2a6-us12
// ID
//  b83773db2d.

// 'https://<dc>.api.mailchimp.com/3.0/'

// const listId = "YOUR_LIST_ID";
// const subscribingUser = {
//   firstName: "Prudence",
//   lastName: "McVankab",
//   email: "prudence.mcvankab@example.com"
// };

// async function run() {
  

//   console.log(
//     `Successfully added contact as an audience member. The contact's id is ${
//       response.id
//     }.`
//   );
// }

// // run();


//     try{
//       const response = mailchimp.lists.addListMember(listId, {
//     email_address: subscribingUser.email,
//     status: "subscribed",
//     merge_fields: {
//       FNAME: subscribingUser.firstName,
//       LNAME: subscribingUser.lastName
//     }
//   });
//     res.send("<h1>Sign Up successFull<h1>");
// }catch(err){
//     console.log("My error occurd")
//     res.send("Something went wrong");
// }