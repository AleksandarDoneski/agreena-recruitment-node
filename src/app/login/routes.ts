import { Router } from "express";
import { checkCredentials, generateJwtToken } from "../authentication/authentication";

const router = Router();

router.get('/', (req, res) => {
    res.render('login') 
})

router.post('/', async (req, res) => {
    const user = await checkCredentials(req.body);
    if (!user) {
        res.send('No way');
    }
    const token = generateJwtToken(user);
    
    res.cookie('auth-token', token);
    res.redirect('/list');
})

export default router;
