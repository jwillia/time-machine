import express from 'express';
import sponsorGroups from './resources/sponsor-groups'
import sponsors from './resources/sponsors'
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use('/', express.static('build'));
app.use('/static', express.static('static'))
app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

export default app;