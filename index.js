const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3001;

const db = require('./util/database');

// routes
// const employeeRoutes = require('./routes/employees');
const usersRoutes = require('./routes/users');
const assetsRoutes = require('./routes/assets');

// cors middleware
// app.use(cors());
app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/assets', assetsRoutes);   //http://localhost:3001/assets
app.use('/users', usersRoutes);     //http://localhost:3001/users/

// error handling middleware
// app.use((err, req, res, next) => {
//     res.send({
//         error: true,
//         message: 'Server Error',
//         err: err
//     });
// });

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});
