import React, { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import ModalsComponentProps from "./ModalsComponentProps";
import 'react-toastify/dist/ReactToastify.css';
import './ModalsStyles.scss';
import ModalCustomComponent from "./custom/ModalCustomComponent";
import AlertContext from "../../../domain/providers/alert/AlertContext";
import AlertContextType from "../../../domain/providers/alert/AlertContextType";
import { toast, ToastItem, ToastOptions } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import DependencyInjectionContext from "../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../di/provider/DependencyInjectionContextType";
import { routes } from "../../routes/RoutesComponent";

const ModalsComponent: React.FC<ModalsComponentProps> = ({ children }) => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const navigate = useNavigate();
    
    useEffect(() => {
        toast.onChange((payload: ToastItem) => {
            if (typeof payload.containerId == 'string' && payload.containerId != undefined && payload.status == "removed" && payload.type == "error") {
                const id = (payload.data as any).id;
                di.useCases.alertAttendanceUseCase.call(id);
                navigate(payload.containerId);
            }
        });
    }, []);


    return <div className="modals_component">
        <ModalCustomComponent />
        <ToastContainer position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" />
        {children}
    </div>
}


export default ModalsComponent;