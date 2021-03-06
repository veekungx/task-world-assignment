import axios from 'axios';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/fromPromise';

import { combineEpics } from 'redux-observable';
import { LOGOUT } from '../../reducers/authReducer';

const intialState = {
  loading: false,
  timezones: [],
  languages: [],
  currencies: [],
  config: undefined,
};

// CONST
export const FETCH_RESOURCE = 'preference/FETCH_RESOURCE';
export const FETCH_RESOURCE_SUCCESS = 'preference/FETCH_RESOURCE_SUCCESS';
export const FETCH_RESOURCE_ERROR = 'preference/FETCH_RESOURCE_ERROR';

// action creators
export const fetchResource = () => ({ type: FETCH_RESOURCE });
export const fetchResourceSuccess = (resources, preference) =>
  ({ type: FETCH_RESOURCE_SUCCESS, resources, preference });
export const fetchResourceError = () => ({ type: FETCH_RESOURCE_ERROR });

// reducer
export const preferenceReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case FETCH_RESOURCE:
      return {
        ...state,
        loading: true,
      };

    case FETCH_RESOURCE_SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.resources,
        config: {
          ...action.preference.localization,
          ...action.preference.privacy,
          ...action.preference.content,
        },
      };
    case LOGOUT:
      return {
        ...state,
        config: undefined,
      };
    default:
      return state;
  }
};

// epic streams
export const fetchResourceEpic = action$ =>
  action$.ofType(FETCH_RESOURCE)
    .switchMap(() => {
      const token = localStorage.getItem('token');
      const languages$ = Observable.fromPromise(axios.get(`${process.env.REACT_APP_API_URI}/languages`));
      const timezones$ = Observable.fromPromise(axios.get(`${process.env.REACT_APP_API_URI}/timezones`));
      const currencies$ = Observable.fromPromise(axios.get(`${process.env.REACT_APP_API_URI}/currencies`));
      const me$ = Observable.fromPromise(axios.get(`${process.env.REACT_APP_API_URI}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }));

      return Observable.forkJoin([languages$, timezones$, currencies$, me$])
        .map((result) => {
          const resources = {
            languages: result[0].data,
            timezones: result[1].data,
            currencies: result[2].data,
          };
          const { preference } = result[3].data;
          return fetchResourceSuccess(resources, preference);
        });
    });

// epic
export const preferenceEpic = combineEpics(fetchResourceEpic);
