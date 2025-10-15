import './DetailedTripStyles.scss';
import { useEffect } from "react";
import { FC, useContext, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import DependencyInjectionContext from "../../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../../di/provider/DependencyInjectionContextType";
import TripEntity, { TripState } from "../../../../domain/entities/TripEntity";
import KeyWordLocalization from "../../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../../domain/providers/language/LanguageContextType";
import CardCounterComponent from "../../../components/cardCounter/CardCounterComponent";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import RouteMapComponent from "../../../components/RouteMap/RouteMapComponent";
import { routes } from "../../../routes/RoutesComponent";
import StringOptions from "../../../utils/StringOptions";
import NotFoundComponent from '../../../components/notFound/NotFoundComponent';
import NotResultsComponent from '../../../components/notResults/NotResultsComponent';

const DetailedTripPage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { id } = useParams<{ id: string }>();

    const [trip, setTrip] = useState<TripEntity | null | undefined>(undefined);

    const _loadTrip = async () => {
        try {
            const trip = await di.useCases.getTripByIdUseCase?.call(parseInt(id!));
            setTrip(trip);
        } catch (error) {
            setTrip(null);
        }
    }

    useEffect(() => {
        _loadTrip();
    }, [id]);

    if (trip === undefined) return <LoadingComponent />
    else if (trip === null) return <NotResultsComponent />
    return <div className="detailed_trip_page">
        <div className="row">
            <div className="col-lg-9">
                <h5>{i18n(KeyWordLocalization.DetailedTripPageTitle)} - {i18n(trip!.state)}</h5>
            </div>
            <div className="col-lg-3 d-flex jutify-content-end align-items-center">
                {
                    trip.state == TripState.inProgress &&
                    <Link to={`${routes.edit_trip.relativePath}/${id}`} className="btn btn-light d-flex align-items-center mx-3">
                        <MdEdit />
                        <span className="mx-2">{i18n(KeyWordLocalization.Edit)}</span>
                    </Link>
                }
                {/* <button type="button" className="btn btn-light d-flex align-items-center">
                    <MdDelete />
                    <span className="mx-2">{i18n(KeyWordLocalization.Delete)}</span>
                </button> */}
            </div>
        </div>
        <div className="row mt-3">
            <div className="col-lg-9">
                <div className="row">
                    <div className="col-lg-4 mb-3">
                        <CardCounterComponent title={i18n(KeyWordLocalization.TripEntityId)} counter={trip.id} />
                    </div>
                    <div className="col-lg-4 mb-3">
                        <CardCounterComponent title={i18n(KeyWordLocalization.TripEntityBookingsCount)} counter={trip.bookings_pending_count ?? 0} />
                    </div>
                    <div className="col-lg-4 mb-3">
                        <CardCounterComponent title={i18n(KeyWordLocalization.TripEntityPassengersCount)} counter={trip.passengers_count ?? 0} />
                    </div>
                </div>
                <div className="w-100 card p-3 my-3">
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <h3>Trip Details</h3>
                        </div>
                        <div className="col-lg-4 my-3">
                            <strong>Driver</strong><br />
                            <span>{trip.driver?.name || 'Not assigned'}</span>
                        </div>
                        <div className="col-lg-4 my-3">
                            <strong>Bus</strong><br />
                            <span>{trip.bus?.plate || `Bus #${trip.bus?.id}` || 'Not assigned'}</span>
                        </div>
                        <div className="col-lg-4 my-3">
                            <strong>Start Time</strong><br />
                            <span>{trip.start_date ? new Date(trip.start_date).toLocaleString() : 'Not set'}</span>
                        </div>
                        <div className="col-lg-4 my-3">
                            <strong>End Time</strong><br />
                            <span>{trip.end_date ? new Date(trip.end_date).toLocaleString() : 'Not set'}</span>
                        </div>
                        <div className="col-lg-4 my-3">
                            <strong>Status</strong><br />
                            <span>{i18n(trip.state)}</span>
                        </div>
                        <div className="col-lg-4 my-3">
                            <strong>Site</strong><br />
                            <span>{trip.route?.site?.name || 'Not specified'}</span>
                        </div>
                    </div>
                </div>
                <div className="w-100 card p-3 my-3">
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="row">
                                <h3 className="w-100">{i18n(KeyWordLocalization.TripEntityRoute)}</h3>
                                <div className="col-lg-6 my-3">
                                    <strong>{i18n(KeyWordLocalization.RouteEntityName)}</strong><br />
                                    <span style={{whiteSpace: 'pre-line'}}>{trip.route?.name}</span>
                                </div>
                                <div className="col-lg-6 my-3">
                                    <strong>{i18n(KeyWordLocalization.RouteEntityStartPoint)}</strong><br />
                                    <span>{trip.route?.start_point.lat} - {trip.route?.start_point.lng}</span>
                                </div>
                                <div className="col-lg-6 my-3">
                                    <strong>{i18n(KeyWordLocalization.RouteEntityDescription)}</strong><br />
                                    <span style={{whiteSpace: 'pre-line'}}>{trip.route?.description}</span>
                                </div>
                                <div className="col-lg-6 my-3">
                                    <strong>{i18n(KeyWordLocalization.RouteEntityEndPoint)}</strong><br />
                                    <span>{trip.route?.end_point.lat} - {trip.route?.end_point.lng}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            {trip.route != null && <RouteMapComponent busPosition={trip.position} busStop={trip.route!.start_point} siteStop={trip.route.end_point} show={trip.state == TripState.inProgress} routeId={trip.route_id} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-3">
                <div className="card py-3">
                    <h5 className="w-100 text-center">
                        {i18n(KeyWordLocalization.TripEntityPassengers)}
                    </h5>
                    {trip.passengers.map((passenger) => <div key={passenger.id} className="d-flex my-2 px-3 align-items-center">
                        <div className="circle_name">
                            {StringOptions.GetFirstLetterOfEachWord(passenger.name + ' ' + passenger.lastname)}
                        </div>
                        <div className="flex-grow-1">
                            <div className="passenger_content">
                                <strong>{passenger.name} {passenger.lastname}</strong>
                                <span>{i18n(KeyWordLocalization.DetailedTripPassengerOnBoard)}</span>
                            </div>
                        </div>
                    </div>)}
                    {trip.bookings.map((passenger) => <div key={passenger.id} className="d-flex my-2 px-3 align-items-center">
                        <div className="circle_name">
                        {StringOptions.GetFirstLetterOfEachWord(passenger.name + ' ' + passenger.lastname)}
                        </div>
                        <div className="flex-grow-1">
                            <div className="passenger_content">
                                <strong>{passenger.name} {passenger.lastname}</strong>
                                <span>{i18n(KeyWordLocalization.DetailedTripPassengerBooked)}</span>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    </div>
}

export default DetailedTripPage;