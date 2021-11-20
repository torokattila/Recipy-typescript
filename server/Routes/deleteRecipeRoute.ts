import { Recipe } from '../Entities/Recipe';
import express, { Request, Response } from 'express';
import { validateToken } from '../Middlewares/AuthMiddleware';
import { createQueryBuilder } from 'typeorm';

const router = express.Router();

router.delete(
	'/api/deleterecipe/:recipeId',
	validateToken,
	async (req: Request, res: Response) => {
		const { recipeId } = req.params;
		const { languageToBackend } = req.body;

		const deletedRecipe = await createQueryBuilder()
			.delete()
			.from(Recipe)
			.where('id = :recipeId', { recipeId: Number(recipeId) })
			.execute();

		if (!deletedRecipe) {
			console.log('Delete recipe failed!');
			res.status(400).json({
				error:
					languageToBackend === 'EN'
						? 'There was an error with the delete, please try again!'
						: 'Hiba adódott a törléssel, kérjük próbálja újra!'
			});
		} else {
			res
				.status(200)
				.json(
					languageToBackend === 'EN'
						? 'Recipe deleted!'
						: 'Recept törölve!'
				);
		}
	}
);

export { router as deleteRecipeRouter };
