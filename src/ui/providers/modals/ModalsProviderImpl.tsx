import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastOptions } from 'react-toastify';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import ProviderProps from '../../../domain/providers/ProviderProps';
import { routes } from '../../routes/RoutesComponent';

const ModalsProviderImpl: React.FC<ProviderProps> = ({ children }) => {
    const [customModal, _setCustomModal] = React.useState<any | undefined>(undefined);
    const openModalCustom = (size: string, title: string | undefined, content: any) => _setCustomModal({ content, title, size });
    const closeModalCustom = () => _setCustomModal(undefined);
    const isOpenModalCustom = customModal != undefined;

    const addToast = (message: string, type: "success" | "error" | "warning" | "default" | "alert", params: any) => {
        const paramsToast: ToastOptions<{}> = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        };
        if (type == "success") toast.success(message, paramsToast);
        if (type == "error") toast.error(message, paramsToast);
        if (type == "alert") {
            paramsToast.autoClose = false;
            paramsToast.hideProgressBar = true;
            paramsToast.theme = "colored";
            paramsToast.containerId = `${routes.trip.relativePath}/${params.tripId}`;
            paramsToast.data = params;
            toast.error(message, paramsToast);
        }
        if (type == "warning") toast.warning(message, paramsToast);
        if (type == "default") toast(message, paramsToast);
    };



    return <ModalsContext.Provider
        value={{
            isOpenModalCustom, openModalCustom, closeModalCustom, customModal,
            addToast
        }}>
        {children}
    </ModalsContext.Provider>;
}

export default ModalsProviderImpl;