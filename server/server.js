import http from 'http';
import mysql from 'mysql';
import url from 'url';
const db = mysql.createConnection({
    host :"localhost",
    user:"root",
    password: "Sanju@23",
    database:'test'
    });
    db.connect((err) => {
    if (err) {
          console.error("Error connecting to MySQL database:", err);
          return;
    }
    console.log("Database connected");
    
});
const server = http.createServer((req,res) => {

  var urls = url.parse(req.url).pathname;
  const parsedUrl = url.parse(req.url, true);
  const name = parsedUrl.pathname.split('/')[2];
  
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 
  
  if(req.url == '/todo' && req.method == "GET"){
     db.query("SELECT * FROM todo", (err, data) => {
        if(err){
            console.error(err);
            res.writeHead(500 , {"Content-Type" :"application/json"});
            res.end(JSON.stringify(err));
        }
        else{
            res.writeHead(201 , {"Content-Type" :"application/json"});
            res.end(JSON.stringify(data));
            

        }
     });
  }
  else if(req.url == '/addtodo' && req.method == "POST" )
  { 
    const chunks = [];
    
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end",()=>{
           const data = Buffer.concat(chunks);
           let parsedData = JSON.parse(data.toString());
           
          console.log(parsedData);
          const q = "INSERT INTO todo (`name`,`list`) VALUES (?)";
          const values = [parsedData.name, parsedData.list];
           db.query(q,[values],(err,data) => {
         
            if(err){
                console.error(err);
                res.writeHead(500 , {"Content-Type" :"application/json"});
                res.end(JSON.stringify(err));
            }
            else{
                res.writeHead(201 , {"Content-Type" :"application/json"});
                res.end(JSON.stringify(data));
            
     
            }
          });
       });
 
    
  }
  else if (urls == "/update/") 
  {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const responseJson = JSON.stringify(data.response);
        db.query("update todo set `list` = ? where name= ?", [responseJson,name], function (err, result) {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            console.log('data updated');
            console.log(result);

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Data inserted successfully');
          }
        });
      } catch (error) {
        console.error(error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
   } 
  else if ( urls =="/delete/" ) {
    //console.log("delete")
    let a = url.parse(req.url, true).query;
    const q = "DELETE FROM todo WHERE name = ?"; 
    db.query(q, [a.name], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.statusCode = 500; // Internal Server Error
        res.end(JSON.stringify({ error: 'An error occurred while deleting the book' }));
      } else {
        res.statusCode = 200; // OK
        res.end(JSON.stringify({ message: 'Book deleted successfully' }));
      }
    });
  } 
  else {
    res.statusCode = 404; // Not Found
    res.end(JSON.stringify({ error: 'Invalid endpoint' }));
  }
   
});

const PORT = 7000;
server.listen(PORT , () => {
    console.log( 'Server Started' );
});



 