import './DetailedRouteStyles.scss';
import { useEffect } from "react";
import { FC, useContext, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import DependencyInjectionContext from "../../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../../di/provider/DependencyInjectionContextType";
import RouteEntity from "../../../../domain/entities/RouteEntity";
import KeyWordLocalization from "../../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../../domain/providers/language/LanguageContextType";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import NotFoundComponent from "../../../components/notFound/NotFoundComponent";
import RouteMapComponent from "../../../components/RouteMap/RouteMapComponent";
import { routes } from "../../../routes/RoutesComponent";

const DetailedRoutePage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { id } = useParams<{ id: string }>();

    const [route, setRoute] = useState<RouteEntity | null | undefined>(undefined);

    const _loadRoute = async () => {
        const route = await di.useCases.getRouteByIdUseCase?.call(parseInt(id!));
        console.log('route', route);
        setRoute(route);
    }

    useEffect(() => {
        _loadRoute();
    }, [id]);

    if (route === undefined) return <LoadingComponent />
    else if (route === null) return <NotFoundComponent />
    return <div className="detailed_route_page">
        <div className="row">
            <div className="col-lg-9">
                <h5>{i18n(KeyWordLocalization.DetailedRoutePageTitle)}</h5>
            </div>
            <div className="col-lg-3 d-flex jutify-content-end align-items-center">
                <Link to={`${routes.edit_route.relativePath}/${id}`} className="btn btn-light d-flex align-items-center mx-3">
                    <MdEdit />
                    <span className="mx-2">{i18n(KeyWordLocalization.Edit)}</span>
                </Link>
                <button type="button" className="btn btn-light d-flex align-items-center">
                    <MdDelete />
                    <span className="mx-2">{i18n(KeyWordLocalization.Delete)}</span>
                </button>
            </div>
        </div>
        <div className="row mt-3 d-flex align-items-stretch">
            <div className="col-lg-5">
                <div className="card w-100 mb-3">
                    <div className="card-body">
                        <strong>{i18n(KeyWordLocalization.RouteEntityName)}:</strong><br />
                        <span>{route.name}</span>
                    </div>
                </div>
                <div className="card w-100 mb-3">
                    <div className="card-body">
                        <strong>{i18n(KeyWordLocalization.RouteEntityDescription)}:</strong><br />
                        <span>{route.description}</span>
                    </div>
                </div>
                <div className="card w-100 mb-3">
                    <div className="card-body">
                        <strong>{i18n(KeyWordLocalization.RouteEntityStartPoint)}:</strong><br />
                        <span>{route.start_point.lat} - {route.start_point.lng}</span>
                    </div>
                </div>
                <div className="card w-100 mb-3">
                    <div className="card-body">
                        <strong>{i18n(KeyWordLocalization.RouteEntityEndPoint)}:</strong><br />
                        <span>{route.end_point.lat} - {route.end_point.lng}</span>
                    </div>
                </div>
            </div>
            <div className="col-lg my-3 my-lg-0">
                <RouteMapComponent busStop={route.start_point} siteStop={route.end_point} show />
            </div>
        </div>
    </div>
}

export default DetailedRoutePage;