import { FC, useEffect, useState } from "react"
import GmapsComponent from "../Gmaps/GmapsComponent";
import RouteMapComponentProps from "./RouteMapComponentProps"
import './RouteMapStyles.scss';

const RouteMapComponent: FC<RouteMapComponentProps> = (props) => {
    const { show, siteStop } = props;
    const [showMap, setShowMap] = useState<boolean>(show ?? false);
    const _loadMap = () => { }

    useEffect(() => {
        if (showMap) {
            _loadMap();
            setShowMap(true);
        }
    }, [showMap]);

    if (showMap === false) return <div className="route_map_component">
        <div className="not_show card d-flex flex-column align-items-center">
            <h3 className="text-center w-100">
                If you want to see it click on “SHOW”
            </h3>
            <button className="btn btn_primary" onClick={() => setShowMap(true)}> SHOW</button>
        </div>
    </div>
    return <div className="route_map_component">
        <GmapsComponent {...props} />
    </div>
}
RouteMapComponent.defaultProps = {
    editable: true
  }
export default RouteMapComponent