import React, { FC, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, HashRouter } from "react-router-dom";
import DependencyInjectionContext from "../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../di/provider/DependencyInjectionContextType";
import { UserEntityRole } from "../../domain/entities/UserEntity";
import KeyWordLocalization from "../../domain/providers/language/dictionaries/KeyWordLocalization";
import UserContext from "../../domain/providers/user/UserContext";
import UserContextType from "../../domain/providers/user/UserContextType";
import LayoutComponent from "../components/Layout/LayoutComponent";
import RoutesComponentProps from "./RoutesComponentProps";
import { MdPerson, MdOutlineEmojiTransportation } from 'react-icons/md';
import HomePage from "../pages/home/HomePage";
import DriversPage from "../pages/driver/DriversPage";
import UsersPage from "../pages/user/UsersPage";
import TripPage from "../pages/trip/TripPage";
import DetailedTripPage from "../pages/trip/detailed/DetailedTripPage";
import RoutePage from "../pages/route/RoutePage";
import DetailedRoutePage from "../pages/route/detailed/DetailedRoutePage";
import AddRoutePage from "../pages/route/add/AddRoutePage";
import AddTripPage from "../pages/trip/add/AddTripPage";
import SitesPage from "../pages/sites/SitesPage";
import SignInPage from "../pages/auth/signin/SignInPage";
import UpdatePasswordRecoveryPage from "../pages/auth/recovery/updatePasswordRecovery/UpdatePasswordRecoveryPage";
import SendCodeRecoveryPage from "../pages/auth/recovery/sendCodeRecovery/SendCodeRecoveryPage";
import BussesPage from "../pages/busses/BussesPage";
import NotFoundComponent from "../components/notFound/NotFoundComponent";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import LoadingComponent from "../components/LoadingComponent/LoadingComponent";
import ConfirmAccountPage from "../pages/auth/confirmAccount/ConfirmAccountPage";
import PeoplePage from "../pages/people/PeoplePage";
import TransportPage from "../pages/transport/TransportPage";
import { response as CheckIfUpdateUseCaseResponse } from '../../domain/use_cases/updateApp/CheckIfUpdateUseCase';
import ShowUpdateComponent from "../components/showUpdate/ShowUpdateComponent";
import RouteAlignmentPage from "../pages/routeAlignment/RouteAlignmentPage";

const routes = {
    error_404: {
        name: 'Error 404',
        path: "/error/404",
        relativePath: '/error/404',
        component: NotFoundComponent,
        users: [UserEntityRole.admin, UserEntityRole.normal, undefined],
    },
    signin: {
        name: 'Sign in',
        path: "/",
        relativePath: '/',
        component: SignInPage,
        users: [undefined],
    },

    send_code_recovery: {
        name: 'Send Code',
        path: '/recovery/send-code',
        relativePath: '/recovery/send-code',
        component: SendCodeRecoveryPage,
        users: [undefined],
    },
    update_passowrd_recovery: {
        name: 'Update Password',
        path: '/recovery/update-password/:email',
        relativePath: '/recovery/update-password',
        component: UpdatePasswordRecoveryPage,
        users: [undefined],
    },
    confimr_account: {
        name: 'Confirm Account',
        path: '/confirm-account/:email',
        relativePath: '/confirm-account',
        component: ConfirmAccountPage,
        users: [undefined],
    },
    drivers: {
        name: KeyWordLocalization.DriversPageName,
        path: "/people/drivers",
        relativePath: '/people/drivers',
        component: DriversPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    users: {
        name: KeyWordLocalization.UsersPageName,
        path: "/people/users",
        relativePath: '/people/users',
        component: UsersPage,
        users: [UserEntityRole.admin],
    },
    home: {
        name: KeyWordLocalization.HomePageName,
        path: "/home",
        relativePath: '/home',
        component: HomePage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    people: {
        name: KeyWordLocalization.UsersHomePageName,
        path: "/people",
        relativePath: '/people',
        component: PeoplePage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    transport: {
        name: KeyWordLocalization.TransportModule,
        path: "/transport",
        relativePath: '/transport',
        component: TransportPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    trips: {
        name: KeyWordLocalization.TripsPageName,
        path: "/transport/trips",
        relativePath: "/transport/trips",
        component: TripPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    trip: {
        name: KeyWordLocalization.TripsPageName,
        path: "/transport/trips/:id",
        relativePath: "/transport/trips",
        component: DetailedTripPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    add_trip: {
        name: KeyWordLocalization.AddTripPageName,
        path: "/transport/trips/add",
        relativePath: "/transport/trips/add",
        component: AddTripPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    edit_trip: {
        name: KeyWordLocalization.TripsPageName,
        path: "/transport/trips/edit/:id",
        relativePath: "/transport/trips/edit",
        component: AddTripPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    busses: {
        name: 'Busses',
        path: "/transport/busses",
        relativePath: '/transport/busses',
        component: BussesPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    route: {
        name: KeyWordLocalization.RoutesPageName,
        path: "/transport/routes/:id",
        relativePath: "/transport/routes",
        component: DetailedRoutePage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    add_route: {
        name: KeyWordLocalization.AddRoutePageName,
        path: "/transport/routes/add",
        relativePath: "/transport/routes/add",
        component: AddRoutePage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    edit_route: {
        name: KeyWordLocalization.RoutesPageName,
        path: "/transport/routes/edit/:id",
        relativePath: "/transport/routes/edit",
        component: AddRoutePage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    routes: {
        name: KeyWordLocalization.RoutesPageName,
        path: "/transport/routes",
        relativePath: "/transport/routes",
        component: RoutePage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    sites: {
        name: KeyWordLocalization.SitesPageName,
        path: "/sites",
        relativePath: "/sites",
        component: SitesPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
    routeAlignment: {
        name: 'Route Alignment',
        path: "/transport/route-alignment",
        relativePath: "/transport/route-alignment",
        component: RouteAlignmentPage,
        users: [UserEntityRole.admin, UserEntityRole.normal],
    },
}

const modules = [
    {
        name: KeyWordLocalization.UsersModule,
        page: routes.people,
        icon: MdPerson,
        pages: [
            routes.drivers,
            routes.users,
        ],
    },
    {
        name: KeyWordLocalization.TransportModule,
        page: routes.transport,
        icon: MdOutlineEmojiTransportation,
        pages: [
            routes.trips,
            routes.routes,
            routes.sites,
            routes.routeAlignment,
            routes.busses,
            routes.add_trip,
            routes.add_route,
        ],
    },
]

const RoutesComponent: React.FC<RoutesComponentProps> = ({ children }) => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { user } = useContext(UserContext) as UserContextType;
    const [loaded, setLoaded] = useState<boolean>(false);
    const [showUpdate, setShowUpdate] = useState<CheckIfUpdateUseCaseResponse>(CheckIfUpdateUseCaseResponse.UPDATE_NOT_AVAILABLE);

    const _load = async () => {
        try {
            const needUpdate: CheckIfUpdateUseCaseResponse = await di.useCases.checkIfUpdateUseCase.call();
            setShowUpdate(needUpdate);
            if (needUpdate == CheckIfUpdateUseCaseResponse.UPDATE_REQUIRED) {
                di.useCases.downloadLastVersionUseCase.call();
            }
            await di.useCases.loadUseCase.call();
        } catch (_) { }
        setLoaded(true);
    }
    useEffect(() => {
        _load();
    }, []);

    if (showUpdate != CheckIfUpdateUseCaseResponse.UPDATE_NOT_AVAILABLE) return <div className="bg_1" style={{ width: '100vw', height: '100vh' }}>
        <ShowUpdateComponent showClose={showUpdate == CheckIfUpdateUseCaseResponse.UPDATE_AVAILABLE} onClose={() => setShowUpdate(CheckIfUpdateUseCaseResponse.UPDATE_NOT_AVAILABLE)} /> </div>
    if (!loaded) return <div className="bg_1" style={{ width: '100vw', height: '100vh' }}>
        <LoadingComponent showLogo />
    </div>
    return <>
        <HashRouter>
            <Routes>
                {Object.values(routes).map((route: any) => <Route key={route.path} path={route.path} element={
                    route.users.includes(user?.role ?? undefined) ? <LayoutComponent >
                        {React.createElement(route.component, {}, undefined)}
                    </LayoutComponent > : <NotFoundComponent />
                }>
                </Route>)}
                <Route path='*' element={<NotFoundComponent />} />
            </Routes>
        </HashRouter>
    </>
}

export default RoutesComponent;
export { routes, RoutesComponent, modules };
