import React, {useContext} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './IncidentDetailView.css';

import {queryStateStore} from "../../state/QueryStateProvider";

/**
 * Simply displays interesting information about an incident that has been clicked. If no incident has been clicked, it
 * is not visible.
 * @constructor
 */
function IncidentDetailView() {
    const queryStateContext: any = useContext(queryStateStore);

    const {selectedIncident} = queryStateContext;

    let html;
    if (selectedIncident) {
        const rows = [
            {
                name: "Neighborhood",
                value: selectedIncident.analysis_neighborhood
            },
            {
                name: "Category",
                value: selectedIncident.incident_category
            },
            {
                name: "Subcategory",
                value: selectedIncident.incident_subcategory
            },
            {
                name: "Description",
                value: selectedIncident.incident_description
            },
            {
                name: "Intersection",
                value: selectedIncident.intersection
            },
            {
                name: "Date",
                value: new Date(selectedIncident.incident_date).toDateString()
            },
            {
                name: "Time",
                value: selectedIncident.incident_time
            }
        ];

        html = <div className="mt20 incidentDetailView ">
            <h2 className="sectionHeader mv0 pl15 pt15 pb5">
                Incident Details
            </h2>
            <div className="incidentDetailList mb20">
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>;
    } else {
        html = <></>;
    }

    return html;

}

export {IncidentDetailView}