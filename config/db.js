import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432, 
  database: 'OpenStreetMapDB',
});

(async () => {
    try {
      await pool.query('SELECT NOW()'); 
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
    }
  })();

export default {
  query: (text, params) => pool.query(text, params),
};
