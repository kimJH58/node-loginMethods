const express = require('express');
const bodyParser = require("body-parser");
const app = express();

const port = 5000

var loginRouter = require('./routes/login');

app.use(bodyParser);
app.use('/user', loginRouter);


app.listen(port, () => {
  console.log(`server on!!`)
})