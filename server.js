const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const URL="mongodb://localhost/Users";
mongoose.connect(URL,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true
})


const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const USER=mongoose.model('user',schema);
const app=express();
const port=process.env.PORT || 8081;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send({message:'In new Application'});
})
app.post('/users',(req,res)=>{
    const user=new USER({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    user.save().then((result)=>res.json(result));
})

app.post('/userverify',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(404).json({message:'Please provide the credentials'});
        return;
    }
    USER.find({email:email,password:password},(err,result)=>{
        if(err || result.length===0){
            res.status(404).json({message:'Invalid Credentails'});
            return;
        }
        res.json(result);
    })
})
app.listen(port);
