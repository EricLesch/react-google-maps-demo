import React, {useReducer} from "react";
import {initializeSodaConsumer, query} from '../api/sodaQuery';
import {INCIDENT_CATEGORIES} from '../enumerations/incidentCategories';
import {INCIDENT_HOURS} from "../enumerations/incidentHours";
import {config} from '../config';

interface Incident {
    analysis_neighborhood: string,
    incident_category: string,
    incident_date: string,
    incident_description: string,
    incident_subcategory: string,
    incident_time: string
    intersection: string,
    latitude: string,
    longitude: string,
    police_district: string,
    resolution: string,
    row_id: string,
}

const QUERY_STATE_ACTIONS = {
    UPDATE_INCIDENT_CATEGORY: 'UPDATE_INCIDENT_CATEGORY',
    UPDATE_INCIDENT_HOUR: 'UPDATE_INCIDENT_HOUR',
    UPDATE_INCIDENTS: 'UPDATE_INCIDENTS',
    UPDATE_LIMIT: 'UPDATE_LIMIT',
    SET_ERROR: 'SET_ERROR',
    UPDATE_SELECTED_INCIDENT: "UPDATE_SELECTED_INCIDENT"
};


const initialQueryState: QueryState = {
    incidentCategory: INCIDENT_CATEGORIES[0], // Default is All Categories
    incidentHour: INCIDENT_HOURS[0], // Default is Any Hour
    incidents: [],
    limit: 1000,
    loadingError: null,
    selectedIncident: null
};

const queryStateStore = React.createContext(initialQueryState);

const { Provider }  = queryStateStore;

const queryStateReducer = (state: any, action: any) => {
    const {type, payload} = action;

    switch (type) {
        case QUERY_STATE_ACTIONS.UPDATE_INCIDENT_CATEGORY:
            return {...state, incidentCategory: payload, loadingError: null};
        case QUERY_STATE_ACTIONS.UPDATE_INCIDENT_HOUR:
            return {...state, incidentHour: payload, loadingError: null};
        case QUERY_STATE_ACTIONS.UPDATE_INCIDENTS:
            return {...state, incidents: payload, loadingError: null, selectedIncident: null};
        case QUERY_STATE_ACTIONS.UPDATE_LIMIT:
            return {...state, limit: payload, loadingError: null};
        case QUERY_STATE_ACTIONS.SET_ERROR:
            return {...state, incidents: [], loadingError: payload };
        case QUERY_STATE_ACTIONS.UPDATE_SELECTED_INCIDENT:
            return {...state, selectedIncident: payload }
        default:
            throw new Error("Unrecognized action");
    }
}

export interface QueryState {
    incidentCategory: string,
    incidentHour: string,
    incidents: Array<Incident>,
    limit: number
    loadingError: string | null
    selectedIncident: Incident | null
}
/**
 * Builds the various elements into a query object that ultimately gets fed to the SODA API
 * TODO - refactor and eliminate external soda-js library so this logic is less convoluted
 * @param state
 */
function buildQueryObject(state: QueryState): { limit: number, where: string | undefined , select: Array<string>} {
    const whereClauses: Array<string> = [];

    if (state.incidentCategory !== INCIDENT_CATEGORIES[0]) { // If the user doesn't have 'all' categories selected, filter
        whereClauses.push(`incident_category='${state.incidentCategory}'`);
    }
    if (state.incidentHour !== INCIDENT_HOURS[0]) { // If the user doesn't have 'any' hour selected, filter
        whereClauses.push(`starts_with(incident_time,'${state.incidentHour}')`);
    }

    let where: string | undefined;
    if (whereClauses.length > 1) {
        where = whereClauses.join(' and ')
    } else if (whereClauses.length === 1) {
        where = whereClauses[0];
    }

    // Only select the columns that we might care about.
    const selects = [ "analysis_neighborhood", "incident_category", "incident_date", "incident_description", "incident_subcategory", "incident_time", "intersection", "latitude", "longitude", "police_district", "resolution", "row_id" ];

    return {
        where,
        limit: state.limit,
        select: selects
    };
}

/**
 * Queries the soda api and then updates the incident list in the store. If the query fails, set error message for user
 * @param state
 * @param dispatch
 */
async function queryAndUpdateIncidents(state: QueryState, dispatch: React.Dispatch<any>) {
    const queryObject = buildQueryObject(state);

    try {
        const response = await query(queryObject);

        dispatch(
            {
                type: QUERY_STATE_ACTIONS.UPDATE_INCIDENTS,
                payload: response
            }
        );
    } catch (e) {
        // Failure so inform the user with an error message
        dispatch(
            {
                type: QUERY_STATE_ACTIONS.SET_ERROR,
                payload: "SF Police Data backend responded with an error. Please try again."
            }
        );
    }

}

const QueryStateProvider = (opts: any)  => {
    const {children} = opts;
    const [state, dispatch] = useReducer(queryStateReducer, initialQueryState);

    const value = {
        incidentCategory: state.incidentCategory,
        incidentHour: state.incidentHour,
        limit: state.limit,
        incidents: state.incidents,
        loadingError: state.loadingError,
        selectedIncident: state.selectedIncident,
        setIncidentHour: (incidentHour: string) => {
            dispatch(
                {
                    type: QUERY_STATE_ACTIONS.UPDATE_INCIDENT_HOUR,
                    payload: incidentHour
                }
            );

            queryAndUpdateIncidents({...state, incidentHour}, dispatch);
        },
        setIncidentCategory: (incidentCategory: string) => {
            dispatch(
                {
                    type: QUERY_STATE_ACTIONS.UPDATE_INCIDENT_CATEGORY,
                    payload: incidentCategory
                }
            );

            queryAndUpdateIncidents({...state, incidentCategory}, dispatch);
        },
        setLimit: (limit: number) => {
            dispatch(
                {
                    type: QUERY_STATE_ACTIONS.UPDATE_LIMIT,
                    payload: limit
                }
            );
            queryAndUpdateIncidents({...state, limit}, dispatch)
        },
        updateSelectedIncident: (incident:Incident) => {
            dispatch(
                {
                    type: QUERY_STATE_ACTIONS.UPDATE_SELECTED_INCIDENT,
                    payload: incident
                }
            );
        },
        initializeQueryState: () => {
            // feed the token, domain, and dataset to the Soda Consumer so we can start making queries
            initializeSodaConsumer(config.SF_GOV_ORG_API_TOKEN, 'data.sfgov.org', "wg3w-h783");

            // get the initial list of incidents
            queryAndUpdateIncidents(state, dispatch);
        }

    };

    return <Provider value={value}>{children}</Provider>;
}

export {QueryStateProvider, queryStateStore };