const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
