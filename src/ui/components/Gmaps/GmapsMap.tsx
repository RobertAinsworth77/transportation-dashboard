import React, { useContext, useEffect, useRef } from "react";
import DependencyInjectionContext from "../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../di/provider/DependencyInjectionContextType";
import PositionEntity from "../../../domain/entities/PositionEntity";
import {GMAPS_API_KEY} from "../../utils/Constants";

interface MapProps extends google.maps.MapOptions {
  routeId?: number | undefined;
  style: { [key: string]: string };
  onClicked?: (position: PositionEntity, wh: 'start_point' | 'end_point' | undefined) => void;
  onIdle?: (map: google.maps.Map) => void;
  busStop?: PositionEntity | undefined;
  siteStop?: PositionEntity | undefined;
  busPosition?: PositionEntity | undefined;
  changing?: 'start_point' | 'end_point' | undefined;
  onChangePolylines?: (polylines: PositionEntity[] | undefined) => void;
}

var added = false;
var map: google.maps.Map;
var localChanging: 'start_point' | 'end_point' | undefined;
function MyMapComponent({
  routeId,
  center,
  zoom,
  busStop,
  siteStop,
  busPosition,
  changing,
  onClicked,
  onChangePolylines
}: MapProps) {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const ref = useRef<HTMLDivElement>(null);
  const [busMarker, setBusMarker] = React.useState<google.maps.Marker | undefined>(undefined);
  const [siteStopMarker, setSiteStopMarker] = React.useState<google.maps.Marker | undefined>(undefined);
  const [busStopMarker, setBusStopMarker] = React.useState<google.maps.Marker | undefined>(undefined);
  const [polylines, setPolylines] = React.useState<google.maps.Polyline | undefined>(undefined);


  const _onClickMap = (e: google.maps.MapMouseEvent) => {
    const pos = e?.latLng?.toJSON();
    if (pos != null) onClicked?.({ lat: pos.lat, lng: pos.lng }, localChanging);
  };

  const _addBusMarker = () => {
    if (busPosition == null) return;
    busMarker?.setMap(null);
    const _busMarker = new google.maps.Marker({
      position: busPosition,
      map: map,
      title: "Bus",
      icon: {
        url: "/assets/transportation/maps/busMarker.png",
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      },
    });
    setBusMarker(_busMarker);
  };

  const _addBusStopMarker = () => {
    if (busStop == null) return;
    busStopMarker?.setMap(null);
    const _busStopMarker = new google.maps.Marker({
      position: busStop,
      map: map,
      title: "Bus Stop",
      icon: {
        url: "/assets/transportation/maps/busStop.png",
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      },
    });
    setBusStopMarker(_busStopMarker);

  };

  const _addSiteStopMarker = () => {
    if (siteStop == null) return;
    siteStopMarker?.setMap(null);
    const _siteStopMarker = new google.maps.Marker({
      position: siteStop,
      map: map,
      title: "Site",
      icon: {
        url: "/assets/transportation/maps/goalMap.png",
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      },
    });
    setSiteStopMarker(_siteStopMarker);
  };

  const _removePolyline = () => {
    if (map != null) {
      polylines?.setMap(null);
      setPolylines(undefined);
    }
  };

  const _getPolylines = async () => {
    const waitForGeometryLibraries = async () => {
      // console.log('llega a get pot b', typeof google.maps.geometry !== "undefined", google.maps.geometry);
      if (busStop == null || siteStop == null) return;
      if (typeof google.maps.geometry !== "undefined") {
        console.log('llega a get po');
        // polylines?.setMap(null);
        _removePolyline();
        if (busStop == null || siteStop == null) return;
        if ((busStop?.lat == 0 && busStop.lng == 0) || (siteStop?.lat == 0 && siteStop?.lng == 0)) return;
        const response = await (routeId != null ? di.useCases.getPolylinesOfRouteUseCase.call(routeId!, busStop, siteStop) : di.useCases.getPolylinesOfTwoPointnsUseCase.call(busStop, siteStop));
        onChangePolylines?.(response);
        if (response == null) return;
        const flightPath = new google.maps.Polyline({
          path: response,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        var bounds = new google.maps.LatLngBounds();
        bounds.extend(busStop);
        bounds.extend(siteStop);
        setPolylines(flightPath);
        map.fitBounds(bounds);
        flightPath.setMap(map);
      }
      else {
        // console.log('llega a get pot error but added', added, window)
        if (!added) {
          console.log('llega a get pot error but not added')
          const script = document.createElement("script");
          script.src = "https://maps.googleapis.com/maps-api-v3/api/js/52/4/geometry.js";
          script.async = true;
          document.body.appendChild(script);
          added = true;
        }
        setTimeout(waitForGeometryLibraries, 250);
      }
    }
    setTimeout(waitForGeometryLibraries, 250);

  }

  useEffect(() => {
    if (ref.current) {
      map = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      // _addBusMarker();
      // _addBusStopMarker();
      // _addSiteStopMarker();
      // _getPolylines();
      map.addListener("click", _onClickMap);
    }
  }, [ref]);

  useEffect(() => {
    localChanging = changing;
  }, [changing]);

  useEffect(() => {
    _addBusStopMarker();
    _addSiteStopMarker();
    _getPolylines();

  }, [siteStop, busStop]);

  useEffect(() => {
    _addBusMarker();
  }, [busPosition]);


  return <><div ref={ref} id="map" style={{ width: '100%', minHeight: 500 }} /></>;
}

MyMapComponent.defaultProps = {
  busStop: undefined,
  siteStop: undefined,
  busPosition: undefined,
  onChangeBusStop: undefined,
  onChangeSiteStop: undefined,
  onChangePolylines: undefined,
}
export default MyMapComponent;