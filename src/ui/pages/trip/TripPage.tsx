import { FC, useContext, useEffect, useState } from "react"
import DependencyInjectionContext from "../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../di/provider/DependencyInjectionContextType";
import TripEntity from "../../../domain/entities/TripEntity"
import KeyWordLocalization from "../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../domain/providers/language/LanguageContextType";
import ModalsContext from "../../../domain/providers/modal/ModalsContext";
import ModalsContextType from "../../../domain/providers/modal/ModalsContextType";
import TableComponent from "../../components/table/TableComponent"
import * as GetFiltredTripsUseCase from '../../../domain/use_cases/trip/GetFiltredTripsUseCase';
import DeleteTripModalComponent from "./delete/DeleteTripModalComponent";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/RoutesComponent";

const TripPage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { openModalCustom, closeModalCustom } = useContext(ModalsContext) as ModalsContextType;
    const navigate = useNavigate();

    const [trips, setTrips] = useState<TripEntity[] | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
    const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
    const [searchWord, setSearchWord] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    const _searchTrips = async (word: string, page: number, itemsPerPageR: number) => {
        setCurrentPage(page);
        setTrips(undefined);
        setTotalResults(undefined);
        setSearchWord(word);
        setItemsPerPage(itemsPerPageR);
        const response: GetFiltredTripsUseCase.response = await di.useCases.getFiltredTripsUseCase?.call(word, currentPage, itemsPerPageR);
        setTrips(response.trips);
        setCurrentPage(response.current_page);
        setTotalPages(response.total_pages);
        setTotalResults(response.total_rows);
    }
    const _handleAdd = async () => navigate(routes.add_trip.relativePath);
    const _handleEdit = async (trip:TripEntity) => navigate(routes.edit_trip.relativePath+'/'+trip.id);
    const _handleDelete = async (trip: TripEntity) => {
        const deleteTrip = async () => {
            await di.useCases.deleteTripUseCase.call(trip.id);
            _searchTrips(searchWord, currentPage, itemsPerPage);
            closeModalCustom();
        }

        openModalCustom('sm', i18n(KeyWordLocalization.TripsPageDeleteTrip), <DeleteTripModalComponent done={() => deleteTrip()} />)

    }
    const _handleRowClick = async (trip: TripEntity) => navigate(routes.trip.relativePath+'/'+trip.id);

    useEffect(() => {
        _searchTrips(searchWord, currentPage, itemsPerPage);
    }, []);


    return <div className="trip_page">
        <TableComponent title={i18n(KeyWordLocalization.TripPageTitle)}
            columns={[
                { keyName: 'start_date', name: i18n(KeyWordLocalization.TripEntityInitDate) },
                { keyName: 'end_date', name: i18n(KeyWordLocalization.TripEntityEndDate) },
                { keyName: 'driver.name', name: i18n(KeyWordLocalization.TripEntityDriver) },
                { keyName: 'state', name: i18n(KeyWordLocalization.TripEntityState) },
                { keyName: 'route.id', name: i18n(KeyWordLocalization.TripEntityRouteId) },
                { keyName: 'route.name', name: i18n(KeyWordLocalization.TripEntityRoute) },
            ]}
            data={trips}
            searchByWord={_searchTrips}
            page={currentPage}
            totalItems={totalResults}
            totalPages={totalPages}
            handleRowClick={_handleRowClick}
            handleAdd={_handleAdd}
            handleEdit={_handleEdit}
            handleDelete={_handleDelete} />
    </div>
}

export default TripPage