const express = require('express');
const bodyParser = require("body-parser");
const app = express();

const port = 5000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})