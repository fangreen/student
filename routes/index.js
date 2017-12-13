var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '学生信息管理系统' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: '学生信息管理系统' });
});
router.get('/main', function(req, res, next) {
  res.render('main', { title: '学生信息管理系统'});
});
router.get('/mag',function(req,res){
  res.render('mag',{title:"管理员入口"});
})
router.get('/magmain',function(req,res){
  res.render('magmain',{title:"管理员入口"});
})
module.exports = router;
