import React from 'react';
import ReactDOM from 'react-dom';
import './styles/normalize.css';
import './styles/spacing.css';
import './index.css';
import {MapContainer} from './components/MapContainer/MapContainer';


import {QueryStateProvider} from './state/QueryStateProvider';

ReactDOM.render(
    <React.StrictMode>
        <QueryStateProvider>
                <MapContainer />
        </QueryStateProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

