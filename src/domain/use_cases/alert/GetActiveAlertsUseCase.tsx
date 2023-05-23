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
            console.log('call get alerts');
            const response = await this._alertRepository.getActiveAlerts();
            console.log('call response', response);
            if (response) {
                const alertsCopy = this._alertProvider.contextType?.alerts ?? [];
                console.log('alertsCopy',alertsCopy);
                console.log('llega');
                response.forEach((alert: AlertEntity) => {
                    console.log('for each',alertsCopy.find((alertCopy: AlertEntity) => alertCopy.id === alert.id))
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