const { faker }= require ('@faker-js/faker');
const mysql=require('mysql2'); 
const express=require('express');
const app=express();
const path=require("path");
const methodOverride=require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

app.set ('view engine', 'ejs');
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'sqllearning',
    password: 'Alpha1Bita2@'
  }); 


  


  let getRandomUser = () => {
    return [
      faker.datatype.uuid(), // faker.string.uuid() is deprecated
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  };
  



// home route hai yeh 

app.get ('/', (req, res) => {
  let q=`SELECT count(*) FROM college`;
   
try{
  connection.query(q,(err,result)=>{
      if(err) throw err;
     let count =result[0]["count(*)"];
      res.render("home.ejs",{count});
    
   });

}catch(err){
  console.log(err);
  res.send("some error in DB");
}
}
);


// show user route

app.get('/user',(req,res)=>{
  let q=`SELECT * FROM college`;
  
try{
  connection.query(q,(err,result)=>{
      if(err) throw err;
     
      res.render("showUser",{result});
    
   });

}catch(err){
  console.log(err);
  res.send("some error in DB");
}
}); 

//edit route
app.get ('/user/:id/edit',(req,res)=>{
  let {id}=req.params;
   let q=`SELECT * FROM college WHERE id='${id}'`;
   try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
      
       
        res.render("edit.ejs",{user});
      
     });
  
  }catch(err){
    console.log(err);
    res.send("some error in DB");
  }
  }); 

  // UPDATE (DATA BASE) ROUTE
  app.patch ('/user/:id',(req,res)=>{
    let {id}=req.params;

    let {password:formPass,username:newUsername}=req.body;

    let q=`SELECT * FROM college WHERE id='${id}'`;
    
    try{
      connection.query(q,(err,result)=>{
          if(err) throw err;
          let user=result[0];
          if(formPass !=user.password){
            res.send("password galat hai");
          }else{
            let q2=`UPDATE college SET username='${newUsername}' WHERE id='${id}'`;
            connection.query(q2,(err,result)=>{
              if(err) throw err;
              res.redirect("/user");
            });

          }
         
        });
    
    }catch(err){
      console.log(err);
      res.send("some error in DB");
    }

  
  }); 


 

 
  



app.listen("8080", () => {
    console.log(`Server listening on port: 8080}`)
  });

  

  
// try{
//   connection.query(q,[data],(err,result)=>{
//       if(err) throw err;
//       console.log(result);
    
//    });

// }catch(err){
//   console.log(err);
// }

// connection.end();
