import UserEntity, { UserEntityRole, UserEntityStatus } from "../../../domain/entities/UserEntity";
import AuthRepository from "../../../domain/repositories/AuthRepository";
import UserPool, { APP_CLIENT_ID, CIServiceProvider } from "../../settings/aws/UserPool";
import { CognitoUser, AuthenticationDetails, } from "amazon-cognito-identity-js";
import HostApi from "../../settings/host/HostApi";
import UserHostDto from "../../dto/user/UserHostDto";
import UserAccountEntity from "../../../domain/entities/UserAccountEntity";

const _getUserFromDb = (): Promise<UserEntity> => new Promise<UserEntity>(async (resolve, reject) => {
    try {
        const response = await HostApi.post('/get_admin_user_information', { email: HostApi.getEmail() });
        const body = { ...response.data[0], user_id: response.data[0].employee_id };
        const user = UserHostDto.fromJson(body);
        return resolve(user);
    } catch (error) {
        reject(error);
    }
})
const AuthRepositoryImpl: AuthRepository = {
    signIn: (email: string, password: string): Promise<UserEntity> => new Promise<UserEntity>((resolve, reject) => {
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        })

        user.authenticateUser(authDetails, {
            onSuccess: async (data) => {
                //save token to local storage
                HostApi.setToken(data.getIdToken().getJwtToken());
                HostApi.setEmail(email);
                const user = await _getUserFromDb();
                resolve(user);
            },
            onFailure: (err) => {
                reject(err);
                //delete token
                HostApi.removeToken();
                HostApi.removeEmail();
            },
            newPasswordRequired: (data) => {
                reject(data);
            },
        });
    }),
    signOut: (): Promise<void> => new Promise<void>((resolve, reject) => {
        UserPool.getCurrentUser()?.signOut();
        //delete token from local storage
        HostApi.removeToken();
        HostApi.removeEmail();
        resolve();
    }),
    sendRecoveryCode: (email: string): Promise<void> => new Promise<void>(async (resolve, reject) => {
        //aws send recovery code
        const params = {
            ClientId: APP_CLIENT_ID,
            Username: email
        };
        try {
            await CIServiceProvider.forgotPassword(params).promise();
            resolve();
        } catch (error) {
            reject();
        }
    }),
    confirmUser: (email: string, code: string): Promise<void> => new Promise<void>(async (resolve, reject) => {
        //AWS confirm user
        console.log('try confirm user');
        const params = {
            ClientId: APP_CLIENT_ID,
            ConfirmationCode: code,
            Username: email
        };
        console.log('b try ;', params);
        try {
            await CIServiceProvider.confirmSignUp(params).promise();
            resolve();
        }
        catch (error) {
            console.log('error', error);
            reject();
        }

    }),
    sendConfirmCode: (email: string): Promise<void> => new Promise<void>(async (resolve, reject) => {
        //aws send recovery code
        console.log('try send recovery code');
        const params = {
            ClientId: APP_CLIENT_ID,
            Username: email
        };
        console.log('b try ;', params);
        try {
            await CIServiceProvider.resendConfirmationCode(params).promise();
            resolve();
        } catch (error) {
            console.log('error', error);
            reject();
        }
    }),
    updatePasswordByRecovery: (email: string, newPassword: string, code: string): Promise<void> => new Promise<void>((resolve, reject) => {
        //aws update password by recovery
        const params = {
            ClientId: APP_CLIENT_ID,
            ConfirmationCode: code,
            Password: newPassword,
            Username: email
        };
        CIServiceProvider.confirmForgotPassword(params, (err, data) => {
            if (err) {
                reject(err.code);
            }
            else {
                resolve();
            }
        })
    }),
    getCurrentUser: (): Promise<UserEntity> => new Promise<UserEntity>((resolve, reject) => {
        const user = UserPool.getCurrentUser();
        if (user) {
            user.getSession((err: any, session: any) => {
                if (err) {
                    return reject(err);
                } else {
                    try {
                        const token = session.getIdToken().getJwtToken();
                        HostApi.setToken(token);
                        const currentUser = _getUserFromDb();
                        return resolve(currentUser);
                    } catch (error) {
                        return reject(error);
                    }
                }
            });
        }
        else reject();
    }),
    addUser: (user: UserAccountEntity, password: string): Promise<void> => new Promise<void>(async (resolve, reject) => {
        //aws add user
        const params = {
            ClientId: APP_CLIENT_ID,
            Password: password,
            Username: user.email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: user.email
                },
                {
                    Name: 'phone_number',
                    Value: "+" + user.phone.replace(/\D/g, '')
                },
                {
                    Name: 'name',
                    Value: user.name
                },
                {
                    Name: 'family_name',
                    Value: user.name
                },
                {
                    Name: 'middle_name',
                    Value: user.name
                }
            ]
        };
        try {
            await CIServiceProvider.signUp(params).promise();
            resolve();
        } catch (error) {
            console.log('error', error);
            reject(error);
        }
    }),
    deleteUser: (): Promise<void> => new Promise<void>((resolve, reject) => {
        //aws delete user
        const user = UserPool.getCurrentUser();
        if (user) {
            user.getSession((err: any, session: any) => {
                if (err) {
                    return reject(err);
                } else {
                    const token = session.getIdToken().getJwtToken();
                    HostApi.setToken(token);
                    const params = {
                        AccessToken: token
                    };
                    CIServiceProvider.deleteUser(params, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    })
                }
            });
        }
        else reject();
    }),
    refreshToken: (): Promise<void> => new Promise<void>((resolve, reject) => {
        //aws refresh token
        const user = UserPool.getCurrentUser();
        if (user) {
            user.getSession((err: any, session: any) => {
                if (err) {
                    return reject(err);
                } else {
                    const token = session.getIdToken().getJwtToken();
                    HostApi.setToken(token);
                    resolve();
                }
            });
        }
        else reject();
    }),
}

export default AuthRepositoryImpl;