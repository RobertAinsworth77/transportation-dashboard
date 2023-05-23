import GetActiveAlertsUseCase from "../alert/GetActiveAlertsUseCase";
import GetCurrentUserUseCase from "../auth/GetCurrentUserUseCase";

interface props { getCurrentUserUseCase: GetCurrentUserUseCase, getActiveAlertsUseCase: GetActiveAlertsUseCase }
export default class LoadUseCase {
    _getCurrentUserUseCase: GetCurrentUserUseCase;
    _getActiveAlertsUseCase: GetActiveAlertsUseCase;

    constructor(_: props) {
        this._getCurrentUserUseCase = _.getCurrentUserUseCase;
        this._getActiveAlertsUseCase = _.getActiveAlertsUseCase;
    }

    public call = async () => new Promise<void>(async (resolve, reject) => {
        try {
            await this._getCurrentUserUseCase.call();
            try {
                await this._getActiveAlertsUseCase.call();
                return resolve();
            } catch (error) {
                return resolve()
            }
        } catch (error) {
            console.log('error', error);
            return reject();
        }
    });
}