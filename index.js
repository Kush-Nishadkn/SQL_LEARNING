const { faker }= require ('@faker-js/faker');
const mysql=require('mysql2'); 
const express=require('express');
const app=express();
const path=require("path");
const methodOverride=require('method-override');
const { v4: uuidv4 } = require("uuid");

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
 


// new data route

app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO college (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM college WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM college WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM college WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
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
