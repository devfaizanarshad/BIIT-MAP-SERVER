import { polygon, point, booleanPointInPolygon } from '@turf/turf';
import UserLocationModel from '../models/userLocation.js';
import UserLocationGeofenceViolationModel from '../models/userGeofenceViolationModel.js';
import axios from "axios";
import moment from 'moment-timezone';


class LocationController {
  // Function to add a new location for the user and check if inside geofence
//   static async addLocation(req, res) {
//     try {
//       const { latitude, longitude } = req.body;
//       const { employeeId } = req.params;      
  
//       // Save the new location to the database
//       const newLocation = await UserLocationModel.createUserLocation(employeeId, longitude, latitude);

    
//       // Fetch the geofence for the user
//       const employeeGeofence = await UserLocationModel.getEmployeeGeofence(newLocation.user_id);

      
  
//       if (!employeeGeofence || employeeGeofence.length === 0) {
//         return res.status(404).json({ message: 'No geofence found for this user' });
//       }
  
//       // Extract geofence data
//       const { geo_id, geofence_boundary, type, is_violating, start_time, end_time } = employeeGeofence[0];


//       // Convert boundary array to GeoJSON polygon coordinates
//       const geofenceCoordinates = geofence_boundary.map((point) => [point.longitude, point.latitude]);
//       geofenceCoordinates.push(geofenceCoordinates[0]);
  
//       // Create polygon and point geometries
//       const geofencePolygon = polygon([geofenceCoordinates]);
//       const userLocationPoint = point([longitude, latitude]);
  
//       // Check user's position relative to the geofence
//       const insideGeofence = booleanPointInPolygon(userLocationPoint, geofencePolygon);

//       console.log("Is inside geofence :", insideGeofence);
      
  
//       let message = 'User is in the safe zone.';

//       console.log("Voilation Status : ", is_violating)

//     const userTimezone = 'Asia/Karachi';  // Replace with the user's actual timezone

//     const startMoment = moment(start_time, "HH:mm:ss");
//     const endMoment = moment(end_time, "HH:mm:ss");

//     const createdTime = moment(newLocation.created_at).tz(userTimezone).format("HH:mm:ss");
//     const createdTimeMoment = moment(createdTime, "HH:mm:ss");

//       if (type === 'Authorized') {
//         if (!insideGeofence) {
//           // User is outside the authorized geofence
//           if (!is_violating) {
//             // Start a new violation

//                 if (createdTimeMoment.isBefore(startMoment) || createdTimeMoment.isAfter(endMoment)) {
//               return res.status(400).json({ message: 'Violation cannot be recorded outside of the geofence time range.' });  
//                 }
//             await UserLocationGeofenceViolationModel.createViolation(
//               newLocation.ulocation_id,
//               geo_id,
//               'Exit',
//               newLocation.created_at
//             );
//             await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, true); // Mark as violating
//             message = 'Violation recorded: User left the authorized geofence.';
//             // await axios.post('http://localhost:4000/notify', {data: {message, employeeId}});

//           }

//           else if (is_violating) {
//             // User is back inside the safe zone
//             // await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, false); // Reset violation status
//             // await UserLocationModel.endViolation(geo_id, newLocation.created_at); // Update end_time
//             message = 'Violation recorded. User is still outside the geofence';
//           }
//         } 
//         else if (insideGeofence) {
//           // User is back inside the safe zone
//           await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, false); // Reset violation status
//           await UserLocationModel.endViolation(geo_id, newLocation.created_at); // Update end_time
//           message = 'User returned to the safe zone. Violation ended.';
//         }

      
//       } else if (type === 'Restricted') {

//         console.log("I am here");
        
//         if (insideGeofence) {

//           console.log("You are Inside restricted geofence");
          
//           // User is inside a restricted geofence
//           if (!is_violating) {

// if (createdTimeMoment.isBefore(startMoment) || createdTimeMoment.isAfter(endMoment)) {
//   return res.status(400).json({ message: 'Violation cannot be recorded outside of the geofence time range.' });  
// }
//             // Start a new violation
//             await UserLocationGeofenceViolationModel.createViolation(
//               newLocation.ulocation_id,
//               geo_id,
//               'Entry',
//               newLocation.created_at
//             );
//             await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, true); // Mark as violating
//             message = 'Violation recorded: User Entered the restricted geofence.';
//           }

//           else if (is_violating) {
//             // User is back inside the safe zone
//             // await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, false); // Reset violation status
//             // await UserLocationModel.endViolation(geo_id, newLocation.created_at); // Update end_time
//             message = 'Violation recorded. User is still Inside the geofence';
//             // await axios.post('http://localhost:4000/notify', {data: {
//             //   message,
//             //   employeeId
//             // }});

//           }
//         } 
//         else if (!insideGeofence) {
//           // User is back inside the safe zone
//           await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, false); // Reset violation status
//           await UserLocationModel.endViolation(geo_id, newLocation.created_at); // Update end_time
//           message = 'User returned to the safe zone. Violation ended.';
//         }
//       }


//       return res.status(201).json({
//         message,
//         insideGeofence,
//         location: newLocation,
//         type,
//       });
//     } catch (error) {
//       return res.status(500).json({ message: 'Error adding location', error: error.message });
//     }
//   }
    
static async addLocation(req, res) {
  try {
    const { latitude, longitude } = req.body;
    const { employeeId } = req.params;

    // Save the new user location to the database
    const newLocation = await UserLocationModel.createUserLocation(employeeId, longitude, latitude);

    // Get all geofences assigned to this employee
    const employeeGeofences = await UserLocationModel.getEmployeeGeofence(employeeId);

    if (!employeeGeofences || employeeGeofences.length === 0) {
      return res.status(404).json({ message: 'No geofences found for this user' });
    }

    const violationMessages = [];
    const userTimezone = 'Asia/Karachi';
    const createdAtMoment = moment(newLocation.created_at).tz(userTimezone);
    const createdTimeOnly = moment(createdAtMoment.format("HH:mm:ss"), "HH:mm:ss");

    for (const geofence of employeeGeofences) {
      const {
        geo_id,
        geofence_boundary,
        type,
        is_violating,
        start_time,
        end_time,
      } = geofence;

      // Convert geofence to GeoJSON Polygon
      const geofenceCoordinates = geofence_boundary.map((pt) => [pt.longitude, pt.latitude]);
      geofenceCoordinates.push(geofenceCoordinates[0]); // close the polygon
      const geofencePolygon = polygon([geofenceCoordinates]);
      const userPoint = point([longitude, latitude]);
      const insideGeofence = booleanPointInPolygon(userPoint, geofencePolygon);

      // Time range check
      const startMoment = moment(start_time, "HH:mm:ss");
      const endMoment = moment(end_time, "HH:mm:ss");
      const withinTimeRange = createdTimeOnly.isSameOrAfter(startMoment) && createdTimeOnly.isSameOrBefore(endMoment);

      // ========== AUTHORIZED GEOFENCE ==========
      if (type === 'Authorized') {
        if (!insideGeofence && withinTimeRange && !is_violating) {
          // Violation begins — user left authorized area
          await UserLocationGeofenceViolationModel.createViolation(
            newLocation.ulocation_id,
            geo_id,
            'Exit',
            newLocation.created_at
          );
          await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, true);
          const message = `Violation: User LEFT authorized geofence (ID: ${geo_id}).`;
          violationMessages.push(message);
          // await axios.post('http://localhost:4000/notify', { data: { message, employeeId } }); // Uncomment to trigger notification
        } else if (insideGeofence && is_violating) {
          // Violation ends — user re-enters authorized area
          await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, false);
          await UserLocationModel.endViolation(geo_id, newLocation.created_at);
          violationMessages.push(`Resolved: User RE-ENTERED authorized geofence (ID: ${geo_id}).`);
        } else if (!insideGeofence && is_violating) {
          violationMessages.push(`Ongoing: User STILL OUTSIDE authorized geofence (ID: ${geo_id}).`);
        }
      }

      // ========== RESTRICTED GEOFENCE ==========
      else if (type === 'Restricted') {
        if (insideGeofence && withinTimeRange && !is_violating) {
          // Violation begins — user entered restricted area
          await UserLocationGeofenceViolationModel.createViolation(
            newLocation.ulocation_id,
            geo_id,
            'Entry',
            newLocation.created_at
          );
          await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, true);
          const message = `Violation: User ENTERED restricted geofence (ID: ${geo_id}).`;
          violationMessages.push(message);
          // await axios.post('http://localhost:4000/notify', { data: { message, employeeId } }); // Uncomment to trigger notification
        } else if (!insideGeofence && is_violating) {
          // Violation ends — user left restricted area
          await UserLocationModel.updateGeofenceViolationStatus(employeeId, geo_id, false);
          await UserLocationModel.endViolation(geo_id, newLocation.created_at);
          violationMessages.push(`Resolved: User EXITED restricted geofence (ID: ${geo_id}).`);
        } else if (insideGeofence && is_violating) {
          violationMessages.push(`Ongoing: User STILL INSIDE restricted geofence (ID: ${geo_id}).`);
        }
      }
    }

    return res.status(201).json({
      message: violationMessages.length > 0 ? violationMessages : ['User is within all assigned zones.'],
      location: newLocation,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error adding location', error: error.message });
  }
}


  // Function to get location history for the user
  static async getLocationHistory(req, res) {
    try {
      const { employeeId } = req.params;

      // Fetch location history from the database
      const locationHistory = await UserLocationModel.getLocationsByUserId(employeeId);

      return res.status(200).json({
        employeeId,
        locationHistory,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching location history', error: error.message });
    }
  }

  static async getSerachLocation(req, res) {
    const { location } = req.query;
    if (!location || location.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }
  
    console.log(`Location search initiated for query: ${location}`);
  
    try {
      const response = await axios.get(`http://localhost:8384/search?q=${location}`, { timeout: 2000 });
      console.log("Location data received successfully:", response.data);
      res.send(response.data);
    } catch (error) {
      console.error('Error fetching location:', error.stack || error.message);
      res.status(500).json({ message: 'Error fetching location data', error: error.message });
    }
  }
  
  static async getRouteDirection(req, res) {
    const { point1, point2 } = req.query;
    if (!point1 || !point2) {
      return res.status(400).json({ message: "Both point1 and point2 are required for route calculation" });
    }
  
    const pointA = point1;
    const pointB = point2;
  
    console.log(`Route request from ${pointA} to ${pointB}`);
  
    try {
      const response = await axios.get(`http://localhost:8989/route?point=${pointA}&point=${pointB}&type=json&profile=car`);
      console.log("Route data received successfully:", response.data);
      res.send(response.data);
    } catch (error) {
      console.error('Error fetching direction:', error.stack || error.message);
      res.status(500).json({ message: 'Error fetching route data', error: error.message });
    }
  }
    
}

export default LocationController;
