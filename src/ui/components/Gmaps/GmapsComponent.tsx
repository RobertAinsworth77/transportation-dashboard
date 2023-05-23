import './GmapsStyles.scss';
import { FC, useContext, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GMAPS_API_KEY } from "../../utils/Constants";
import GmapsMap from "./GmapsMap";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import PositionEntity from "../../../domain/entities/PositionEntity";
import KeyWordLocalization from "../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';

const render = (status: Status) => {
  return <LoadingComponent />;
};

interface GmapsComponentProps {
  editable?: boolean,
  routeId?: number | undefined;
  busStop?: PositionEntity | undefined;
  siteStop?: PositionEntity | undefined;
  busPosition?: PositionEntity | undefined;
  onChangeBusStop?: (position: PositionEntity) => void | undefined;
  onChangeSiteStop?: (position: PositionEntity) => void | undefined;
  onChangePolylines?: (polylines: PositionEntity[] | undefined) => void;
}

const GmapsComponent: FC<GmapsComponentProps> = (props) => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  
  const { busStop, siteStop, busPosition, onChangeBusStop, onChangeSiteStop, onChangePolylines, editable } = props;
  const [changing, setChanging] = useState<'start_point' | 'end_point' | undefined>(undefined);
  const _calculateMiddlePoint = () => {
    if (busStop?.lat == 0 && busStop.lng == 0 && siteStop?.lat == 0 && siteStop?.lng == 0) return {
      lat: 18.28075,
      lng: -78.073048,
    };
    if (busStop && siteStop) {
      const lat = (busStop.lat + siteStop.lat) / 2;
      const lng = (busStop.lng + siteStop.lng) / 2;
      return { lat, lng };
    }
    return {
      lat: 18.28075,
      lng: -78.073048,
    };
  }

  const _handleClickInitPosition = () => setChanging(changing == 'start_point' ? undefined : 'start_point');
  const _handleClickEndPosition = () => setChanging(changing == 'end_point' ? undefined : 'end_point');

  const _handleClickMap = (position: PositionEntity, wh: 'start_point' | 'end_point' | undefined) => {
    if (wh == 'start_point') onChangeBusStop?.(position);
    if (wh == 'end_point') onChangeSiteStop?.(position);
    setChanging(undefined);
  }


  return <div className="gmaps_component">
    <Wrapper apiKey={GMAPS_API_KEY} render={render} >
      <GmapsMap
        changing={changing}
        onClicked={_handleClickMap}
        center={busPosition ?? _calculateMiddlePoint()}
        {...{ busPosition, busStop, siteStop, onChangePolylines, editable }}
        zoom={10}
        style={{ flexGrow: "1", height: "100%" }}
      ></GmapsMap>
    </Wrapper>
    <div className="btn_container">
      {editable && <button type="button" className={`btn ${changing == 'start_point' ? 'btn-primary' : 'btn-light'}`} onClick={_handleClickInitPosition}>{i18n(KeyWordLocalization.GmapsComponentInitPosition)}</button>}
      {editable && <button type="button" className={`btn ${changing == 'end_point' ? 'btn-primary' : 'btn-light'}`} onClick={_handleClickEndPosition}>{i18n(KeyWordLocalization.GmapsComponentEndPosition)}</button>}
    </div>
  </div>
}

GmapsComponent.defaultProps = {
  editable: true
}

export default GmapsComponent;