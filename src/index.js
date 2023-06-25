const mongoose = require("mongoose");
require('dotenv').config()
const app = require("./app");
const config = require("./config/config");
const userRouter = require("./routes/v1/user.route")

let server;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
 const db_URI = process.env.MONGODB_URL;
 const port = process.env.PORT;
 
 
 mongoose.connect(`${db_URI}`,{ 
   useNewUrlParser: true,
   useUnifiedTopology: true
})
 .then(()=> {
   console.log("connected to db", db_URI);
   app.listen(port, ()=>{
   console.log("server is live at", port)
})})
 .catch(()=> console.log("failed to connect to db"))

//  app.use("/v1", userRouter);

 
 
 
