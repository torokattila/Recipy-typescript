import express, { Request, Response } from 'express';
import { createQueryBuilder } from 'typeorm';
import { validateToken } from '../Middlewares/AuthMiddleware';
import { User } from '../Entities/User';

const router = express.Router();

router.delete(
	'/api/deleteprofile',
	validateToken,
	async (req: Request, res: Response) => {
		const userId = req.user.id;
		const { languageToBackend } = req.body;

		const deletedUser = await createQueryBuilder()
			.delete()
			.from(User)
			.where('id = :userId', { userId: userId })
			.execute();

		if (!deletedUser) {
			console.log('Error with user deletion');
			res.json({
				error:
					languageToBackend === 'EN'
						? 'There was an error with the deletion, try again please!'
						: 'Hiba adódott a törléssel, kérjük próbáld újra!',
			});
		} else {
			res.json(
				languageToBackend === 'EN'
					? 'Profile deleted!'
					: 'Profil törölve!'
			);
		}
	}
);

export { router as deleteProfileRouter };
