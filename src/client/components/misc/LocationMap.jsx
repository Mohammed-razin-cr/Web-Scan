import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';

import colors from 'client/styles/colors';
import MapFeatures from 'client/assets/data/map-features.json';







const MapChart = (location) => {
  const { lat, lon, label } = location;

  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [0, 0, 0],
        center: [lon + 5, lat - 25],
        scale: 200,
      }}
    >
      <Geographies
        geography={MapFeatures}
        fill={colors.backgroundDarker}
        stroke={colors.primary}
        strokeWidth={0.5}
      >
        {({ geographies }) =>
          geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
        }
      </Geographies>
      <Annotation
        subject={[lon, lat]}
        dx={-80}
        dy={-80}
        connectorProps={{
          stroke: colors.textColor,
          strokeWidth: 3,
          strokeLinecap: 'round',
        }}
      >
        <text x="-8" textAnchor="end" fill={colors.textColor} fontSize={25}>
          {label || 'Server'}
        </text>
      </Annotation>
    </ComposableMap>
  );
};

export default MapChart;
