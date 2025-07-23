import express from "express";
import UserGeoLayer from "../controllers/userGeofenceLayerController.js";
import { polygon, point, booleanPointInPolygon } from '@turf/turf';
import GeofenceModel from "../models/geofenceModel.js";
import LayerModel from "../models/Layer.js";


const router = express.Router();

router.post("/create", UserGeoLayer.createUserGeoLayer);

router.get("/allUserGeoLayer/:user_id", UserGeoLayer.getUserGeoLayer);

router.patch("/permitUserGeoLayer/:Id", UserGeoLayer.permitUserGeoLayer);

router.get("/allusergeolayer", UserGeoLayer.getAllUserGeoLayerAssignments)

router.get("/allusergeolayers/:user_id", UserGeoLayer.getAllUserGeoLayerAssignmentsByUser)

router.post("/filterelocation", async(req, res)=>{

const {user_id, geo_id, layer_type_id} = req.body;

  console.log(geo_id);
  
  const {boundary} = await GeofenceModel.getGeofenceById(geo_id);
  const {name} = await LayerModel.getLayerById(layer_type_id);
  const layRes = await LayerModel.getLocationsByType(name);

    // // Convert geofence to GeoJSON Polygon
    const geofenceCoordinates = boundary.map((pt) => [pt.longitude, pt.latitude]);
    geofenceCoordinates.push(geofenceCoordinates[0]); // close the polygon
    const geofencePolygon = polygon([geofenceCoordinates]);
    let filterpoints = [];
    layRes.forEach(lay => {

    const userPoint = point([lay.longitude, lay.latitude]);
    const insideGeofence = booleanPointInPolygon(userPoint, geofencePolygon);
    if (!insideGeofence) {

      filterpoints.push(lay)
      
    }

    console.log("filtered",filterpoints);
    
      
    });


    res.status(201).json({
      success: true,
      data: filterpoints
    });




} )


export default router;
