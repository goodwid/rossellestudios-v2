require ('./lib/setup-mongoose');
const app = require('./lib/app');

app.listen(process.env.PORT, err => {
  if (err) return console.error(err);
  return console.log(`Server listening on port: ${process.env.PORT}`);
});
