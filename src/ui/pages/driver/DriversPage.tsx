import './DriversPageStyles.scss';
import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import DriverEntity from '../../../domain/entities/DriverEntity';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import * as GetFiltredDriversUseCase from '../../../domain/use_cases/driver/GetFiltredDriverUseCase';
import TableComponent from '../../components/table/TableComponent';
import DriversPageProps from './DriversPageProps';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../domain/providers/modal/ModalsContextType';
import AddDriverModalComponent from './components/add/AddDriverModalComponent';
import DeleteDriverModalComponent from './components/delete/DeleteDriverModalComponent';
import { OrdeByFilterEntity } from '../../../domain/entities/OrdeByFilterEntity';

const DriversPage: FC<DriversPageProps> = () => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;

  const [drivers, setDrivers] = useState<DriverEntity[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [orderBy, setOrderBy] = useState<OrdeByFilterEntity | undefined>(undefined);

  const _searchDrivers = async (word: string, page: number, itemsPerPageR: number, _orderBy: OrdeByFilterEntity | undefined) => {
    console.log(word, page, itemsPerPageR)
    setCurrentPage(page);
    setDrivers(undefined);
    setTotalResults(undefined);
    setSearchWord(word);
    setItemsPerPage(itemsPerPageR);
    setOrderBy(_orderBy);
    try {
      const response: GetFiltredDriversUseCase.response = await di.useCases.getFiltredDriversUseCase?.call(word, page, itemsPerPageR, _orderBy);
      setDrivers(response.drivers);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_rows); 
      setOrderBy(response.orderBy);
    } catch (error) {
      setDrivers([]);
    }
  }

  const _handleEdit = async (driver: DriverEntity) => {
    openModalCustom('lg', i18n(KeyWordLocalization.DriversPageEditDriver), <AddDriverModalComponent driver={driver} done={() => _searchDrivers(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }


  const _handleDelete = async (driver: DriverEntity) => {
    const deleteDriver = async () => {
      await di.useCases.deleteDriverUseCase.call(driver.id);
      _searchDrivers(searchWord, currentPage, itemsPerPage, orderBy)
    }

    openModalCustom('sm', i18n(KeyWordLocalization.DriversPageDeleteDriver), <DeleteDriverModalComponent done={() => deleteDriver()} />)
  }


  const _handleAdd = async () => {
    openModalCustom('lg', i18n(KeyWordLocalization.DriversPageAddDriver), <AddDriverModalComponent done={() => _searchDrivers(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }

  useEffect(() => {
    _searchDrivers(searchWord, currentPage, itemsPerPage, orderBy);
  }, []);

  return <div className="DriversPage bg_1 p-5">
    <TableComponent title={i18n(KeyWordLocalization.DriversPageTitle)}
      columns={[
        { keyName: 'name', name: i18n(KeyWordLocalization.DriverEntityName) },
        { keyName: 'phone', name: i18n(KeyWordLocalization.DriverEntityPhone) },
        { keyName: 'enabled', name: i18n(KeyWordLocalization.DriverEntityEnabled) },
        { keyName: 'email', name: i18n(KeyWordLocalization.DriverEntityEmail) },
      ]}
      data={drivers}
      searchByWord={_searchDrivers}
      page={currentPage}
      totalItems={totalResults}
      totalPages={totalPages}
      handleAdd={_handleAdd}
      handleEdit={_handleEdit}
      handleDelete={_handleDelete} />
  </div>
};

export default DriversPage;
