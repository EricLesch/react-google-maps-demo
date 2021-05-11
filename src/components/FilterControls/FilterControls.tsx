import React, {useContext} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import {TextField} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';

import './FilterControls.css';

import {INCIDENT_CATEGORIES} from '../../enumerations/incidentCategories';
import {queryStateStore} from "../../state/QueryStateProvider";
import {INCIDENT_HOUR_STRINGS, INCIDENT_HOURS} from "../../enumerations/incidentHours";

/**
 * Renders each of the following controls
 *   - Select Incident Category for filtering incidents
 *   - Select Incident Hour for filtering incidents
 *   - Select max number of records to return on the map
 * @constructor
 */
function FilterControls() {
    const queryStateContext: any = useContext(queryStateStore);

    const {incidentCategory, incidentHour, limit, setIncidentCategory, setIncidentHour, setLimit, loadingError} = queryStateContext;

    const incidentCategoryOptions: Array<JSX.Element> = INCIDENT_CATEGORIES.map((value) =>
        <option value={value} key={value}>{value}</option>
    );

    const incidentHourOptions: Array<JSX.Element> = INCIDENT_HOURS.map((value) =>
        <option value={value} key={value}>{(INCIDENT_HOUR_STRINGS as any)[value]}</option>
    );

    const errorMessage = loadingError !== null ? <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {loadingError}
        </Alert> : <></>;

    return <div className="filterControls">
        <h2 className="sectionHeader pv15 mv0">
           Incident Filters
        </h2>
        {errorMessage}
        <div>
            <FormControl variant="filled" className="width100">
                <InputLabel >Incident Category</InputLabel>
                <Select
                    native
                    value={incidentCategory}
                    onChange={(event) => setIncidentCategory(event.target.value as string)}
                    inputProps={{
                        name: 'incident_category',
                    }}
                >
                    {incidentCategoryOptions}
                </Select>
            </FormControl>
        </div>
        <div>
            <FormControl variant="filled" className="width100">
                <InputLabel>Incident Hour</InputLabel>
                <Select
                    native
                    value={incidentHour}
                    onChange={(event) => setIncidentHour(event.target.value as string)}
                    inputProps={{
                        name: 'incident_hour',
                    }}
                >
                    {incidentHourOptions}
                </Select>
            </FormControl>
            <FormControl variant="filled" className="width100">
                <TextField
                    value={limit}
                    onChange={(event) => setLimit(event.target.value)}
                    id="filled-number"
                    label="Max Number of Incidents"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                />
            </FormControl>
        </div>
    </div>;
}

export {FilterControls};