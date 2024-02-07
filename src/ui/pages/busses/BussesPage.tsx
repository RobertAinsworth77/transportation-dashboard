import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import BusEntity from '../../../domain/entities/BusEntity';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../domain/providers/modal/ModalsContextType';
import * as GetFiltredBussesUseCase from '../../../domain/use_cases/bus/GetFiltredBussesUseCase';
import TableComponent from '../../components/table/TableComponent';
import AddBusModalComponent from './components/add/AddBusModalComponent';
import DeleteBusModalComponent from './components/delete/DeleteBusModalComponent';
import './BussesPage.scss';
import BussesPageProps from './BussesPageProps';
import { OrdeByFilterEntity } from '../../../domain/entities/OrdeByFilterEntity';

const BussesPage: FC<BussesPageProps> = () => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;

  const [busses, setBusses] = useState<BusEntity[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [orderBy, setOrderBy] = useState<OrdeByFilterEntity | undefined>(undefined);

  const _searchBusses = async (word: string, page: number, itemsPerPageR: number, _orderBy: OrdeByFilterEntity | undefined) => {
    setCurrentPage(page);
    setBusses(undefined);
    setTotalResults(undefined);
    setSearchWord(word);
    setItemsPerPage(itemsPerPageR);
    setOrderBy(_orderBy);
    try {
      const response: GetFiltredBussesUseCase.response = await di.useCases.getFiltredBussesUseCase?.call(word, currentPage, itemsPerPageR, _orderBy);
      setBusses(response.busses);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_rows);
      setOrderBy(response.orderBy);        
    } catch (error) {
      setBusses([]);
    }
  }

  const _handleEdit = async (bus: BusEntity) => {
    openModalCustom('lg',i18n(KeyWordLocalization.BussesPageEditBus), <AddBusModalComponent bus={bus} done={() => _searchBusses(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }

  const _handleDelete = async (bus: BusEntity) => {
    const deleteBus = async () => {
      await di.useCases.deleteBusUseCase.call(bus.id);
      _searchBusses(searchWord, currentPage, itemsPerPage, orderBy)
    }
  
    openModalCustom('sm',i18n(KeyWordLocalization.BussesPageDeleteBus), <DeleteBusModalComponent done={() => deleteBus ()} />)
  }

  const _handleAdd = async () => {
    openModalCustom('lg',i18n(KeyWordLocalization.BussesPageAddBus), <AddBusModalComponent done={() => _searchBusses(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }

  return <div className="busses_page bg_1 p-5">
    <TableComponent title={i18n(KeyWordLocalization.BussesPageTitle)}
      columns={[
        { keyName: 'plate', name: i18n(KeyWordLocalization.BusEntityPlate) },
        { keyName: 'capacity', name: i18n(KeyWordLocalization.BusEntityCapacity) },
      ]}
      data={busses}
      searchByWord={_searchBusses}
      page={currentPage}
      totalItems={totalResults}
      totalPages={totalPages}
      handleAdd={_handleAdd}
      handleEdit={_handleEdit}
      handleDelete={_handleDelete} />
  </div>
};

export default BussesPage;
