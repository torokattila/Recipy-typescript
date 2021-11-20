import { User } from '../Entities/User';
import express, { Request, Response } from 'express';
import { createQueryBuilder, getRepository } from 'typeorm';
import { validateToken } from '../Middlewares/AuthMiddleware';
import bcrypt from 'bcryptjs';

const router = express.Router();
const saltRounds = 10;

router.put(
	'/api/editprofile',
	validateToken,
	async (req: Request, res: Response) => {
		const {
			oldUsername,
			newUsername,
			oldPassword,
			newPassword,
			googleId,
			languageToBackend
		} = req.body;
		const userId = req.user.id;

		if (!googleId) {
			const getUserByUsername = await createQueryBuilder('user')
				.select('user')
				.from(User, 'user')
				.where('user.username = :username', { username: oldUsername })
				.getOne();

			if (getUserByUsername) {
				if (
					newUsername !== '' &&
					oldPassword !== '' &&
					newPassword !== ''
				) {
					bcrypt.hash(
						newPassword,
						saltRounds,
						async (hashError, hashedPassword) => {
							if (hashError) {
								console.log(hashError);
								res.status(400).json({ error: hashError });
							}

							try {
								const updatedUser = await createQueryBuilder()
									.update(User)
									.set({
										username: newUsername,
										password: hashedPassword
									})
									.where('id = :userId', { userId: userId })
									.execute();

								if (!updatedUser) {
									console.log(
										'Something went wrong with the update!'
									);
									res.status(400).json({
										error:
											languageToBackend === 'EN'
												? 'There was an error with the update, please try again!'
												: 'Hiba adódott a szerkesztéssel, kérjük próbáld újra!'
									});
								} else {
									res.status(200).json({
										successMessage:
											languageToBackend === 'EN'
												? 'Updated profile datas!'
												: 'Profil adatok frissítve!',
										updatedUsername: newUsername
									});
								}
							} catch (error) {
								console.log(error);
								console.log(error);
								res.json({
									error:
										languageToBackend === 'EN'
											? 'Your new username is already taken, please choose another one!'
											: 'Ez a felhasználónév már foglalt, kérjük válasszon másikat!'
								});
							}
						}
					);
				} else if (
					newUsername !== '' &&
					oldPassword === '' &&
					newPassword === ''
				) {
					try {
						const updatedUser = await createQueryBuilder()
							.update(User)
							.set({
								username: newUsername
							})
							.where('id = :userId', { userId: userId })
							.execute();

						if (!updatedUser) {
							console.log(
								'Something went wrong with the update!'
							);
							res.status(400).json({
								error:
									languageToBackend === 'EN'
										? 'There was an error with the update, please try again!'
										: 'Hiba adódott a szerkesztéssel, kérjük próbáld újra!'
							});
						} else {
							res.status(200).json({
								successMessage:
									languageToBackend === 'EN'
										? 'Username updated successfully!'
										: 'Felhasználónév frissítve!',
								updatedUsername: newUsername
							});
						}
					} catch (error) {
						console.log(error);
						res.json({
							error:
								languageToBackend === 'EN'
									? 'Your new username is already taken, please choose another one!'
									: 'Ez a felhasználónév már foglalt, kérjük válasszon másikat!'
						});
					}
				} else if (newUsername === '') {
					if (oldPassword === '' || newPassword === '') {
						res.status(400).json({
							error:
								languageToBackend === 'EN'
									? 'You have to fill both old password and new password fields!'
									: 'Mindkét jelszó mező kitöltése kötelező!'
						});
					} else {
						bcrypt.compare(
							oldPassword,
							getUserByUsername.password,
							(comparePasswordError, comparePasswordResult) => {
								if (!comparePasswordResult) {
									res.status(400).json({
										error:
											languageToBackend === 'EN'
												? 'Wrong old password!'
												: 'Hibás régi jelszó!'
									});
								} else if (comparePasswordResult) {
									bcrypt.hash(
										newPassword,
										saltRounds,
										async (hashError, hashedPassword) => {
											if (hashError) {
												console.log(hashError);
												res
													.status(400)
													.json({ error: hashError });
											}

											const updatedUser = await createQueryBuilder()
												.update(User)
												.set({
													password: hashedPassword
												})
												.where('id = :userId', {
													userId: userId
												})
												.execute();

											if (!updatedUser) {
												console.log(
													'There was an error with the password update!'
												);
												res.status(400).json({
													error:
														languageToBackend ===
														'EN'
															? 'There was an error with the update, please try again!'
															: 'Hiba adódott a szerkesztéssel, kérjük próbáld újra!'
												});
											} else {
												res.status(200).json({
													successMessage:
														languageToBackend ===
														'EN'
															? 'Password updated successfully!'
															: 'Jelszó frissítve!'
												});
											}
										}
									);
								}
							}
						);
					}
				}
			}
		} else {
			res.status(400).json({
				error:
					languageToBackend === 'EN'
						? 'You are not able to edit Google credentials!'
						: 'Nincs jogosultságod szerkeszteni a Google adatokat!'
			});
		}
	}
);

export { router as editProfileRouter };
