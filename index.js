const express = require("express");
const app = express();
const router = require('./route');
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept,token ,Authorization");
    res.header( "Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT" ),
    next();
});
app.use('/api',router)
const port = 3000;

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})