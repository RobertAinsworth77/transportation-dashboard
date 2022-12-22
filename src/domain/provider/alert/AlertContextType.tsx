import AlertEntity from "../../entities/AlertEntity";

type AlertContextType = {
  alerts: AlertEntity[];
  setAlerts: (Alert: AlertEntity[]) => void;
};


export default AlertContextType;