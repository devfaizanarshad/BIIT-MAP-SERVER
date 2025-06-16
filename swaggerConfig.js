import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BIIT Map Server API',
      version: '1.0.0',
      description: 'API documentation for BIIT Map Server backend system',
      contact: {
        name: 'Faizan Arshad',
        url: 'https://github.com/devfaizanarshad',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    tags: [
      // Admin Routes
      { name: 'Admin Routes', description: 'Operations related to admin functionalities.' },
      { name: 'User Management' },
      { name: 'Geofence Management' },
      { name: 'Vehicle Management' },
      { name: 'Branch Management' },
      { name: 'Employee Management' },

      // Manager Routes
      { name: 'Manager Routes', description: 'Operations for managers, including monitoring and assignments.' },
      { name: 'Fetch employees under a manager' },
      { name: 'Assign a geofence to employees' },
      { name: 'Fetch all assigned geofences' },
      { name: 'Assign a vehicle to an employee' },
      { name: 'Fetch all assigned vehicles' },
      { name: 'Monitor All Employee locations' },
      { name: 'View geofence violations for employees' },
      { name: 'Monitor a single employee location' },
      { name: 'Fetch violations by filters' }, // New Route
      { name: 'Fetch violations by employee' }, // New Route
      { name: 'Fetch violations for a group' }, // New Route

      // Employee Routes
      { name: 'Employee Routes', description: 'Operations related to employee functionalities.' },
      { name: 'Employee Profile' },
      { name: 'Employee Geofences' },
      { name: 'Employee Vehicles' },

      // Location Routes
      { name: 'Location Routes', description: 'Operations related to Locations functionalities.' },
      { name: 'Track geofence boundary' },
      { name: 'Add a new map location' },
      {name:  'Map Locations'},
      { name: 'Search Location'},

      
      { name: 'Auth Routes', description: 'Operations related to Creds functionalities.' },
      { name: 'Login' },
      { name: 'Logout' },
      { name: 'Reset Password'},


    ],
  },
  apis: ['./routes/*.js'], // Path to the route files for Swagger to scan
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
