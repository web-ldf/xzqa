const express=require("express");
const mysql=require("mysql");
const cors=require('cors/lib/index')
const server=express();
const bodyParser=require("body-parser");
const md5=require('md5');
//配置cors中间件
server.use(cors({
    //跨域源
    origin:["http://127.0.0.1:8080","http://localhost:8080"]
}));
//bodyParser中间件
server.use(bodyParser.urlencoded({
    extended:false
}));

//mysql连接池
const pool=mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"xzqa",
    connectionLimit:20
})

//获取文章分类的api
server.get("/category",(req,res)=>{
   var sql="SELECT id,category_name FROM xzqa_category order by id";
   pool.query(sql,(err,results)=>{
       if(err) throw err;
       res.send({message:"查询成功",code:200,category:results});
   })
})
//获取指定分类下文章的API
server.get("/list",(req,res)=>{
    //获取指定的分类ID
    var cid=req.query.cid;
    //获取页码参数
    var page=parseInt(req.query.page);
    //每页显示的记录数
    var pagesize=10;
    //存储偏移值（mysql中LIMIT子句的offset参数）
    //offset计算公式：offset=(当前页码-1)*每页显示记录数
    var offset=(page-1)*pagesize;
    //存储总记录数
    var rowCount;
    //存储总页数
    var pageCount;
    //统计某一个分类记录总数/总页数
    var sql="SELECT COUNT(id) AS count FROM xzqa_article WHERE category_id=?";
    pool.query(sql,[cid],(err,results)=>{
         if(err) throw err;
         rowCount=results[0].count;
         pageCount=Math.ceil(rowCount/pagesize);
    
        //记录查找
        var sql="SELECT id,subject,description,image FROM xzqa_article WHERE category_id=? LIMIT ?,?";
        pool.query(sql,[cid,offset,pagesize],(err,results)=>{
            if(err) throw err;
            console.log(pageCount);
            res.send({ message:"查询成功", code:200, articles:results, pageCount:pageCount }); 
        });
  });
});

//获取指定ID的文章信息
server.get('/getArticle',(req,res)=>{
    //获取文章的ID
    var id=req.query.id;
    //根据文章ID查找文章及其作者的信息
    var sql="SELECT subject,content,created_at,nickname,avatar,article_number FROM xzqa_article AS a INNER JOIN xzqa_author AS u ON author_id=u.id WHERE a.id=?";
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send({message:"查询成功",code:200,info:results[0]});
    })
});

//获取用户发表的文章
server.get("/getArticles",(req,res)=>{
    //获取用户id
    var id=req.query.id;

    var sql="SELECT id AS value,subject AS label FROM xzqa_article WHERE author_id=?";
    pool.query(sql,[id],(err,results)=>{
        if (err) throw err;
        res.send({message:"查询成功",code:200,articles:results});
    })
});

//定义删除文章的API
server.post("/removeArticles",(req,res)=>{
    //获取提交的ID信息
   var id=req.body.id;
   var sql="DELETE FROM xzqa_article WHERE id IN ("+ id +")";
   pool.query(sql,(err,results)=>{
    if (err) throw err;
       res.send({message:"删除成功",code:200});
   });
   
});

//修改个人资料的API
server.post("/profile",(req,res)=>{
    var nickname=req.body.nickname;
    var password=md5(req.body.password);
    var id=req.body.id;
    console.log(password);
    console.log(id);
    var sql='UPDATE xzqa_author set nickname=?,password=? WHERE id=?';
    pool.query(sql,[nickname,password,id],(err,results)=>{
        if (err) throw err;
        res.send({message:"编辑成功",code:200});
    })
});


//用户注册API
server.post("/register",(req,res)=>{
    //获取出了用户的注册信息
   var username=req.body.username;
   //使用md5对密码进行hash运算
   var password=md5(req.body.password);

   //查找用户名是否存在
   var sql="SELECT COUNT(id) AS count FROM xzqa_author WHERE username=?";
   pool.query(sql,[username],(err,results)=>{
       if (err) throw err;
       //用户已存在
       if(results[0].count==1){
           res.send({message:"注册失败",code:201});
       }
       //用户不存在
       if(results[0].count==0){
        sql="INSERT xzqa_author(username,password) VALUES(?,?)";
        pool.query(sql,[username,password],(err,results)=>{
            if (err) throw err;
            res.send({message:"注册成功",code:200});
        })
       }
   })
});

//用户登录API
server.post("/login",(req,res)=>{
    var username=req.body.username;
    var password=md5(req.body.password);
    var sql="SELECT id,username,nickname,article_number FROM xzqa_author WHERE username=? AND password=?";
    pool.query(sql,[username,password],(err,results)=>{
        if(err) throw err;

        if(results.length==0){
            res.send({message:"登录失败",code:202});
        }
        if(results.length==1){
            res.send({message:"登录成功",code:200,info:results[0]});
        }
    });
})
//配置监听端口
server.listen(5050);