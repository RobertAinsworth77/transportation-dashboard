import React, { useEffect, useState } from 'react';
import AlertContext from '../../domain/providers/alert/AlertContext';
import AlertContextType from '../../domain/providers/alert/AlertContextType';
import LanguageContext from '../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../domain/providers/language/LanguageContextType';
import ModalsContext from '../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../domain/providers/modal/ModalsContextType';
import UserContext from '../../domain/providers/user/UserContext';
import UserContextType from '../../domain/providers/user/UserContextType';
import LoadingComponent from '../../ui/components/LoadingComponent/LoadingComponent';
import { DepenedencyInjector } from '../DependencyInjection';
import DependencyInjectionContext from './DependencyInjectionContext';

interface Props {
    children: React.ReactNode;
    dependencyInjector: DepenedencyInjector;
}

const DependencyInjectionProvider: React.FC<Props> = ({ children, dependencyInjector }) => {
    const [di, setValue] = React.useState<DepenedencyInjector>(dependencyInjector);
    di.providers.alert.contextType = React.useContext(AlertContext) as AlertContextType;
    di.providers.languague.contextType = React.useContext(LanguageContext) as LanguageContextType;
    di.providers.user.contextType = React.useContext(UserContext) as UserContextType;
    di.providers.modals.contextType = React.useContext(ModalsContext) as ModalsContextType;

    const _intervalGetAlerts = () => {
        setInterval(() => {
            di.useCases.getActiveAlertsUseCase.call();
        }, 120000);
    }

    useEffect(() => {
        _intervalGetAlerts();
    }, []);

    return <DependencyInjectionContext.Provider value={{ di, setValue }}>
        {children}
    </DependencyInjectionContext.Provider>;
}

export default DependencyInjectionProvider;
