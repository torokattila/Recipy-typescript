import { User } from '../Entities/User';
import express, { Request, Response } from 'express';
import { createQueryBuilder } from 'typeorm';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const router = express.Router();
const saltRounds = 10;

router.post('/api/register', async (req: Request, res: Response) => {
	let { username, password, passwordAgain, languageToBackend } = req.body;

	username = username.trim();
	password = password.trim();
	passwordAgain = passwordAgain.trim();

	if (username === '' && password === '' && passwordAgain === '') {
		res.json({
			error:
				languageToBackend === 'EN'
					? 'Please fill all the input fields!'
					: 'Az összes mező kitöltése kötelező!',
		});
	} else if (username === '') {
		res.json({
			error:
				languageToBackend === 'EN'
					? 'Username field is required!'
					: 'A Felhasználónév mező kitöltése kötelező!',
		});
	} else if (password === '') {
		res.json({
			error:
				languageToBackend === 'EN'
					? 'Password field is required!'
					: 'A Jelszó mező kitöltése kötelező!',
		});
	} else if (passwordAgain === '') {
		res.json({
			error:
				languageToBackend === 'EN'
					? 'Confirm password field is required!'
					: 'A Jelszó megerősítése mező kitöltése kötelező!',
		});
	} else if (password !== passwordAgain) {
		res.json({
			error:
				languageToBackend === 'EN'
					? 'Password and Confirm password field must match!'
					: 'A Jelszó és a Jelszó megerősítése mező nem egyezik!',
		});
	} else {
		const getUserByUsername = await createQueryBuilder('user')
			.select('user')
			.from(User, 'user')
			.where('user.username = :username', { username: username })
			.getOne();

		if (getUserByUsername) {
			res.json({
				error:
					languageToBackend === 'EN'
						? 'This username is already exist, please choose a different username!'
						: 'Ilyen felhasználónévvel már létezik felhasználó, kérjük válasszon másik felhasználónevet!',
				success: false,
			});
		} else {
			bcrypt.hash(password, saltRounds, (hashError, hashedPassword) => {
				if (hashError) {
					console.log(hashError);
					res.json(hashError);
				}

				const newUser = User.create({
					username: username,
					password: hashedPassword,
				});

                newUser.save();

				if (!newUser) {
					console.log('There was an error with the user creation!');
					res.json({
						error:
							languageToBackend === 'EN'
								? 'There was an error with the registration, please try again!'
								: 'Hiba adódott a regisztrációval, kérjük próbálja újra!',
					});
				} else {
					const secret: string | undefined =
						process.env.ACCESS_TOKEN_SECRET;

					if (secret) {
						const accessToken = sign(
							{
								id: newUser.id,
							},
							secret
						);

						res.json({
							token: accessToken,
							username: username,
							id: newUser.id,
							google_id: null,
						});
					}
				}
			});
		}
	}
});

export { router as registerRouter };
