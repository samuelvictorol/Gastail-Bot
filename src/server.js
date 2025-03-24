const app = require('./app');
require('dotenv').config();

app.listen(process.env.PORT || 5000, () => console.log('Server Online: ' + process.env.PORT || 5000))