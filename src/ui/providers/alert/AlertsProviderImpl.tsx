 import React from 'react';
import AlertEntity from '../../../domain/entities/AlertEntity';
import AlertContext from '../../../domain/providers/alert/AlertContext';
import ProviderProps from '../../../domain/providers/ProviderProps';

const AlertsProviderImpl: React.FC<ProviderProps> = ({ children }) => {
    const [alerts, setAlerts] = React.useState<AlertEntity[]>([]);
    return <AlertContext.Provider value={{ alerts, setAlerts }}>{children}</AlertContext.Provider>;
}

export default AlertsProviderImpl;