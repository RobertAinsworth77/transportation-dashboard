import './UsersPage.scss';
import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import UserEntity, { UserEntityRole } from '../../../domain/entities/UserEntity';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../domain/providers/modal/ModalsContextType';
import * as GetFiltredUsersUseCase from '../../../domain/use_cases/user/GetFiltredUsersUseCase';
import TableComponent from '../../components/table/TableComponent';
import AddUserModalComponent from './components/add/AddUserModalComponent';
import DeleteUserModalComponent from './components/delete/DeleteUserModalComponent';
import UsersPageProps from './UsersPageProps';
import UserContext from '../../../domain/providers/user/UserContext';
import UserContextType from '../../../domain/providers/user/UserContextType';
import { OrdeByFilterEntity } from '../../../domain/entities/OrdeByFilterEntity';

const UsersPage: FC<UsersPageProps> = () => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;
  const { user } = useContext(UserContext) as UserContextType;

  const [users, setUsers] = useState<UserEntity[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [orderBy, setOrderBy] = useState<OrdeByFilterEntity | undefined>(undefined);

  const _searchUsers = async (word: string, page: number, itemsPerPageR: number, _orderBy: OrdeByFilterEntity | undefined) => {
    setCurrentPage(page);
    setUsers(undefined);
    setTotalResults(undefined);
    setSearchWord(word);
    setItemsPerPage(itemsPerPageR);
    setOrderBy(_orderBy);
    try {
      const response: GetFiltredUsersUseCase.response = await di.useCases.getFiltredUsersUseCase?.call(word, currentPage, itemsPerPageR, _orderBy);
      setUsers(response.users);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_rows);
      setOrderBy(response.orderBy);
    } catch (error) {
      setUsers([]);
    }
  }

  const _handleEdit = async (user: UserEntity) => {
    openModalCustom('lg', i18n(KeyWordLocalization.UsersPageEditUser), <AddUserModalComponent userEditing={user} done={() => _searchUsers(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }

  const _handleDelete = async (user: UserEntity) => {
    const deleteUser = async () => {
      await di.useCases.deleteUserUseCase.call(user.id);
      _searchUsers(searchWord, currentPage, itemsPerPage, orderBy)
    }

    openModalCustom('sm', i18n(KeyWordLocalization.UsersPageDeleteUser), <DeleteUserModalComponent done={() => deleteUser()} />)
  }

  const _handleAdd = async () => {
    openModalCustom('lg', i18n(KeyWordLocalization.UsersPageAddUser), <AddUserModalComponent done={() => _searchUsers(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }

  return <div className="UsersPage bg_1 p-5">
    <TableComponent title={i18n(KeyWordLocalization.UsersPageTitle)}
      columns={[
        { keyName: 'name', name: i18n(KeyWordLocalization.UserEntityName) },
        { keyName: 'role', name: i18n(KeyWordLocalization.UserEntityRole) },
        { keyName: 'phone', name: i18n(KeyWordLocalization.UserEntityPhone) },
        { keyName: 'email', name: i18n(KeyWordLocalization.UserEntityEmail) },
      ]}
      data={users}
      searchByWord={_searchUsers}
      page={currentPage}
      totalItems={totalResults}
      totalPages={totalPages}
      handleAdd={_handleAdd}
      handleEdit={_handleEdit}
      handleDelete={user?.role == UserEntityRole.admin ? _handleDelete : undefined} />
  </div>
};

export default UsersPage;
