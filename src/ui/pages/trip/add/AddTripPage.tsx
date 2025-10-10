import { ErrorMessage } from "@hookform/error-message";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
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
import Validators from "../../../utils/Validators";
import { routes as routesRouter } from "../../../routes/RoutesComponent";
import RouteMapComponent from "../../../components/RouteMap/RouteMapComponent";
import TripEntity from "../../../../domain/entities/TripEntity";
import DriverEntity from "../../../../domain/entities/DriverEntity";
import RouteEntity from "../../../../domain/entities/RouteEntity";
import BusEntity from "../../../../domain/entities/BusEntity";
import DateParse from "../../../utils/DateParse";

const AddTripPage = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { addToast } = useContext(ModalsContext) as ModalsContextType;
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    const { id } = useParams();
    const navigate = useNavigate();
    const startPoint = watch('start_point');
    const endPoint = watch('end_point');
    const route = watch('route');
    const driver = watch('driver');
    const end_date_date = watch('end_date_date');
    const end_date_time = watch('end_date_time');

    const [sites, setSites] = useState<SiteEntity[]>([]);
    const [drivers, setDrivers] = useState<DriverEntity[]>([]);
    const [busses, setBusses] = useState<BusEntity[]>([]);
    const [routes, setRoutes] = useState<RouteEntity[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [polylines, setPolylines] = useState<PositionEntity[] | undefined>(undefined);

    const _searchDrivers = async (word: string) => {
        const response = await di.useCases.searchDriversByNameUseCase?.call(word);
        setDrivers(response);
    }

    const _searchBusses = async (word: string) => {
        const response = await di.useCases.searchBusesByNameUseCase?.call(word);
        setBusses(response);
    }

    const _searchSites = async (word: string) => {
        const response = await di.useCases.searchSitesByNameUseCase?.call(word);
        setSites(response);
    }

    const _searchRoutes = async (word: string) => {
        const response = await di.useCases.searchRoutesByNameUseCase?.call(word);
        const noRoute: RouteEntity = {
            id: 0, name: i18n(KeyWordLocalization.TripPageNoRoute),
            polylines: undefined,
            description: "",
            enabled: false,
            start_point: { lat: 0, lng: 0 },
            end_point: { lat: 0, lng: 0 },
        };
        setRoutes([noRoute, ...response]);
    }

    const _handleChangeDriver = (driver: DriverEntity) => {
        setValue("bus", driver?.defaultBus);
    }

    const _handleChangeRoute = (route: RouteEntity) => {
        setValue('start_point', route?.start_point);
        setValue('end_point', route?.end_point);
        setValue('startPoint', route?.start_point != null ? `${route.start_point.lat},${route.start_point.lng}` : null);
        setValue('endPoint', route?.end_point != null ? `${route.end_point.lat},${route.end_point.lng}` : null);
        setValue('site', route?.site);
        setValue('name', route?.name);
        setValue('description', route?.description);

    }
    const onChangeInitPoint = (position: PositionEntity) => {
        setValue('startPoint', `${position.lat},${position.lng}`);
        setValue('start_point', position);
    };
    const onChangeEndPoint = (position: PositionEntity) => {
        setValue('endPoint', `${position.lat},${position.lng}`);
        setValue('end_point', position);
    };
    const _loadTrip = async () => {
        const trip = await di.useCases.getTripByIdUseCase?.call(parseInt(id!));
        if (trip == undefined) return;
        console.log('trip get', trip);
        if(!trip.canEdit) navigate(routesRouter.trip.relativePath);
        if (trip.driver != null) trip.driver.defaultBus = trip.bus;
        Object.entries(trip).forEach(([key, value]) => {
            console.log('key', key, 'value', value);
            setValue(key, value);
        });
        setPolylines(trip.route?.polylines);
        console.log('test time', trip.start_date, DateParse.getTimeForInput(trip.start_date))
        setValue('route', trip.route ?? { id: trip.route_id, name: "LOJ - itel MBJ" });
        setValue('driver', trip.driver ?? { id: trip.driver_id, name: "" });
        setValue('bus', trip.bus ?? { id: trip.bus_id, name: "" });
        setValue('site', trip.route?.site ?? { id: trip.route?.site_id ?? 0, name: "" });
        setValue('start_date_date', DateParse.getDateForInput(trip.start_date));
        setValue('start_date_time', DateParse.getTimeForInput(trip.start_date));
        if (trip.end_date != null && Number.isNaN(trip.end_date.getTime()) == false) {
            setValue('end_date_date', trip.end_date ? DateParse.getDateForInput(trip.end_date) : undefined);
            setValue('end_date_time', trip.end_date ? DateParse.getTimeForInput(trip.end_date) : undefined);
        }
        if (trip.route?.start_point != null) onChangeInitPoint(trip.route.start_point);
        if (trip.route?.end_point != null) onChangeEndPoint(trip.route.end_point);
        setLoaded(true);
    };

    const onSubmit = (data: any) => id != undefined ? _updateTrip(data) : _createTrip(data);
    const _updateTrip = async (data: any) => {
        const tempTrip: TripEntity = {
            ...data, id: parseInt(id!),
            site_id: data.site.id,
            start_date: DateParse.stringToDate(data.start_date_date + " " + data.start_date_time),
            end_date: DateParse.stringToDate(data.end_date_date + " " + data.end_date_time),
        };
        console.log('temptrip', tempTrip);
        console.log('polylinesss', polylines);
        if (tempTrip.route != null && tempTrip.route.polylines == null) tempTrip.route.polylines = polylines;
        if (tempTrip.route != null && route.id == 0) {
            tempTrip.route.name = data.name;
            tempTrip.route!.site = data.site;
            tempTrip.route.start_point = data.start_point;
            tempTrip.route.end_point = data.end_point;
            tempTrip.route.description = data.description;
        }
        try {
            await di.useCases.updateTripUseCase?.call(tempTrip);
            addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
        } catch (error) {
            addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
        }
        navigate(`${routesRouter.trip.relativePath}/${id}`);
    };
    const _createTrip = async (data: any) => {
        const tempTrip: TripEntity = {
            ...data,
            id: 0,
            site_id: data.site.id,
            start_date: DateParse.stringToDate(data.start_date_date + " " + data.start_date_time),
            end_date: DateParse.stringToDate(data.end_date_date + " " + data.end_date_time),
        };
        if (tempTrip.route != null && tempTrip.route.polylines == null) tempTrip.route.polylines = polylines;
        if (tempTrip.route != null && route.id == 0) {
            tempTrip.route.name = data.name;
            tempTrip.route!.site = data.site;
            tempTrip.route.description = data.description;
            tempTrip.route.start_point = data.start_point;
            tempTrip.route.end_point = data.end_point;
        }
        try {
            await di.useCases.createTripUseCase?.call(tempTrip);
            addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
        } catch (error) {
            addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
        }
        navigate(routesRouter.trips.path);
    };

    const _loadData = async () => {
        await _searchBusses("");
        await _searchDrivers("");
        await _searchSites("");
        if (id != undefined) _loadTrip();
    }

    useEffect(() => {
    }, [])

    useEffect(() => {
        if (id != undefined && !loaded) return;
        _handleChangeDriver(driver);
    }, [driver])

    useEffect(() => {
        if (id != undefined && !loaded) return;
        _handleChangeRoute(route);
    }, [route])

    useEffect(() => {
        _loadData();
    }, [id]);

    return <div className="add_trip_page">
        <h5>{i18n(id != null ? KeyWordLocalization.AddTripPageTitleEdit : KeyWordLocalization.AddTripPageTitleCreate)}</h5>
        
        {/* Loading indicator for edit mode */}
        {id != null && !loaded && (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading trip data...</p>
                </div>
            </div>
        )}
        
        {/* Form - hidden while loading in edit mode */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: (id != null && !loaded) ? 'none' : 'block' }}>
            <div className="w-100">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="row">
                            <div className={`col-6 mb-3 form-group ${errors.start_date_date ? 'error' : ''}`}>
                                <label>{i18n(KeyWordLocalization.TripEntityInitDate)}</label>
                                <input type="date" className="form-control" placeholder={i18n(KeyWordLocalization.TripEntityInitDate)}
                                    {...register('start_date_date', Validators({ required: true }))} />
                                <ErrorMessage as="aside" errors={errors} name="start_date_date" />
                            </div>
                            <div className={`col-6 mb-3 form-group ${errors.start_date_time ? 'error' : ''}`}>
                                <label>{i18n(KeyWordLocalization.TripEntityInitDateHour)}</label>
                                <input type="time" className="form-control" placeholder={i18n(KeyWordLocalization.TripEntityInitDateHour)}
                                    {...register('start_date_time', Validators({ required: true }))} />
                                <ErrorMessage as="aside" errors={errors} name="start_date_time" />
                            </div>
                            {id != undefined && end_date_date && <div className={`col-6 mb-3 form-group ${errors.end_date_date ? 'error' : ''}`}>
                                <label>{i18n(KeyWordLocalization.TripEntityEndDate)}</label>
                                <input disabled type="date" className="form-control" placeholder={i18n(KeyWordLocalization.TripEntityEndDate)}
                                    {...register('end_date_date')} />
                                <ErrorMessage as="aside" errors={errors} name="end_date_date" />
                            </div>}
                            {id != undefined && end_date_time && <div className={`col-6 mb-3 form-group ${errors.end_date_time ? 'error' : ''}`}>
                                <label>{i18n(KeyWordLocalization.TripEntityEndDateHour)}</label>
                                <input type="time" disabled className="form-control" placeholder={i18n(KeyWordLocalization.TripEntityEndDateHour)}
                                    {...register('end_date_time')} />
                                <ErrorMessage as="aside" errors={errors} name="end_date_time" />
                            </div>}
                            <div className="col-12 col-md-6 mb-3">
                                <AutoCompleteComponent required onSearch={_searchDrivers} errors={errors} label={i18n(KeyWordLocalization.TripEntityDriver)} keyName="driver" onChange={setValue}
                                    register={register} watch={watch} options={[...drivers, ...driver && !drivers.some((driverMap) => driverMap.id == driver.id) ? [driver] : []].map((driver) => { return { label: driver.name, id: driver } })} />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <AutoCompleteComponent required onSearch={_searchBusses} errors={errors} label={i18n(KeyWordLocalization.TripEntityBus)} keyName="bus" onChange={setValue}
                                    register={register} watch={watch} options={busses.map((bus) => { 
                                        const label = `${bus.plate || 'Unknown'} - ${bus.capacity || 0} seats (${bus.company || 'Unknown'})`;
                                        return { label, id: bus };
                                    })} />
                            </div>
                            <div className="col-12 mb-3">
                                <AutoCompleteComponent required onSearch={_searchRoutes} errors={errors} label={i18n(KeyWordLocalization.TripEntityRoute)} keyName="route" onChange={setValue}
                                    register={register} watch={watch} options={routes.map((route) => { return { label: route.name, id: route } })} />
                            </div>
                        </div>
                        <div className={`col-12 mb-3 form-group ${errors.name ? 'error' : ''}`}>
                            <label>{i18n(KeyWordLocalization.RouteEntityName)}</label>
                            <input type="name" className="form-control" placeholder={i18n(KeyWordLocalization.RouteEntityName)}
                                {...register('name', Validators({ required: true }))} disabled={route?.id != 0 ?? true} />
                            <ErrorMessage as="aside" errors={errors} name="name" />
                        </div>
                        <div className={`col-12 mb-3 form-group ${errors.description ? 'error' : ''}`}>
                            <label>{i18n(KeyWordLocalization.RouteEntityDescription)}</label>
                            <textarea className="form-control"
                                {...register('description', Validators({ required: true }))} placeholder={i18n(KeyWordLocalization.RouteEntityDescription)} disabled={route?.id != 0 ?? true} />
                            <ErrorMessage as="aside" errors={errors} name="description" />
                        </div>
                        <div className="col-12 my-3">
                            <AutoCompleteComponent required onSearch={_searchSites} errors={errors} label={i18n(KeyWordLocalization.RouteEntitySite)} keyName="site" onChange={setValue}
                                register={register} watch={watch} options={sites.map((site) => { return { label: site.name, id: site } })} disabled={route?.id != 0 ?? true} />
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
                        <RouteMapComponent editable={route?.id == 0 ?? false} onChangePolylines={setPolylines} busStop={startPoint} siteStop={endPoint} show onChangeSiteStop={onChangeEndPoint} onChangeBusStop={onChangeInitPoint} />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end my-3">
                <button type="submit" className="btn btn-primary">{i18n(KeyWordLocalization.Save)}</button>
            </div>
        </form>
    </div>
}

export default AddTripPage;