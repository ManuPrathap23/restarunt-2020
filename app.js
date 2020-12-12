//jshint esversion:6

console.log("working");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");

const chinese = ["Hakka Noodles","Fried Rice","Dumplings","Sichuan Pork","Chow Mein"];
const italian = ["Pasta","Lasagne","Chips"];
const baked=["Pineapple Pastry","Choclate cake","Cookies"];

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/resDB" ,{ useNewUrlParser: true  ,useUnifiedTopology: true });

const customerSchema= new mongoose.Schema({
  username:String,
  name:String,
  password:String,
  preference:String,
  email:String,
});




const Customer= mongoose.model("customer",customerSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

 Customer.findOne({username:req.body.username},function(err,ele){
  if(err){
    console.log(err);
  }
  else if(ele){
    console.log(ele);
  console.log("exists");



  }
  else{
    const newCustomer=new Customer({
      username:req.body.username,
      name:req.body.name,
      password:req.body.password,
      preference:req.body.menu,
      email:req.body.email,
    });
    newCustomer.save();
    if(req.body.menu==="chinese")
    {
      res.render("menu",{dishes:chinese});
    }
      else if(req.body.menu==="italian")
      {
          res.render("menu",{dishes:italian});
      }
      else
      {
          res.render("menu",{dishes:baked});
      }
  }




});

});


app.get("/login",function(req,res){
  res.render("login");
})


app.post("/login",function(req,res){
  Customer.findOne({username:req.body.username,password:req.body.password},function(err,found){
    if(err){
      console.log(err);
    }
    else if(found){
      if(found.preference==="chinese"){
        res.render("menu",{dishes:chinese});
      }
      else if(found.preference==="italian"){
          res.render("menu",{dishes:italian});
      }
      else{
        res.render("menu",{dishes:baked});

      }
    }

  });
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
