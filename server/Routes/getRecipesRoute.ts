import { Recipe } from '../Entities/Recipe';
import express, { Request, Response } from 'express';
import { validateToken } from '../Middlewares/AuthMiddleware';
import { createQueryBuilder } from 'typeorm';

const router = express.Router();

router.get(
	'/api/getrecipies',
	validateToken,
	async (req: Request, res: Response) => {
		const userId = req.user.id;

		const userRecipes = await createQueryBuilder('recipe')
			.select('recipe')
			.from(Recipe, 'recipe')
			.where('recipe.user_id = :userId', { userId: userId })
			.getMany();

		const listOfRecipies = JSON.parse(JSON.stringify(userRecipes));

		res.json({ recipiesList: listOfRecipies });
	}
);

export { router as getRecipesRouter };
