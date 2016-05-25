import express from 'express';
const router = express.Router();

router.get('/', (req,res) => {
  res.send('get all sponsor groups')
})

router.get('/:id', (req, res) => {
  res.send(`get one sponsor group ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('post sponsor groups')
});

router.put('/:id', (req, res) => {
  res.send(`put sponsor group ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  res.send(`delete sponsor group ${req.params.id}`);
})

export default router;