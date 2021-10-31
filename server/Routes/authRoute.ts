import express, { Request, Response } from 'express';
import { validateToken } from '../Middlewares/AuthMiddleware';
import bodyParser from 'body-parser';
import { User } from '../Entities/User';

const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/api/auth', validateToken, async (req: Request, res: Response) => {
	const userId = req.user.id;
	const { languageToBackend } = req.query;

	const user = await User.findOne(userId);

	if (!user) {
		res.json({
			error:
				languageToBackend === 'EN'
					? 'User does not exist!'
					: 'Ilyen felhasználónévvel nem létezik felhasználó!',
		});
	} else {
		res.json({
			user: req.user,
			username: user.username,
			google_id: user.google_id,
		});
	}
});

export { router as authRouter };
