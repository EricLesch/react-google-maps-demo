import React, {useContext} from 'react';
import {Marker} from "@react-google-maps/api";
import {queryStateStore} from "../../state/QueryStateProvider";

/**
 * Marker for an incident report. Clicking on a incident report selects the incident report
 * @param incident
 * @constructor
 */
function IncidentReport({incident}: any) {
    const queryStateContext: any = useContext(queryStateStore);

    const {updateSelectedIncident} = queryStateContext;

    const lat = parseFloat(incident.latitude);
    const lng = parseFloat(incident.longitude);

    const latlng: google.maps.LatLngLiteral = {lat, lng};

    return <React.Fragment>
        <Marker
            position={latlng}
            onClick={
                (event) => {
                    updateSelectedIncident(incident);
                }
            }
        >
        </Marker>
    </React.Fragment>
}

export {IncidentReport};