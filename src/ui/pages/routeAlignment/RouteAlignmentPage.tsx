import React, { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import RouteAlignmentEntity from '../../../domain/entities/RouteAlignmentEntity';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../domain/providers/modal/ModalsContextType';
import TableComponent from '../../components/table/TableComponent';
import AddRouteAlignmentModalComponent from './components/add/AddRouteAlignmentModalComponent';
import './RouteAlignmentPage.scss';
import RouteAlignmentPageProps from './RouteAlignmentPageProps';
import { OrdeByFilterEntity } from '../../../domain/entities/OrdeByFilterEntity';

const RouteAlignmentPage: FC<RouteAlignmentPageProps> = () => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { openModalCustom, closeModalCustom } = useContext(ModalsContext) as ModalsContextType;

  const [routeAlignments, setRouteAlignments] = useState<RouteAlignmentEntity[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [orderBy, setOrderBy] = useState<OrdeByFilterEntity | undefined>(undefined);

  const [countryFilter, setCountryFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<{countries: string[], cities: string[]}>({countries: [], cities: []});

  const _searchRouteAlignments = async (word: string, page: number, itemsPerPageR: number, _orderBy: OrdeByFilterEntity | undefined, country?: string, city?: string) => {
    console.log('_searchRouteAlignments called with:', { word, page, itemsPerPageR, _orderBy, country, city });
    
    setCurrentPage(page);
    setRouteAlignments(undefined);
    setTotalResults(undefined);
    setSearchWord(word);
    setItemsPerPage(itemsPerPageR);
    setOrderBy(_orderBy);
    
    const countryFilterValue = country !== undefined ? country : countryFilter;
    const cityFilterValue = city !== undefined ? city : cityFilter;
    
    console.log('Filter values being used:', { countryFilterValue, cityFilterValue });
    
    setCountryFilter(countryFilterValue);
    setCityFilter(cityFilterValue);
    
    try {
      console.log('Calling repository with filters:', { word, page, itemsPerPageR, _orderBy, countryFilterValue, cityFilterValue });
      const response = await di.repositories.routeAlignmentRepository?.getFiltredRouteAlignments(word, page, itemsPerPageR, _orderBy, countryFilterValue, cityFilterValue);
      if (response) {
        console.log('Repository response:', response);
        
        setRouteAlignments(response.routeAlignments);
        setCurrentPage(response.current_page);
        setTotalPages(response.total_pages);
        setTotalResults(response.total_rows);
        setOrderBy(response.orderBy);
        
        // Update filter options from response
        if (response.countries && response.cities && response.countries.length > 0) {
          console.log('Setting filter options:', response.countries, response.cities);
          setFilterOptions({
            countries: response.countries,
            cities: response.cities
          });
        } else {
          // Fallback: extract unique values from current data
          const countries = Array.from(new Set(response.routeAlignments.map(item => item.country).filter(Boolean)));
          const cities = Array.from(new Set(response.routeAlignments.map(item => item.city).filter(Boolean)));
          console.log('Using fallback filter options:', countries, cities);
          setFilterOptions({
            countries,
            cities
          });
        }
      }
    } catch (error) {
      console.error('Error in _searchRouteAlignments:', error);
      setRouteAlignments([]);
    }
  }

  const _handleEdit = async (routeAlignment: RouteAlignmentEntity) => {
    openModalCustom('lg', 'Edit Survey Route', <AddRouteAlignmentModalComponent routeAlignment={routeAlignment} done={() => _searchRouteAlignments(searchWord, currentPage, itemsPerPage, orderBy, countryFilter, cityFilter)} />)
  }

  const _handleDelete = async (routeAlignment: RouteAlignmentEntity) => {
    const deleteRouteAlignment = async () => {
      try {
        await di.repositories.routeAlignmentRepository?.deleteRouteAlignment(routeAlignment.id);
        closeModalCustom();
        _searchRouteAlignments(searchWord, currentPage, itemsPerPage, orderBy, countryFilter, cityFilter);
      } catch (error) {
        console.error('Error deleting route alignment:', error);
      }
    }

    openModalCustom('sm', 'Delete Survey Route', 
      <div className="text-center">
        <p>Are you sure you want to delete this survey route?</p>
        <p><strong>{routeAlignment.country} - {routeAlignment.city} - {routeAlignment.community}</strong></p>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button className="btn btn-secondary" onClick={() => closeModalCustom()}>Cancel</button>
          <button className="btn btn-danger" onClick={deleteRouteAlignment}>Delete</button>
        </div>
      </div>
    )
  }

  const _handleAdd = async () => {
    openModalCustom('lg', 'Add Survey Route', <AddRouteAlignmentModalComponent done={() => _searchRouteAlignments(searchWord, currentPage, itemsPerPage, orderBy, countryFilter, cityFilter)} />)
  }

  useEffect(() => {
    _searchRouteAlignments('', 1, 20, undefined);
  }, []);

  return <div className="route_alignment_page bg_1 p-5">
    <TableComponent title="Survey Routes"
      columns={[
        { keyName: 'country', name: 'Country' },
        { keyName: 'city', name: 'City' },
        { keyName: 'community', name: 'Community' },
      ]}
      data={routeAlignments}
      searchByWord={_searchRouteAlignments}
      page={currentPage}
      totalItems={totalResults}
      totalPages={totalPages}
      handleAdd={_handleAdd}
      handleEdit={_handleEdit}
      handleDelete={_handleDelete}
      showFilters={true}
      filterOptions={filterOptions}
      countryFilter={countryFilter}
      cityFilter={cityFilter}
    />
  </div>
};

export default RouteAlignmentPage;
