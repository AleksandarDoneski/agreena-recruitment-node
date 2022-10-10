import { User } from "../../database";
import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import { NextFunction, Request, Response } from "express";

const privateKey = '12345';

export async function checkCredentials(body: any) {
    const {email, password} = body;
    const user = await User.findOne({where: {Username: email}});
    if (!user) {
        return null;
    }
    if (user.getDataValue('Password') === password) {
        return {Name: user.getDataValue('Name'), Username: user.getDataValue('Username')};
    }
    return null;
}

export function generateJwtToken(user: any): string {
    const {Name, Username} = user;
    const payload = {
        Name,
        Username
    }
    return jwt.sign(payload, privateKey) as string;
}

export function isTokenValid(token: string): boolean {
    const verified = jwt.verify(token, privateKey) as string | JwtPayload;
    if (!verified || typeof verified === 'string') {
        return false;
    }
    return true;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { cookies } = req;
    const authToken = cookies['auth-token'];
    if (!authToken) {
        res.redirect('/login');
    } else {
        const valid = isTokenValid(authToken)
        if (valid) {
            next();
        } else {
            res.redirect('/login');
        };
    }
}

