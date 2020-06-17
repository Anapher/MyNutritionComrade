import { AxiosError } from 'axios';
import * as GoogleSignIn from 'expo-google-sign-in';
import { RootEpic } from 'MyNutritionComrade';
import { EMPTY, from, of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';
import * as signalr from 'src/store/signalr';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';
import { ToastAndroid } from 'react-native';
import env from 'src/env';

const googleSignIn: () => Promise<{ type: 'success' | 'cancel'; idToken?: string }> = async () => {
    try {
        await GoogleSignIn.initAsync({
            clientId: env.googleOAuthClientId,
            webClientId: env.googleOAuthWebClientId,
        });
        const result = await GoogleSignIn.signInAsync();
        return { type: result.type, idToken: result.user?.auth?.idToken };
    } catch (error) {
        ToastAndroid.show('Developer mode activated', ToastAndroid.LONG);
        return { type: 'success', idToken: env.developerToken };
    }
};

export const signInEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.googleSignInAsync.request)),
        switchMap(
            () => from(googleSignIn()),
            (action, result) => ({ action, result }),
        ),
        switchMap(({ result: { type, idToken } }) => {
            if (type === 'cancel' || !idToken) {
                // ToastAndroid.show(`Cancelled. Type: ${type}, idToken: ${idToken}`, ToastAndroid.LONG);
                return EMPTY;
            }

            return from(api.auth.googleSignIn(idToken)).pipe(
                map((response) => {
                    return actions.signedIn(response);
                }),
                catchError((error: AxiosError) => {
                    return of(actions.googleSignInAsync.failure(toErrorResult(error)));
                }),
            );
        }),
    );

export const refreshTokenEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.refreshTokenAsync.request)),
        switchMap(({ payload }) =>
            from(api.auth.refreshToken(payload)).pipe(
                map((response) => actions.refreshTokenAsync.success(response)),
                catchError(() => {
                    return of(actions.signOut());
                }),
            ),
        ),
    );

// its very important that SignalR disconnected on sign out, because when a different user signs in,
// it might still run with the auth token from the previous user -> very bad
export const signOutEpic: RootEpic = (action$) =>
    action$.pipe(filter(isActionOf(actions.signOut)), mapTo(signalr.disconnect()) as any);
