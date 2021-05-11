import React, {useContext, useState, useEffect} from 'react';

import './MapContainer.css';
import {config} from '../../config';

import {GoogleMap, LoadScript} from '@react-google-maps/api';
import {queryStateStore} from '../../state/QueryStateProvider';
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import {FilterControls} from "../FilterControls/FilterControls";
import {IncidentReport} from '../IncidentReport/IncidentReport';
import {IncidentDetailView} from "../IncidentDetailView/IncidentDetailView";

const CENTER_OF_SAN_FRANCISCO = {
    lat: 37.7649,
    lng: -122.4394
};

const extraGoogleMapsLibraries: Libraries = ['visualization']; // needed for heatmaps

/**
 * Main container for the google maps and the other app components.
 * @constructor
 */
function MapContainer() {
    const queryStateContext: any = useContext(queryStateStore);

    const [heatmap, setHeatMap] = useState<google.maps.visualization.HeatmapLayer | undefined>(void 0);

    const {incidents, initializeQueryState} = queryStateContext;

    useEffect(() => {
        const heatmapData = incidents.map(
            (incident: any) => {
                if (incident.latitude !== void 0 && incident.longitude !== void 0) {
                    return new google.maps.LatLng(parseFloat(incident.latitude), parseFloat(incident.longitude));
                } else {
                    return false;
                }
            }
        ).filter((latlng: google.maps.LatLng | false) => latlng !== false); // get rid of reports without coordinates

        if (heatmap) {
            heatmap.setData(heatmapData);
        }
    }, [incidents, heatmap]);

    async function onLoad(map: google.maps.Map) {
        // initialize the soda api
        initializeQueryState();

        // set up the heat map
        const newHeatmap = new google.maps.visualization.HeatmapLayer({
            data: [],
            dissipating: false,
            map: map,
            radius: 1,
            opacity: 0.3
        });

        setHeatMap(newHeatmap);
    }

    const incidentReports = incidents.map((incident: any ) => <IncidentReport
        incident={incident}
        key={incident.row_id}
    />);

    return <LoadScript googleMapsApiKey={config.GOOGLE_MAPS_API_KEY} libraries={extraGoogleMapsLibraries}>
        <GoogleMap
            mapContainerClassName={'mapContainer'}
            center={CENTER_OF_SAN_FRANCISCO}
            zoom={14}
            onLoad={onLoad}
        >
            <div className="sidebar">
                <FilterControls/>
                <IncidentDetailView/>
            </div>
            {incidentReports}
        </GoogleMap>
    </LoadScript>
}

export {MapContainer} ;