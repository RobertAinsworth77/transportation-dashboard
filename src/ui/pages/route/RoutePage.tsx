import { FC, useContext, useEffect, useState } from "react"
import DependencyInjectionContext from "../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../di/provider/DependencyInjectionContextType";
import RouteEntity from "../../../domain/entities/RouteEntity"
import KeyWordLocalization from "../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../domain/providers/language/LanguageContextType";
import ModalsContext from "../../../domain/providers/modal/ModalsContext";
import ModalsContextType from "../../../domain/providers/modal/ModalsContextType";
import TableComponent from "../../components/table/TableComponent"
import * as GetFiltredRoutesUseCase from '../../../domain/use_cases/route/GetFiltredRoutesUseCase';
import DeleteRouteModalComponent from "./delete/DeleteRouteModalComponent";
import { useNavigate } from "react-router-dom";
import { routes as navRoutes } from "../../routes/RoutesComponent";

const RoutePage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;
    const navigate = useNavigate();

    const [routes, setRoutes] = useState<RouteEntity[] | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
    const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
    const [searchWord, setSearchWord] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    const _searchRoutes = async (word: string, page: number, itemsPerPageR: number) => {
        setCurrentPage(page);
        setRoutes(undefined);
        setTotalResults(undefined);
        setSearchWord(word);
        setItemsPerPage(itemsPerPageR);
        try {
            const response: GetFiltredRoutesUseCase.response = await di.useCases.getFiltredRoutesUseCase?.call(word, currentPage, itemsPerPageR);
            setRoutes(response.routes);
            setCurrentPage(response.current_page);
            setTotalPages(response.total_pages);
            setTotalResults(response.total_rows);                
        } catch (error) {
            setRoutes([]);
        }
    }
    const _handleAdd = async () => navigate(navRoutes.add_route.relativePath);
    const _handleEdit = async (route: RouteEntity) => navigate(navRoutes.edit_route.relativePath+'/'+route.id);
    const _handleDelete = async (route: RouteEntity) => {
        const deleteRoute = async () => {
            await di.useCases.deleteRouteUseCase.call(route.id);
            _searchRoutes(searchWord, currentPage, itemsPerPage)
        }

        openModalCustom('sm', i18n(KeyWordLocalization.RoutesPageDeleteRoute), <DeleteRouteModalComponent done={() => deleteRoute()} />)
    }
    const _handleRowClick = async (route: RouteEntity) => navigate(navRoutes.route.relativePath+'/'+route.id);

    useEffect(() => {
        _searchRoutes(searchWord, currentPage, itemsPerPage);
    }, []);


    return <div className="route_page">
        <TableComponent title={i18n(KeyWordLocalization.RoutePageTitle)}
            columns={[
                { keyName: 'name', name: i18n(KeyWordLocalization.RouteEntityName) },
                { keyName: 'description', name: i18n(KeyWordLocalization.RouteEntityDescription) },
                { keyName: 'site.name', name: i18n(KeyWordLocalization.RouteEntitySite) },
            ]}
            data={routes}
            searchByWord={_searchRoutes}
            page={currentPage}
            totalItems={totalResults}
            totalPages={totalPages}
            handleRowClick={_handleRowClick}
            handleAdd={_handleAdd}
            handleEdit={_handleEdit}
            handleDelete={_handleDelete} />
    </div>
}

export default RoutePage