import React, { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import DriverEntity from '../../../domain/entities/DriverEntity';
import SiteEntity from '../../../domain/entities/SiteEntity';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../domain/providers/modal/ModalsContextType';
import * as GetFiltredSitesUseCase from '../../../domain/use_cases/site/GetFiltredSitesUseCase';
import TableComponent from '../../components/table/TableComponent';
import AddSiteModalComponent from './components/add/AddSiteModalComponent';
import DeleteSiteModalComponent from './components/delete/DeleteSiteModalComponent';
import './SitesPage.scss';
import SitesPageProps from './SitesPageProps';
import { OrdeByFilterEntity } from '../../../domain/entities/OrdeByFilterEntity';

const SitesPage: FC<SitesPageProps> = () => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;

  const [sites, setSites] = useState<SiteEntity[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [orderBy, setOrderBy] = useState<OrdeByFilterEntity | undefined>(undefined);

  const _searchSites = async (word: string, page: number, itemsPerPageR: number, _orderBy: OrdeByFilterEntity | undefined) => {
    setCurrentPage(page);
    setSites(undefined);
    setTotalResults(undefined);
    setSearchWord(word);
    setItemsPerPage(itemsPerPageR);
    setOrderBy(_orderBy);
    try {
      const response: GetFiltredSitesUseCase.response = await di.useCases.getFiltredSitesUseCase?.call(word, currentPage, itemsPerPageR, _orderBy);
      setSites(response.sites);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_rows);        
      setOrderBy(response.orderBy);
    } catch (error) {
      setSites([]);
    }
  }

  const _handleEdit = async (site: SiteEntity) => {
    openModalCustom('lg', i18n(KeyWordLocalization.SitesPageEditSite), <AddSiteModalComponent site={site} done={() => _searchSites(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }

  const _handleDelete = async (site: SiteEntity) => {
    const deleteSite = async () => {
      await di.useCases.deleteSiteUseCase.call(site.id);
      _searchSites(searchWord, currentPage, itemsPerPage, orderBy)
    }

    openModalCustom('sm', i18n(KeyWordLocalization.SitesPageDeleteSite), <DeleteSiteModalComponent done={() => deleteSite()} />)
  }

  const _handleAdd = async () => {
    openModalCustom('lg', i18n(KeyWordLocalization.SitesPageAddSite), <AddSiteModalComponent done={() => _searchSites(searchWord, currentPage, itemsPerPage, orderBy)} />)
  }

  return <div className="sites_page bg_1 p-5">
    <TableComponent title={i18n(KeyWordLocalization.SitesPageTitle)}
      columns={[
        { keyName: 'name', name: i18n(KeyWordLocalization.SiteEntityName) },
        { keyName: 'country', name: i18n(KeyWordLocalization.SiteEntityCountry) },
      ]}
      data={sites}
      searchByWord={_searchSites}
      page={currentPage}
      totalItems={totalResults}
      totalPages={totalPages}
      handleAdd={_handleAdd}
      handleEdit={_handleEdit}
    // handleDelete={_handleDelete}
    />
  </div>
};

export default SitesPage;
