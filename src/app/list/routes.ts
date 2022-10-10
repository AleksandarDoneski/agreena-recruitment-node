import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.send('Token works');
});

export default router;