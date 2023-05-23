import { ErrorMessage } from "@hookform/error-message";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom"
import DependencyInjectionContext from "../../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../../di/provider/DependencyInjectionContextType";
import PositionEntity from "../../../../domain/entities/PositionEntity";
import SiteEntity from "../../../../domain/entities/SiteEntity";
import KeyWordLocalization from "../../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../../domain/providers/language/LanguageContextType";
import ModalsContext from "../../../../domain/providers/modal/ModalsContext";
import ModalsContextType from "../../../../domain/providers/modal/ModalsContextType";
import AutoCompleteComponent from "../../../components/form/autocomplete/AutoCompleteComponent";
import RouteMapComponent from "../../../components/RouteMap/RouteMapComponent";
import { routes } from "../../../routes/RoutesComponent";
import Validators from "../../../utils/Validators";

const AddRoutePage = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { addToast } = useContext(ModalsContext) as ModalsContextType;
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [ polylines, setPolylines ] = useState<PositionEntity[] | undefined>(undefined);

    const { id } = useParams();
    const navigate = useNavigate();
    const startPoint = watch('start_point');
    const endPoint = watch('end_point');

    const [sites, setSites] = useState<SiteEntity[]>([]);

    const onChangeInitPoint = (position: PositionEntity) => {
        setValue('startPoint', `${position.lat},${position.lng}`);
        setValue('start_point', position);
    };
    const onChangeEndPoint = (position: PositionEntity) => {
        setValue('endPoint', `${position.lat},${position.lng}`);
        setValue('end_point', position);
    };
    const _loadRoute = async () => {
        if (id == undefined) return;
        // await _getSites("");
        console.log('prv of getted route');
        const route = await di.useCases.getRouteByIdUseCase?.call(parseInt(id!));
        console.log('getted rout by id', route);
        if (route == undefined) return;
        Object.entries(route).forEach(([key, value]) => {
            setValue(key, value);
        });
        setValue('site', route?.site);
        setPolylines(route.polylines);
        onChangeInitPoint(route.start_point);
        onChangeEndPoint(route.end_point);
    };

    const _getSites = async (word: string) => {
        const response = await di.useCases.searchSitesByNameUseCase?.call(word);
        setSites(response);
    }

    const onSubmit = (data: any) => id != undefined ? _updateTrip(data) : _createTrip(data);
    const _updateTrip = async (data: any) => {
        const tempRoute = { ...data, id: parseInt(id!), polylines };
        try {
            await di.useCases.updateRouteUseCase?.call(tempRoute);
            addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
        } catch (error) {
            addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
        }
        navigate(`${routes.route.relativePath}/${id}`);
    };
    const _createTrip = async (data: any) => {
        const tempRoute = { ...data, polylines };
        console.log('temproute',tempRoute);
        try {
            await di.useCases.createRouteUseCase?.call(tempRoute);
            addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
        } catch (error) {
            addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
        }
        navigate(routes.routes.path);
    };


    useEffect(() => {
        if (id != undefined) _loadRoute();
    }, [id]);

    return <div className="add_route_page">
        <h5>{i18n(id != null ? KeyWordLocalization.AddRoutePageTitleEdit : KeyWordLocalization.AddRoutePageTitleCreate)}</h5>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-100">
                <div className="row">
                    <div className="col-lg-6">
                        <div className={`col-12 mb-3 form-group ${errors.name ? 'error' : ''}`}>
                            <label>{i18n(KeyWordLocalization.RouteEntityName)}</label>
                            <input type="name" className="form-control" placeholder={i18n(KeyWordLocalization.RouteEntityName)}
                                {...register('name', Validators({ required: true }))} />
                            <ErrorMessage as="aside" errors={errors} name="name" />
                        </div>
                        <div className={`col-12 mb-3 form-group ${errors.description ? 'error' : ''}`}>
                            <label>{i18n(KeyWordLocalization.RouteEntityDescription)}</label>
                            <textarea className="form-control"
                                {...register('description', Validators({ required: true }))} placeholder={i18n(KeyWordLocalization.RouteEntityDescription)} />
                            <ErrorMessage as="aside" errors={errors} name="description" />
                        </div>
                        <div className="col-12 my-3">
                            <AutoCompleteComponent required onSearch={_getSites} errors={errors} label={i18n(KeyWordLocalization.RouteEntitySite)} keyName="site" onChange={setValue}
                                register={register} watch={watch} options={sites.map((site) => { return { label: site.name, id: site } })} />
                        </div>
                        <div className="row">
                            <div className={`col-md-6 mb-3 form-group ${errors.start_point ? 'error' : ''}`}>
                                <label>{i18n(KeyWordLocalization.RouteEntityStartPoint)}</label>
                                <input type="start_point" className="form-control" disabled placeholder={i18n(KeyWordLocalization.RouteEntityStartPoint)}
                                    {...register('startPoint', Validators({ required: true }))} />
                                <ErrorMessage as="aside" errors={errors} name="start_point" />
                            </div>
                            <div className={`col-md-6 mb-3 form-group ${errors.end_point ? 'error' : ''}`}>
                                <label>{i18n(KeyWordLocalization.RouteEntityEndPoint)}</label>
                                <input type="end_point" className="form-control" disabled placeholder={i18n(KeyWordLocalization.RouteEntityEndPoint)}
                                    {...register('endPoint', Validators({ required: true }))} />
                                <ErrorMessage as="aside" errors={errors} name="end_point" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <RouteMapComponent onChangePolylines={setPolylines}  busStop={startPoint} siteStop={endPoint} show onChangeSiteStop={onChangeEndPoint} onChangeBusStop={onChangeInitPoint} />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end my-3">
                <button type="submit" className="btn btn-primary">{i18n(KeyWordLocalization.Save)}</button>
            </div>
        </form>
    </div>
}

export default AddRoutePage;