import AlertEntity from "../../entities/AlertEntity";
import AlertProvider from "../../providers/alert/AlertProvider";
import LanguageProvider from "../../providers/language/LanguageProvider";
import ModalsProvider from "../../providers/modal/ModalsProvider";
import AlertRepository from "../../repositories/AlertRepository";

interface props { alertRepository: AlertRepository, alertProvider: AlertProvider, modalsProvider: ModalsProvider, languageProvider: LanguageProvider }
export default class GetActiveAlertsUseCase {
    _alertRepository: AlertRepository;
    _alertProvider: AlertProvider;
    _modalsProvider: ModalsProvider;
    _languageProvider: LanguageProvider;

    constructor(_: props) {
        this._alertRepository = _.alertRepository;
        this._alertProvider = _.alertProvider;
        this._modalsProvider = _.modalsProvider;
        this._languageProvider = _.languageProvider;
    }

    public call = async () => new Promise<AlertEntity[]>(async (resolve, reject) => {
        try {
            const response = await this._alertRepository.getActiveAlerts();
            if (response) {
                const alertsCopy = this._alertProvider.contextType?.alerts ?? [];
                response.forEach((alert: AlertEntity) => {
                    if(alertsCopy.find((alertCopy: AlertEntity) => alertCopy.id === alert.id)) return;
                    const message = this._languageProvider.contextType?.i18n('EmergencyOption' + alert.name) ?? '';
                    this._modalsProvider.contextType?.addToast(message, 'alert', alert);
                });
                this._alertProvider.contextType?.setAlerts(response);
                return resolve(response);
            }
        } catch (error) {
            return reject(error);
        }
    });
}