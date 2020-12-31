const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

// cors middleware
app.use(cors());

// bodyparser middleware--->it allow to read body of incoming json object
app.use(express.json());

// routes
const usersRoutes = require('./routes/users');
const assetsRoutes = require('./routes/assets');
app.use('/assets', assetsRoutes);   //http://localhost:3001/assets
app.use('/users', usersRoutes);     //http://localhost:3001/users/

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});