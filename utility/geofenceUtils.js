import * as turf from '@turf/turf';

export function isPointInPolygon(latitude, longitude, polygonCoordinates) {
    const point = turf.point([longitude, latitude]); 
    const polygon = turf.polygon([polygonCoordinates]); 
    return turf.booleanPointInPolygon(point, polygon);
}

