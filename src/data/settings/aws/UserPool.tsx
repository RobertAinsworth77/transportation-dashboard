import * as AWS from "aws-sdk";

import AmazonCognitoIdentity, {
    CognitoUserPool, ICognitoUserPoolData, CognitoUserAttribute,
    CognitoUser,
} from "amazon-cognito-identity-js";

const POOL_ID = 'us-east-1_UvR2lluMh';
export const APP_CLIENT_ID = '5a8aoam5qec91iktcus9bfkig3';
const REGION = 'us-east-1';

AWS.config.region = REGION;

export const CIServiceProvider = new AWS.CognitoIdentityServiceProvider({
    region: REGION,
});

const poolData: ICognitoUserPoolData = {
    UserPoolId: POOL_ID,
    ClientId: APP_CLIENT_ID,

}
export default new CognitoUserPool(poolData);