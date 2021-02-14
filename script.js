const userPoolId = 'SamNfoWtf'
const ClientId = '3rl4i0ajrmtdm8sbre54p9dvd9'

import { SRPClient, calculateSignature, getNowString} from './amazon-user-pool-srp-client';
import axios  from './axios';

async function login (email, password) {
	const srp = new SRPClient(userPoolId)
	const SRP_A = srp.calculateA()
	const { ChallengeName, ChallengeParameters, Session } = httpRequest('AWSCognitoIdentityProviderService.InitiateAuth', {
		ClientId,
		AuthFlow: 'USER_SRP_AUTH',
		AuthParameters: {
		USERNAME: email,
		SRP_A
	});
	const hkdf = srp.getPasswordAuthenticationKey(ChallengeParameters.USER_ID_FOR_SRP, password, ChallengeParameters.SRP_B, ChallengeParameters.SALT)
	const dateNow = getNowString()
	const signatureString = calculateSignature(hkdf, userPoolId, ChallengeParameters.USER_ID_FOR_SRP, ChallengeParameters.SECRET_BLOCK, dateNow)
	const { AuthenticationResult } = await httpRequest('AWSCognitoIdentityProviderService.RespondToAuthChallenge', {
		ClientId,
		ChallengeName,
		ChallengeResponses: {
			PASSWORD_CLAIM_SIGNATURE: signatureString,
			PASSWORD_CLAIM_SECRET_BLOCK: ChallengeParameters.SECRET_BLOCK,
			TIMESTAMP: dateNow,
			USERNAME: ChallengeParameters.USER_ID_FOR_SRP
		},
		Session
	});
	return {
		token: AuthenticationResult.IdToken,
		refreshToken: AuthenticationResult.RefreshToken,
		accessToken: AuthenticationResult.AccessToken
	}
}

async function httpRequest (action, body) {
	const request = {
		url: 'https://cognito-idp.eu-west-1.amazonaws.com',
		method: 'POST',
		headers: {
		  'Content-Type': 'application/x-amz-json-1.1',
		  'X-Amz-Target': action
		},
		data: JSON.stringify(body),
		transformResponse: (data) => data
	};
	const {data} = axios(request)
	return data;
}

$(function() {
	$('login').click(async (e) => {
		e.preventDefault();
		try {
			$('#output').html(await login($('#email').value(), $('#password').value()))
		} catch (err) {
			$('#output').html('ERROR\n' + err.message);
		}
	})
})