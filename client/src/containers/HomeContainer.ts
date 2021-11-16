import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import { Recipe } from '../models/Recipe';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import PageLanguage from '../enums/PageLanguage';
import axios, { AxiosError, AxiosResponse } from 'axios';

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

	const handleSubmitRecipe = () => {
		const data = {
			title: recipeTitle,
			preparation: recipePreparation,
			languageToBackend: pageLanguage
		};

		axios
			.post('http://localhost:3001/api/createrecipe', data, {
				headers: {
					accessToken: localStorage.getItem('accessToken')!
				}
			})
			.then((response: AxiosResponse) => {
				if (response.data.error) {
					Swal.fire({
						title: '',
						text: response.data.error,
						type: 'error'
					});
				} else {
					handleCloseModal();
				}
			})
			.catch((error: AxiosError) => {
				console.log(error);
			});
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
					: 'Biztos törölni szeretnéd ezt a receptet?'
		})
			.then((confirmResponse: any) => {
				if (confirmResponse.value) {
					axios
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
								console.log(response.data.error);

								Swal.fire({
									title: '',
									text: response.data.error,
									type: 'error'
								});
							} else {
								Swal.fire({
									title: '',
									text: response.data,
									type: 'success'
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
				Swal.fire({
					title: '',
					text:
						pageLanguage === PageLanguage.EN
							? 'There was an error with the delete, try again please!'
							: 'Hiba adódott a törléssel, kérjük próbálja újra!'
				});
			});
	};

    const getUserRecipes = (): void => {
        if (!localStorage.getItem('accessToken')) {
            history.push('/login');
        } else {
            axios.get('http://localhost:3001/api/getrecipies', {
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

    useEffect(() => {
        getUserRecipes();
    }, []);

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
		handleGetRandomRecipe
    }
}

export default HomeContainer;
