import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import { Recipe } from '../models/Recipe';
import { useHistory } from 'react-router-dom';
import Swal, { SweetAlertResult } from 'sweetalert2';
import PageLanguage from '../enums/PageLanguage';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

type SubmitRecipeType = {
	title: string;
	preparation: string;
	languageToBackend: PageLanguage;
};

function HomeContainer() {
	const { pageLanguage } = useContext(AuthContext);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [isCreateRecipeModal, setIsCreateRecipeModal] = useState<boolean>(
		false
	);
	const [recipeModalId, setRecipeModalId] = useState<number | null>(null);
	const [modalRecipeTitle, setModalRecipeTitle] = useState<string>('');
	const [modalRecipeContent, setModalRecipeContent] = useState<string>('');
	const [recipeTitle, setRecipeTitle] = useState<string>('');
	const [recipePreparation, setRecipePreparation] = useState<string>('');
	const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

	const history = useHistory();

	const handleOpenModal = (): void => {
		setIsCreateRecipeModal(true);
		setOpenModal(true);
	};

	const handleOpenRecipeModal = (
		recipeId: number,
		modalRecipeTitle: string,
		modalRecipeContent: string
	): void => {
		setOpenModal(true);
		setIsCreateRecipeModal(false);
		setRecipeModalId(recipeId);
		setModalRecipeTitle(modalRecipeTitle);
		setModalRecipeContent(modalRecipeContent);
	};

	const handleGetRandomRecipe = (): void => {
		const randomElement: Recipe =
			userRecipes[Math.floor(Math.random() * userRecipes.length)];

		setOpenModal(true);
		setIsCreateRecipeModal(false);
		setRecipeModalId(randomElement.id);
		setModalRecipeTitle(randomElement.title);
		setModalRecipeContent(randomElement.content);
	};

	const handleCloseModal = (): void => {
		setOpenModal(false);
	};

	const handleSubmitRecipe = async () => {
		const data: SubmitRecipeType = {
			title: recipeTitle,
			preparation: recipePreparation,
			languageToBackend: pageLanguage
		};

		await axios
			.post('http://localhost:3001/api/createrecipe', data, {
				headers: {
					accessToken: localStorage.getItem('accessToken')!
				}
			})
			.then(async (response: AxiosResponse) => {
				if (response.data.error) {
					toast.error(response.data.error, {
						theme: 'colored'
					});
				} else {
					toast.success(response.data, {
						theme: 'colored'
					});
					handleCloseModal();
				}
			})
			.catch((error: AxiosError) => {
				console.log(error);
			});

		getUserRecipes();
	};

	const handleDeleteRecipe = (id: number): void => {
		Swal.fire({
			title:
				pageLanguage === PageLanguage.EN
					? 'Are you sure?'
					: 'Biztos vagy benne?',
			text:
				pageLanguage === PageLanguage.EN
					? 'Do you want to delete this recipe?'
					: 'Biztos törölni szeretnéd ezt a receptet?',
			showCancelButton: true,
			cancelButtonText:
				pageLanguage === PageLanguage.EN ? 'Cancel' : 'Mégse'
		})
			.then(async (confirmResponse: SweetAlertResult) => {
				if (confirmResponse.value) {
					await axios
						.delete(
							`http://localhost:3001/api/deleterecipe/${id}`,
							{
								headers: {
									accessToken: localStorage.getItem(
										'accessToken'
									)!
								},
								data: {
									languageToBackend: pageLanguage
								}
							}
						)
						.then((response: AxiosResponse) => {
							if (response.data.error) {
								toast.error(response.data.error, {
									theme: 'colored'
								});
							} else {
								getUserRecipes();
								toast.success(response.data, {
									theme: 'colored'
								});
							}
						})
						.catch((error: AxiosError) => {
							console.log(error);
						});
				}
			})
			.catch((error: AxiosError) => {
				console.log(error);
				const errorMessage: string =
					pageLanguage === PageLanguage.EN
						? 'There was an error with the delete, try again please!'
						: 'Hiba adódott a törléssel, kérjük próbálja újra!';
				toast.error(errorMessage, { theme: 'colored' });
			});
	};

	const getUserRecipes = async (): Promise<void> => {
		if (!localStorage.getItem('accessToken')) {
			history.push('/login');
		} else {
			await axios
				.get('http://localhost:3001/api/getrecipies', {
					headers: {
						accessToken: localStorage.getItem('accessToken')!
					}
				})
				.then((response: AxiosResponse) => {
					setUserRecipes(response.data.recipiesList);
				})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		}
	};

	return {
		recipeModalId,
		setRecipeTitle,
		setRecipePreparation,
		openModal,
		isCreateRecipeModal,
		handleOpenModal,
		handleOpenRecipeModal,
		handleCloseModal,
		handleSubmitRecipe,
		userRecipes,
		handleDeleteRecipe,
		modalRecipeTitle,
		modalRecipeContent,
		handleGetRandomRecipe,
		getUserRecipes
	};
}

export default HomeContainer;
