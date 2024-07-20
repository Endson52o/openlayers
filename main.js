// main.js
import './style.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { vecLayer, cvaLayer, geojsonLayer, fromLonLat } from './config.js';

// Create Map
const map = new Map({
   target: 'map',
   layers: [
      vecLayer, // TianDiTu vector layer
      cvaLayer, // TianDiTu annotation layer
      geojsonLayer // GeoJSON layer
   ],
   view: new View({
      center: fromLonLat([114.18636597, 22.65397184]), // Adjust center to match your data
      zoom: 10.5,
   }),
});
