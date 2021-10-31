import { JwtPayload, Secret, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
require('dotenv').config({ path: __dirname + '../.env' });

declare module 'express' {
    interface Request {
        user?: any;
    }
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
	const accessToken: Secret | undefined = req.header('accessToken');

	if (!accessToken) {
		return res.json({ error: 'User does not logged in!' });
	} else {
        try {
            const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET

            if (secret) {
                const validToken = verify(
                    accessToken,
                    secret
                );

                req.user = validToken;

                if (validToken) {
                    return next();
                }
            }
        } catch (error) {
            return res.json({ error: error });
        }
    }
};

export { validateToken };
