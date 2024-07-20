// config.js
import './style.css';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj.js';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style.js';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
//ARCGIS地图
const arcGISMapLayer = new TileLayer({
   source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attributions: '© Esri'
   }),
});
const tileGrid = new WMTSTileGrid({
   origin: [-20037508.342789244, 20037508.342789244],
   resolutions: [
      156543.03392804097, 78271.51696402048, 39135.75848201024,
      19567.87924100512, 9783.93962050256, 4891.96981025128,
      2445.98490512564, 1222.99245256282, 611.49622628141,
      305.748113140705, 152.8740565703525, 76.43702828517625,
      38.21851414258813, 19.109257071294063, 9.554628535647032,
      4.777314267823516, 2.388657133911758, 1.194328566955879,
      0.5971642834779395, 0.29858214173896974
   ],
   matrixIds: [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'
   ]
})
//天地图电子地图
const vecLayer = new TileLayer({
   source: new WMTS({
      url: 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?tk=3a6fae37ed092783e7cdad8de1c2e026',
      layer: 'vec',
      matrixSet: 'w',
      format: 'tiles',
      tileGrid: tileGrid,
      style: 'default',
      wrapX: true
   })
});
//天地图矢量注记
const cvaLayer = new TileLayer({
   source: new WMTS({
      url: 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?tk=3a6fae37ed092783e7cdad8de1c2e026',
      layer: 'cva',
      matrixSet: 'w',
      format: 'tiles',
      tileGrid: tileGrid,
      style: 'default',
      wrapX: true
   })
});
//面填充样式
const styleFunction = (feature) => {
   const geometryType = feature.getGeometry().getType();
   if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
      return new Style({
         fill: new Fill({
            color: 'rgba(173, 216, 230, 0.5)' // 浅蓝色填充，50% 透明度
         }),
         stroke: new Stroke({
            color: '#0000FF', // 边框颜色
            width: 2 // 边框宽度
         }),
         text: new Text({
            text: feature.get('QUNAME'), // Use property 'QUNAME' for label
            scale: 2.0,
            fill: new Fill({ color: 'black' })
         })
      });
   }
   return new Style({});
};
//加载geojson文件方法
const geojsonLayer = new VectorLayer({
   source: new VectorSource({
      format: new GeoJSON(),
      url: './data/sz_qu.geojson', // Path to your GeoJSON file
      loader: function (extent, resolution, projection) {
         fetch('./data/sz_qu.geojson')
            .then(response => {
               if (!response.ok) {
                  throw new Error('Network response was not ok');
               }
               return response.json();
            })
            .then(data => {
               const features = new GeoJSON().readFeatures(data, {
                  featureProjection: 'EPSG:3857'
               });
               console.log('Loaded features:', features); // Debug output
               this.addFeatures(features);
            })
            .catch(error => {
               console.error('Error loading GeoJSON:', error);
            });
      }
   }),
   style: styleFunction
});

export { tileGrid, vecLayer, cvaLayer, geojsonLayer, fromLonLat };
