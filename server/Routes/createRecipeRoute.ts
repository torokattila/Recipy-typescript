import { Recipe } from '../Entities/Recipe';
import express, { Request, Response } from 'express';
import { validateToken } from '../Middlewares/AuthMiddleware';
import { User } from '../Entities/User';

const router = express.Router();

router.post(
	'/api/createrecipe',
	validateToken,
	async (req: Request, res: Response) => {
		let { title, preparation, languageToBackend } = req.body;

		const userId = req.user.id;
		title = title.trim();

		if (title === '') {
			res.json({
				error:
					languageToBackend === 'EN'
						? 'Add a title to your recipe!'
						: 'Adj meg egy címet vagy nevet a receptednek!'
			});
		} else {
			const user = await User.findOne(userId);

			const newRecipe = Recipe.create({
				title,
				content: preparation,
				user: user
			});

			await newRecipe.save();
			res
				.status(201)
				.json(
					languageToBackend === 'EN'
						? 'Recipe created!'
						: 'Recept hozzáadva!'
				);
		}
	}
);

export { router as createRecipeRouter };
