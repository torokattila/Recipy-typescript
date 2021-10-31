import { User } from '../Entities/User';
import express, { Request, Response } from 'express';
import { Secret, sign } from 'jsonwebtoken';
import { createQueryBuilder } from 'typeorm';
require('dotenv').config({ path: __dirname + '../.env' });
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/api/login', async (req: Request, res: Response) => {
	const { username, password, googleId, languageToBackend } = req.body;

	try {
		if (googleId) {
			const user = await User.findOne(googleId);

			if (!user) {
				const newUser = User.create({
					google_id: googleId,
					username,
				});

                await newUser.save();

				if (!newUser) {
					res.json({
						error:
							languageToBackend === 'EN'
								? 'There was an error with Google login, please try again!'
								: 'Hiba adódott a Google bejelentkezéssel, kérjük próbálja újra!',
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
							google_id: newUser.google_id,
						});
					}
				}
			} else {
				const secret: string | undefined =
					process.env.ACCESS_TOKEN_SECRET;

				if (secret) {
					const accessToken: Secret | undefined = sign(
						{
							id: user.id,
						},
						secret
					);

					res.json({
						token: accessToken,
						username: user.username,
						id: user.id,
						google_id: user.google_id,
					});
				}
			}
		} else {
			if (username.trim() === '' && password.trim() === '') {
				res.json({
					error:
						languageToBackend === 'EN'
							? 'You have to fill in both username and password field!'
							: 'A felhasználónév és a jelszó mező kitöltése kötelező!',
				});
			} else if (username.trim() === '') {
				res.json({
					error:
						languageToBackend === 'EN'
							? 'Please fill in the username field!'
							: 'A felhasználónév mező kitöltése kötelező!',
				});
			} else if (password.trim() === '') {
				res.json({
					error:
						languageToBackend === 'EN'
							? 'Please fill in the password field!'
							: 'A jelszó mező kitöltése kötelező!',
				});
			} else {
				const getUserByUsername = await createQueryBuilder('user')
					.select('user')
					.from(User, 'user')
					.where('user.username = :username', { username: username })
					.getOne();

				if (!getUserByUsername) {
					res.json({
						error:
							languageToBackend === 'EN'
								? 'There is no user with this username!'
								: 'Nem található felhasználó ilyen felhasználónévvel!',
					});
				} else {
					bcrypt.compare(
						password,
						getUserByUsername.password,
						(comparePasswordError, comparePasswordResult) => {
							if (!comparePasswordResult) {
								res.json({
									error:
										languageToBackend === 'EN'
											? 'Wrong password! '
											: 'Hibás jelszó!',
								});
							} else if (comparePasswordResult) {
								const secret = process.env.ACCESS_TOKEN_SECRET;

								if (secret) {
									const accessToken = sign(
										{
											id: getUserByUsername.id,
										},
										secret
									);

									res.json({
										token: accessToken,
										username,
										id: getUserByUsername.id,
										google_id: getUserByUsername.google_id,
									});
								}
							}
						}
					);
				}
			}
		}
	} catch (error) {
		console.log(error);
		res.json({
			error:
				languageToBackend === 'EN'
					? 'There was an error with the Login process, please try again!'
					: 'Hiba adódott a bejelentkezéssel, kérjük próbálja újra!',
		});
		throw new Error('There was an error with the login process!');
	}
});

export { router as loginRouter };
