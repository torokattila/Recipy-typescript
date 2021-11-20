import { useState, useContext } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import Swal, { SweetAlertResult } from 'sweetalert2';
import axios, { AxiosError, AxiosResponse } from 'axios';
import PageLanguage from '../enums/PageLanguage';
import { toast } from 'react-toastify';

type EditProfileDataType = {
	googleId: number | null | undefined;
	oldUsername: string;
	newUsername: string;
	oldPassword: string;
	newPassword: string;
	languageToBackend: PageLanguage;
};

const ProfileContainer = () => {
	const [newUsername, setNewUsername] = useState<string>('');
	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const { authState, setAuthState, pageLanguage } = useContext(AuthContext);

	const handleEditCredentials = () => {
		Swal.fire({
			title:
				pageLanguage === PageLanguage.EN
					? 'Are you sure?'
					: 'Biztos vagy benne',
			text:
				pageLanguage === PageLanguage.EN
					? 'Do you want to edit your profile data?'
					: 'Biztos szerkeszteni szeretnéd az adataidat?',
			showCancelButton: true,
			confirmButtonText:
				pageLanguage === PageLanguage.EN ? 'Yes' : 'Igen',
			cancelButtonText:
				pageLanguage === PageLanguage.EN ? 'Cancel' : 'Mégse'
		}).then(async (response: SweetAlertResult) => {
			if (response.value) {
				if (
					newUsername.trim() === '' &&
					oldPassword.trim() === '' &&
					newPassword.trim() === ''
				) {
					const errorMessage =
						pageLanguage === PageLanguage.EN
							? 'If you want to edit your profile data, fill the username and/or the two password fields down below!'
							: 'A szerkesztéshez töltsd ki a felhasználónév és/vagy a két jelszó mezőt!';

					toast.error(errorMessage, { theme: 'colored' });
				} else {
					const data: EditProfileDataType = {
						googleId: authState.google_id,
						oldUsername: authState.username,
						newUsername: newUsername.trim(),
						oldPassword: oldPassword.trim(),
						newPassword: newPassword.trim(),
						languageToBackend: pageLanguage
					};

					await axios
						.put('http://localhost:3001/api/editprofile', data, {
							headers: {
								accessToken: localStorage.getItem(
									'accessToken'
								)!
							}
						})
						.then((response: AxiosResponse) => {
							if (response.data.error) {
								toast.error(response.data.error, {
									theme: 'colored'
								});
							} else {
								setAuthState({ ...authState, username: response.data.updatedUsername });
								toast.success(response.data.successMessage, {
									theme: 'colored'
								});
							}
						})
						.catch((error: AxiosError) => {
							console.log(error);
							const errorMessage =
								pageLanguage === PageLanguage.EN
									? 'There was an error with the update, please try again!'
									: 'Hiba adódott a szerkesztéssel, kérjük próbáld újra!';
							toast.error(errorMessage, { theme: 'colored' });
						});
				}
			}
		});
	};

	const handleDeleteProfile = () => {
		Swal.fire({
			title:
				pageLanguage === PageLanguage.EN
					? 'Are you sure'
					: 'Biztos vagy benne?',
			text:
				pageLanguage === PageLanguage.EN
					? 'Do you want to delete your profile?'
					: 'Biztos törölni szeretnéd a profilodat?',
			showCancelButton: true,
			confirmButtonText:
				pageLanguage === PageLanguage.EN ? 'Yes' : 'Igen',
			cancelButtonText:
				pageLanguage === PageLanguage.EN ? 'Cancel' : 'Mégse'
		}).then(async (response: SweetAlertResult) => {
			if (response.value) {
				await axios
					.delete('http://localhost:3001/api/deleteprofile', {
						headers: {
							accessToken: localStorage.getItem('accessToken')!
						},
						data: {
							languageToBackend: pageLanguage
						}
					})
					.then((deleteResponse: AxiosResponse) => {
						if (deleteResponse.data.error) {
							toast.error(deleteResponse.data.error, {
								theme: 'colored'
							});
						} else {
							localStorage.removeItem('accessToken');
							window.location.reload();
						}
					})
					.catch((deleteError: AxiosError) => {
						console.log(deleteError);
						const errorMessage =
							pageLanguage === PageLanguage.EN
								? 'There was an error with the deletion, please try again!'
								: 'Hiba adódott a törléssel, kérjük próbáld újra!';
						toast.error(errorMessage, { theme: 'colored' });
					});
			}
		});
	};

    return {
        handleEditCredentials,
        setNewUsername,
        setOldPassword,
        setNewPassword,
        handleDeleteProfile
    };
};

export default ProfileContainer;
