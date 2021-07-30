const dotenv= require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
require('jsonwebtoken');
const app = express();


dotenv.config({path:'./config.env'})


const PORT = process.env.PORT || 5000;


app.use(cookieParser());
app.use(express.json());
app.use(require('./router/auth'));



// step 3: Heroku 

 

if ( process.env.NODE_ENV == "production"){

    app.use(express.static("client/build"));
}


app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
    });