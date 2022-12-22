import AlertEntity from "../../entities/AlertEntity";
import AlertProvider from "../../provider/alert/AlertProvider";
import AlertRepository from "../../repositories/AlertRepository";

interface props { alertRepository: AlertRepository, alertProvider: AlertProvider }
export default class GetActiveAlertsUseCase {
    _alertRepository: AlertRepository;
    _alertProvider: AlertProvider;

    constructor(_:props) {
        this._alertRepository = _.alertRepository;
        this._alertProvider = _.alertProvider;
    }

    public call = async () => new Promise<AlertEntity[]>(async (resolve, reject) => {
        const response = await this._alertRepository.getActiveAlerts();
        if (response) {
            this._alertProvider.actions?.setAlerts(response);
            return resolve(response);
        }
        else return reject();
    });
}