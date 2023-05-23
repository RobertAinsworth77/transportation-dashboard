 import React from 'react';
import UserEntity from '../../../domain/entities/UserEntity';
import ProviderProps from '../../../domain/providers/ProviderProps';
import UserContext from '../../../domain/providers/user/UserContext';

const UserProviderImpl: React.FC<ProviderProps> = ({ children }) => {
    const [user, setUser] = React.useState<UserEntity|undefined>(undefined);
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export default UserProviderImpl;