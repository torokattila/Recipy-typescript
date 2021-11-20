import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from 'react-router-dom';
import Swal, { SweetAlertResult } from 'sweetalert2';
import PageLanguage from '../enums/PageLanguage';

const NavbarContainer = () => {
    const { setAuthState, pageLanguage } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = (): void => {
        Swal.fire({
            title: pageLanguage === PageLanguage.EN ? 'Are you sure?' : 'Biztos vagy benne?',
            text: pageLanguage === PageLanguage.EN ? 'Do you want to log out?': 'Biztos ki szeretnél jelentkezni?',
            showCancelButton: true,
            cancelButtonText: pageLanguage === PageLanguage.EN ? 'Cancel' : 'Mégse'
        })
        .then((response: SweetAlertResult) => {
            if (response.value) {
                localStorage.removeItem('accessToken');
                setAuthState({
                    username: '',
                    id: 0,
                    status: false,
                });

                history.push('/login');
                window.location.reload();
            }
        });
    }

    return {
        handleLogout
    }

}

export default NavbarContainer;