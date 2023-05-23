import AlertEntity from "../../entities/AlertEntity";
import AlertProvider from "../../providers/alert/AlertProvider";
import LanguageProvider from "../../providers/language/LanguageProvider";
import ModalsProvider from "../../providers/modal/ModalsProvider";
import AlertRepository from "../../repositories/AlertRepository";

interface props { alertRepository: AlertRepository, alertProvider: AlertProvider }
export default class AlertAttendanceUseCaseGetActiveAlertsUseCase {
    _alertRepository: AlertRepository;
    _alertProvider: AlertProvider;

    constructor(_: props) {
        this._alertRepository = _.alertRepository;
        this._alertProvider = _.alertProvider;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._alertRepository.setAlertAsAttendance(id);
            const copyAlerts = this._alertProvider.contextType?.alerts;
            const alertsFiltred = copyAlerts?.filter((alert: AlertEntity) => alert.id !== id) ?? [];
            console.log('id', id, alertsFiltred)
            console.log('alertsFiltred',alertsFiltred);
            this._alertProvider.contextType?.setAlerts(alertsFiltred);
            resolve();
        } catch (error) {
            return reject(error);
        }
    });
}