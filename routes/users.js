var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var async = require("async");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var CONN_DB_STR = "mongodb://localhost/project";
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function(req, res) {
  var postData = req.body;
  var findData = function(db,callback){
    var student = db.collection("student");
    var data = {userid:postData.userid,password:postData.password};
    student.find(data).toArray((err,result)=>{
      if(err) throw err;
      callback(result);
    }) 
  }
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err){
      res.send("数据库错误");
      console.log(err);
    }else{
      console.log("数据库连接成功");
      findData(db,(result)=>{
        console.log("查询成功");
        if(result.length>0){
          console.log(postData.userid);
          res.cookie('id',postData.userid, { expires: new Date(Date.now() + 9000000000000)});
          console.log(req.cookies.id);
          res.redirect("/main");  
        }else{
          res.send(`<script>alert('用户名或密码错误');location.href='/'</script>`);
          db.close();
        }
      })
    }
  })
});
router.post('/register',function(req,res){
  var userid=req.body.userid;
  var password=req.body.password;
  var username=req.body.username;
  var college=req.body.college;
  var clas=req.body.clas;
  var phone=req.body.phone;
  var ide=req.body.ide;
  var address=req.body.address;
  var object=req.body.object;
  var insertData = function(db,callback){
      var student = db.collection("student");
      async.waterfall([
        function(callback){
          student.find({userid:userid}).toArray((err,result)=>{
            if(err) throw err;
            if(result.length>0){
              callback(null,true);
            }else{
              callback(null,false);
            }
          })
        },
        function(arg,callback){
          if(!arg&&userid!=''&&password!=''&&username!=''&&college!=''&&clas!=''&&phone!=''&&ide!=''&&address!=''&&object!=''){
            console.log("没注册，可以插入");
            res.cookie('id',userid, { expires: new Date(Date.now() + 90000000000)});
            var date = new Date();
            student.insert({userid:userid,password:password,username:username,college:college,clas:clas,phone:phone,ide:ide,address:address,object:object,time:date},(err,result)=>{
              if(err) throw err;
              callback(null,"0");
            })
          }else{
            callback(null,"1");
          }
        }
      ],function(err,result){
        if(err) throw err;
        callback(result);
      })
    }
MongoClient.connect(CONN_DB_STR,(err,db)=>{
  if(err) throw err;
  console.log("数据库连接成功");
  insertData(db,function(result){
    if(result==0){
      console.log("插入成功");
      res.redirect("/main")
    }else{
      console.log("插入失败");
      res.redirect("/register");
    }
    db.close();
  })
})
})
router.get("/pmsg",function(req,res){
  console.log(req.cookies);
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
          if(err) throw err;
          console.log("数据库连接成功");
          var student = db.collection("student");
          var data = {userid:req.cookies.id};
          
          student.find(data,{_id:0,username:1,password:1,college:1,clas:1,phone:1,ide:1,address:1,object:1,math:1,English:1,sport:1,sidemath:1,network:1,java:1,php:1,think:1}).toArray((err,result)=>{
              if(err) throw err;
              res.send({userid:req.cookies.id,username:result[0].username,college:result[0].college,clas:result[0].clas,phone:result[0].phone,ide:result[0].ide,address:result[0].address,object:result[0].object,math:result[0].math,English:result[0].English,java:result[0].java,sport:result[0].sport,php:result[0].php,network:result[0].network,think:result[0].think,sidemath:result[0].sidemath,password:result[0].password,title: '学生信息管理系统'});
              db.close();
            })
      })
    
})
router.post("/remsg",function(req,res){
  var userid=req.body.userid;
  var password=req.body.password;
  var username=req.body.username;
  var college=req.body.college;
  var clas=req.body.clas;
  var phone=req.body.phone;
  var ide=req.body.ide;
  var address=req.body.address;
  var object=req.body.object;
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err) throw err;
    console.log("数据库连接成功");
    var student = db.collection("student");
    student.update({userid:userid},{
      $set:{
         password:password,
         username:username,
         college:college,
         clas:clas,
         phone:phone,
         ide:ide,
         address:address,
         object:object
        }
      },(err,result)=>{
        if(err) throw err;
        res.render('main', { title: '学生信息管理系统' });
      })
      db.close();
  })
});
router.post("/magmsg",function(req,res){
  var userid=req.body.userid;
  var password=req.body.password;
  var username=req.body.username;
  var college=req.body.college;
  var clas=req.body.clas;
  var phone=req.body.phone;
  var ide=req.body.ide;
  var address=req.body.address;
  var object=req.body.object;
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err) throw err;
    console.log("数据库连接成功");
    var student = db.collection("student");
    student.update({userid:userid},{
      $set:{
         username:username,
         college:college,
         clas:clas,
         phone:phone,
         ide:ide,
         address:address,
         object:object
        }
      },(err,result)=>{
        if(err) throw err;
        res.render('magmain', { title: '学生信息管理系统' });
      })
      db.close();
  })
});
router.post("/maglogin",function(req,res){
  var postData = req.body;
  var findData = function(db,callback){
    var mag = db.collection("mag");
    var data = {userid:postData.userid,password:postData.password};
    mag.find(data).toArray((err,result)=>{
      if(err) throw err;
      callback(result);
    }) 
  }
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err){
      res.send("数据库错误");
      console.log(err);
    }else{
      console.log("数据库连接成功");
      findData(db,(result)=>{
        console.log("查询成功");
        if(result.length>0&&postData.userid==110){
            res.cookie('magid',postData.userid, { expires: new Date(Date.now() + 90000000000)});
            res.redirect("/magmain"); 
        }else{
          res.send(`<script>alert('用户名或密码错误');location.href='/mag'</script>`);
          db.close();
        }
      })
    }
  })
});
router.get("/smsg",function(req,res){
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    var student = db.collection("student");
    student.find({},{_id:0}).toArray((err,result)=>{
      if(err) throw err;
      res.send(result);
    });
  })
});
router.get("/demsg",function(req,res){
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err) throw err;
    var student = db.collection("student");
    console.log(req.query);
    student.deleteOne({userid:req.query.dataid},(err,result)=>{
      console.log("删除成功");
      res.send("1");
      db.close();
    })
  })
});
router.post("/mgrade",function(req,res){
  var userid=req.body.userid;
  var math=req.body.math;
  var English=req.body.English;
  var java=req.body.java;
  var sport=req.body.sport;
  var php=req.body.php;
  var network=req.body.network;
  var think=req.body.think;
  var sidemath=req.body.sidemath;
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err) throw err;
    console.log("数据库连接成功");
    var student = db.collection("student");
    student.update({userid:userid},{
      $set:{
         math:math,
         English:English,
         java:java,
         sport:sport,
         php:php,
         network:network,
         think:think,
         sidemath:sidemath
        }
      },(err,result)=>{
        if(err) throw err;
        res.render('magmain', { title: '学生信息管理系统' });
      })
      db.close();
  })
})
module.exports = router;
