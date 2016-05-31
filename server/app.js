import express from 'express';
import sponsorGroups from './resources/sponsor-groups'
import sponsors from './resources/sponsors'
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use('/api/v1/sponsor-groups', sponsorGroups);
app.use('/api/v1/sponsors', sponsors);
app.use('/', express.static('build'));
app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

export default app;