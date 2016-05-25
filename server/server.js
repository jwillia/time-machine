var app = require('./app').default;
app.listen(app.get('port'), () => {
  console.log('app started on port', app.get('port'));
});

