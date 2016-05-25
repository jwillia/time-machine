import express from 'express';
import sponsorGroups from './resources/sponsor-groups'
import sponsors from './resources/sponsors'
const app = express();

app.use('/api/v1/sponsor-groups', sponsorGroups);
app.use('/api/v1/sponsors', sponsors);

export default app;