import express from 'express';
const router = express.Router();

router.get('/', (req,res) => {
  res.send('get all sponsor')
})

router.get('/:id', (req, res) => {
  res.send(`get one sponsor ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('post sponsor')
});

router.put('/:id', (req, res) => {
  res.send(`put sponsor ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  res.send(`delete sponsor ${req.params.id}`);
})

export default router;