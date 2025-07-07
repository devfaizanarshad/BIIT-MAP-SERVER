-- Table for Users
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) 
);

ALTER TABLE Users
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

INSERT INTO Users (username, email, password, role) VALUES
('ali_khan', 'ali.khan@example.com', 'hashedpassword1', 'employee'),
('zara_ahmed', 'zara.ahmed@example.com', 'hashedpassword2', 'employee'),
('sara_butt', 'sara.butt@example.com', 'hashedpassword3', 'manager'),
('admin_user', 'admin@example.com', 'hashedpassword4', 'admin'),
('umair_ali', 'umair.ali@example.com', 'hashedpassword5', 'employee'),
('asim_haider', 'asim.haider@example.com', 'hashedpassword6', 'manager'),
('hina_shah', 'hina.shah@example.com', 'hashedpassword7', 'employee'),
('saad_javed', 'saad.javed@example.com', 'hashedpassword8', 'employee'),
('maham_rashid', 'maham.rashid@example.com', 'hashedpassword9', 'employee'),
('danish_faisal', 'danish.faisal@example.com', 'hashedpassword10', 'manager');

-- Table for Geofence
CREATE TABLE Geofence (
    geo_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    boundary jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

select * from geofence;

INSERT INTO Geofence (name, boundary) VALUES
('Rawalpindi Zone', '[{"latitude":33.6292, "longitude":73.0731}]'),
('Blue Area', '[{"latitude":33.7100, "longitude":73.0550}, {"latitude":33.7105, "longitude":73.0560}, {"latitude":33.7090, "longitude":73.0570}]'),
('Faisal Mosque', '[{"latitude":33.7280, "longitude":73.0512}, {"latitude":33.7285, "longitude":73.0520}, {"latitude":33.7270, "longitude":73.0525}]'),
('DHA Phase 3', '[{"latitude":33.5510, "longitude":73.0670}, {"latitude":33.5515, "longitude":73.0680}, {"latitude":33.5500, "longitude":73.0690}]'),
('G-11 Markaz', '[{"latitude":33.6880, "longitude":73.0130}, {"latitude":33.6885, "longitude":73.0135}, {"latitude":33.6875, "longitude":73.0140}]');

-- Table for Vehicles
CREATE TABLE Vehicle (
    vehicle_id SERIAL PRIMARY KEY,
    model VARCHAR(255),
    year INT,
    image TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO Vehicle (model, year, image, is_available) VALUES
('Suzuki Mehran', 2016, 'mehran.jpg', TRUE),
('Toyota Corolla', 2021, 'corolla.jpg', TRUE),
('Honda Civic', 2020, 'civic.jpg', TRUE),
('Suzuki WagonR', 2019, 'wagonr.jpg', TRUE),
('Honda City', 2018, 'city.jpg', TRUE),
('Hyundai Tucson', 2022, 'tucson.jpg', TRUE),
('KIA Sportage', 2023, 'sportage.jpg', TRUE),
('Suzuki Alto', 2021, 'alto.jpg', TRUE),
('Toyota Hilux', 2019, 'hilux.jpg', TRUE),
('MG ZS', 2022, 'mgzs.jpg', TRUE);

-- Table for Employees
CREATE TABLE Employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    image TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE
);

INSERT INTO Employee (first_name, last_name, address, city, phone, image, user_id) VALUES
('Ali', 'Khan', 'Street 12, G-11/3', 'Islamabad', '03331234567', 'ali.jpg', 1),
('Zara', 'Ahmed', 'House 5, Bahria Town Phase 7', 'Rawalpindi', '03441234567', 'zara.jpg', 2),
('Hina', 'Shah', 'Apartment 15, Blue Area', 'Islamabad', '03001234567', 'hina.jpg', 7),
('Saad', 'Javed', 'Sector F-11/1', 'Islamabad', '03341234567', 'saad.jpg', 8),
('Maham', 'Rashid', 'House 22, DHA Phase 2', 'Rawalpindi', '03211234567', 'maham.jpg', 9),
('Danish', 'Faisal', 'Block A, Peshawar Road', 'Rawalpindi', '03451234567', 'danish.jpg', 10);

-- Table for UserLocation
CREATE TABLE UserLocation (
    ulocation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    longitude DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO UserLocation (user_id, longitude, latitude, created_at) VALUES
(1, 73.0560, 33.7070, '2023-12-01 10:00:00'),
(2, 73.1050, 33.5440, '2023-12-01 10:05:00'),
(3, 73.0355, 33.6900, '2023-12-01 10:10:00'),
(4, 73.0930, 33.5470, '2023-12-01 10:15:00'),
(5, 73.0121, 33.6885, '2023-12-01 10:20:00'),
(6, 73.0489, 33.6830, '2023-12-01 10:25:00'),
(7, 73.0650, 33.6835, '2023-12-01 10:30:00'),
(8, 73.1044, 33.5450, '2023-12-01 10:35:00'),
(9, 73.1200, 33.7040, '2023-12-01 10:40:00'),
(10, 73.0551, 33.7055, '2023-12-01 10:45:00');

select * from userlocation;

-- Table for User_Geofence
CREATE TABLE Employee_Geofence (
    employee_id INT REFERENCES Employee(employee_id) ON DELETE CASCADE,
    geo_id INT REFERENCES Geofence(geo_id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    is_violating BOOLEAN DEFAULT FALSE,
    type TEXT,
    start_time TIME,
    end_time TIME,
    start_date DATE,
    end_date DATE,
    PRIMARY KEY (employee_id, geo_id)
);


INSERT INTO Employee_Geofence (employee_id, geo_id, is_active, is_violating, type, start_time, end_time, start_date, end_date) 
VALUES
(1, 3, TRUE, FALSE, 'Restricted', '09:00:00', '18:00:00', '2023-12-01', '2023-12-31'),
(2, 1, TRUE, FALSE, 'Authorized', '09:00:00', '18:00:00', '2023-12-01', '2023-12-31'),
(3, 2, TRUE, FALSE, 'Restricted', '09:00:00', '18:00:00', '2023-12-01', '2023-12-31'),
(4, 5, TRUE, FALSE, 'Authorized', '09:00:00', '18:00:00', '2023-12-01', '2023-12-31'),
(5, 4, TRUE, FALSE, 'Restricted', '09:00:00', '18:00:00', '2023-12-01', '2023-12-31')

-- Table for UserLocation_Geofence_Violation
CREATE TABLE UserLocation_Geofence_Violation (
    ulocation_id INT REFERENCES UserLocation(ulocation_id) ON DELETE CASCADE,
    geo_id INT REFERENCES Geofence(geo_id) ON DELETE CASCADE,
    violation_type VARCHAR(100),
    violation_time TIMESTAMP,
	end_time TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (ulocation_id, geo_id)
);

INSERT INTO UserLocation_Geofence_Violation (ulocation_id, geo_id, violation_type, violation_time) VALUES
(11, 1, 'Exit', '2023-12-01 10:30:00'),
(12, 2, 'Exit', '2023-12-01 10:45:00'),
(13, 3, 'Exit', '2023-12-01 11:00:00'),
(14, 4, 'Exit', '2023-12-01 11:15:00'),
(15, 5, 'Exit', '2023-12-01 11:30:00')

-- Table for Branches
CREATE TABLE Branches (
    branch_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address TEXT,
    phoneNo TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO Branches (name, address, phoneNo) VALUES
('Blue Area Branch', 'Blue Area, Islamabad', '051-1234567'),
('DHA Phase 2 Branch', 'DHA Phase 2, Rawalpindi', '051-7654321'),
('G-11 Branch', 'G-11 Markaz, Islamabad', '051-2345678'),
('F-10 Branch', 'F-10 Markaz, Islamabad', '051-8765432'),
('Rawalpindi Saddar Branch', 'Saddar, Rawalpindi', '051-3456789'),
('Peshawar Mor Branch', 'Peshawar Mor, Islamabad', '051-9876543'),
('Faisal Mosque Branch', 'Faisal Mosque Area, Islamabad', '051-4567890'),
('Rawal Lake Branch', 'Rawal Lake Area, Islamabad', '051-6543210'),
('Bahria Town Branch', 'Bahria Town, Rawalpindi', '051-5678901'),
('Zero Point Branch', 'Zero Point, Islamabad', '051-6789012');

-- Table for Employee_Vehicle
CREATE TABLE Employee_Vehicle (
    employee_id INT REFERENCES Employee(employee_id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE,
    assign_date DATE,
    return_date DATE,
    PRIMARY KEY (employee_id, vehicle_id)
);

INSERT INTO Employee_Vehicle (employee_id, vehicle_id, assign_date, return_date) VALUES
(1, 1, '2023-11-01', NULL),
(2, 2, '2023-11-01', NULL),
(3, 3, '2023-11-01', NULL),
(4, 4, '2023-11-01', NULL),
(5, 5, '2023-11-01', NULL),
(6, 6, '2023-11-01', NULL);

-- Table for Employee_Branch
CREATE TABLE Employee_Branch (
    employee_id INT REFERENCES Employee(employee_id) ON DELETE CASCADE,
    branch_id INT REFERENCES Branches(branch_id) ON DELETE CASCADE,
    join_date DATE DEFAULT CURRENT_TIMESTAMP,
    transfer_date DATE DEFAULT NULL,
    PRIMARY KEY (employee_id, branch_id)
);

INSERT INTO Employee_Branch (employee_id, branch_id, join_date, transfer_date) VALUES
(1, 1, '2023-01-01', NULL),
(2, 2, '2023-01-01', NULL),
(3, 3, '2023-01-01', NULL),
(4, 4, '2023-01-01', NULL),
(5, 5, '2023-01-01', NULL),
(6, 6, '2023-01-01', NULL);


-- Table for Manager
CREATE TABLE Manager (
    manager_id SERIAL PRIMARY KEY,
    resign_date DATE DEFAULT NULL,
    assign_date DATE DEFAULT CURRENT_TIMESTAMP,
    is_Deleted BOOLEAN DEFAULT FALSE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE
);

INSERT INTO Manager (resign_date, assign_date, user_id) VALUES
(NULL, '2023-01-01', 3);
INSERT INTO Manager (resign_date, assign_date, user_id) VALUES
(NULL, '2023-01-01', 10);


-- Table for Manager_Branch
CREATE TABLE Manager_Branch (
    manager_id INT REFERENCES Manager(manager_id) ON DELETE CASCADE,
    branch_id INT REFERENCES Branches(branch_id) ON DELETE CASCADE,
    join_date DATE DEFAULT CURRENT_TIMESTAMP,
    transfer_date DATE DEFAULT NULL,
    PRIMARY KEY (manager_id, branch_id)
);


INSERT INTO Manager_Branch (manager_id, branch_id, join_date, transfer_date) VALUES
(1, 1, '2023-01-01', NULL),
(2, 2, '2023-01-01', NULL);



CREATE TABLE map_locations (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE car_simulations
(
    car_id SERIAL PRIMARY KEY,
    path jsonb,
    speed integer,
    start_time time without time zone,
    end_time time without time zone,
    is_congested boolean
)



-- Congestion Checker
-- FUNCTION: public.check_congestion_for_all_cars(jsonb)

-- DROP FUNCTION IF EXISTS public.check_congestion_for_all_cars(jsonb);

CREATE OR REPLACE FUNCTION public.check_congestion_for_all_cars(
	graphhopper_coordinates jsonb)
    RETURNS TABLE(congestion_status text, matched_points jsonb) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
    car RECORD;
    path_point jsonb;
    graphhopper_point jsonb;
    matched_cars jsonb := '[]'::jsonb;
    is_congested_flags jsonb := '[]'::jsonb;
    congested_count INT;
    total_count INT;
    current_time TIMESTAMP := now();

    lat1 DOUBLE PRECISION;
    lon1 DOUBLE PRECISION;
    lat2 DOUBLE PRECISION;
    lon2 DOUBLE PRECISION;
BEGIN
    FOR car IN
        SELECT * FROM car_simulations
        WHERE current_time BETWEEN start_time AND end_time
    LOOP
        FOR path_point IN SELECT * FROM jsonb_array_elements(car.path) LOOP
            lat1 := (path_point->>'lat')::DOUBLE PRECISION;
            lon1 := (path_point->>'lon')::DOUBLE PRECISION;

            FOR graphhopper_point IN SELECT * FROM jsonb_array_elements(graphhopper_coordinates) LOOP
                lat2 := (graphhopper_point->>0)::DOUBLE PRECISION;
                lon2 := (graphhopper_point->>1)::DOUBLE PRECISION;

                -- Match with small tolerance
                IF abs(lat1 - lat2) < 0.0001 AND abs(lon1 - lon2) < 0.0001 THEN
                    is_congested_flags := is_congested_flags || to_jsonb(car.is_congested);
                    matched_cars := matched_cars || path_point;
                    EXIT;
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;

    SELECT COUNT(*) INTO congested_count
    FROM jsonb_array_elements(is_congested_flags) AS flag
    WHERE flag = 'true'::jsonb;

    SELECT COUNT(*) INTO total_count
    FROM jsonb_array_elements(is_congested_flags);

    IF total_count = 0 THEN
        congestion_status := 'No car matched the given segment at this time.';
    ELSIF congested_count > total_count / 2 THEN
        congestion_status := 'Segment is Congested';
    ELSE
        congestion_status := 'Segment is Not Congested';
    END IF;

    matched_points := matched_cars;
    RETURN NEXT;
END;
$BODY$;


SELECT check_congestion_for_all_cars_fn(
    '[ [33.61917, 73.01991], [33.61899, 73.02042] ]'::jsonb
);


INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.693811, 73.065151, 'PIMS Hospital', 'Pakistan Institute of Medical Sciences, Islamabad', 'https://example.com/pims_hospital.jpg', 'hospital');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.627013, 73.071556, 'Holy Family Hospital', 'Major public hospital in Rawalpindi', 'https://example.com/holy_family_hospital.jpg', 'hospital');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6418, 73.0735, 'Benazir Bhutto Hospital', 'Main government hospital in Rawalpindi', 'https://example.com/benazir_bhutto_hospital.jpg', 'hospital');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6695, 73.0479, 'Shifa International Hospital', 'Private hospital in Islamabad', 'https://example.com/shifa_international_hospital.jpg', 'hospital');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.5983, 73.0484, 'Railway General Hospital', 'Hospital near Rawalpindi railway station', 'https://example.com/railway_general_hospital.jpg', 'hospital');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.710109, 73.055119, 'PTCL HQ', 'PTCL Headquarters G-8/4, Islamabad', 'https://example.com/ptcl_hq.jpg', 'ptcl');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.643033, 73.075726, 'PTCL Exchange Saddar', 'PTCL Exchange Office in Saddar, Rawalpindi', 'https://example.com/ptcl_exchange_saddar.jpg', 'ptcl');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6844, 73.0257, 'PTCL Exchange G-10', 'G-10 PTCL Exchange Islamabad', 'https://example.com/ptcl_exchange_g10.jpg', 'ptcl');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7140, 73.0651, 'PTCL Exchange Blue Area', 'Main city area PTCL branch', 'https://example.com/ptcl_exchange_blue_area.jpg', 'ptcl');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.5980, 73.0511, 'PTCL Exchange Chaklala', 'Chaklala Scheme 3 PTCL branch Rawalpindi', 'https://example.com/ptcl_exchange_chaklala.jpg', 'ptcl');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.476799, 72.978057, 'M1 Toll Plaza', 'Islamabad exit M1 Motorway', 'https://example.com/m1_toll_plaza.jpg', 'toll');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.563008, 72.874589, 'M2 Toll Plaza', 'Islamabad exit M2 Motorway', 'https://example.com/m2_toll_plaza.jpg', 'toll');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6425, 72.9772, 'Tarnol Toll Plaza', 'GT Road Toll Plaza near Tarnol', 'https://example.com/tarnol_toll_plaza.jpg', 'toll');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.5087, 73.0380, 'Sawan Toll Plaza', 'Sawan Adda Toll Plaza near Rawalpindi', 'https://example.com/sawan_toll_plaza.jpg', 'toll');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.2545, 73.3047, 'Gujar Khan Toll Plaza', 'Toll near Gujar Khan on GT Road', 'https://example.com/gujar_khan_toll_plaza.jpg', 'toll');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.718151, 73.059365, 'Aabpara Police Station', 'Located in Aabpara Market, G-6, Islamabad', 'https://example.com/aabpara_police_station.jpg', 'police');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.601456, 73.045110, 'Saddar Police Station', 'Located in Saddar, Rawalpindi', 'https://example.com/saddar_police_station.jpg', 'police');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6124, 73.0665, 'Waris Khan Police Station', 'Near Committee Chowk, Rawalpindi', 'https://example.com/waris_khan_police_station.jpg', 'police');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7296, 73.0659, 'Margalla Police Station', 'F-8 Islamabad sector station', 'https://example.com/margalla_police_station.jpg', 'police');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.5957, 73.0492, 'Ganjmandi Police Station', 'Near Ganjmandi area, Rawalpindi', 'https://example.com/ganjmandi_police_station.jpg', 'police');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.643659, 72.995355, 'NUST', 'National University of Sciences and Technology, Islamabad', 'https://example.com/nust.jpg', 'school');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.649249, 73.079601, 'Fazaia Inter College', 'Well-known school in Rawalpindi', 'https://example.com/fazaia_inter_college.jpg', 'school');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6963, 73.0175, 'FAST NUCES Islamabad', 'FAST university campus in H-11 Islamabad', 'https://example.com/fast_nuces.jpg', 'school');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7085, 73.0501, 'Roots International', 'Private school with branches in Islamabad', 'https://example.com/roots_international.jpg', 'school');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6092, 73.0550, 'Beaconhouse Rawalpindi', 'Leading private school in Rawalpindi', 'https://example.com/beaconhouse_rawalpindi.jpg', 'school');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.693002, 73.055445, 'Monal Downtown', 'Popular restaurant in Blue Area, Islamabad', 'https://example.com/monal_downtown.jpg', 'restaurant');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.600498, 73.067623, 'Savour Foods', 'Famous rice and roast in Saddar, Rawalpindi', 'https://example.com/savour_foods.jpg', 'restaurant');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.5981, 73.0475, 'Cheezious Saddar', 'Popular fast food chain in Rawalpindi', 'https://example.com/cheezious_saddar.jpg', 'restaurant');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7104, 73.0638, 'Hardee''s Blue Area', 'Fast food chain located in Islamabad', 'https://example.com/hardees_blue_area.jpg', 'restaurant');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7162, 73.0670, 'Usmania Restaurant', 'Pakistani restaurant near F-10 Islamabad', 'https://example.com/usmania_restaurant.jpg', 'restaurant');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.710384, 73.058399, 'HBL ATM G-9', 'Habib Bank Limited ATM, G-9 Markaz, Islamabad', 'https://example.com/hbl_atm_g9.jpg', 'atm');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.642314, 73.073263, 'UBL ATM Saddar', 'United Bank Limited ATM in Saddar, Rawalpindi', 'https://example.com/ubl_atm_saddar.jpg', 'atm');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7215, 73.0569, 'MCB ATM F-7', 'MCB Bank ATM located in F-7 Markaz, Islamabad', 'https://example.com/mcb_atm_f7.jpg', 'atm');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6290, 73.0710, 'Meezan ATM Chandni Chowk', 'Meezan Bank ATM at Chandni Chowk, Rawalpindi', 'https://example.com/meezan_atm_chandni.jpg', 'atm');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6412, 73.0713, 'Allied Bank ATM Commercial Market', 'ATM in Commercial Market, Satellite Town, Rawalpindi', 'https://example.com/allied_bank_atm.jpg', 'atm');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.691178, 73.055556, 'Total Parco G-8', 'Fuel station in G-8 Markaz, Islamabad', 'https://example.com/total_parco_g8.jpg', 'fuel');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.608931, 73.060073, 'Shell Saddar', 'Fuel station in Saddar, Rawalpindi', 'https://example.com/shell_saddar.jpg', 'fuel');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6843, 73.0301, 'PSO G-10', 'Pakistan State Oil fuel station in G-10, Islamabad', 'https://example.com/pso_g10.jpg', 'fuel');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6458, 73.0754, 'Attock Petrol Station', 'Petrol pump near Murree Road, Rawalpindi', 'https://example.com/attock_petrol_station.jpg', 'fuel');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7255, 73.0741, 'Caltex Fuel F-6', 'Fuel station located in F-6 sector, Islamabad', 'https://example.com/caltex_f6.jpg', 'fuel');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.703248, 73.058952, 'Fatima Jinnah Park', 'Large public park in F-9 Islamabad, also known as F-9 Park', 'https://example.com/fatima_jinnah_park.jpg', 'park');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.598749, 73.061973, 'Ayub National Park', 'Popular family park with zoo and lake, Rawalpindi', 'https://example.com/ayub_park.jpg', 'park');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.6948, 73.1026, 'Lake View Park', 'Lakeside recreational area in Islamabad', 'https://example.com/lake_view_park.jpg', 'park');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.7071, 73.0849, 'Rose and Jasmine Garden', 'Botanical garden with roses and jasmine flowers, Islamabad', 'https://example.com/rose_jasmine_garden.jpg', 'park');

INSERT INTO public.map_locations (latitude, longitude, name, description, image_url, loc_type)
VALUES (33.5812, 73.0513, 'Jinnah Park Rawalpindi', 'Public park near Bahria Town Gate 1, Rawalpindi', 'https://example.com/jinnah_park_rawalpindi.jpg', 'park');



-- Column add karna
-- ALTER TABLE users ADD COLUMN age INT;

-- Column delete karna
-- ALTER TABLE users DROP COLUMN age;

-- Column ka naam change karna
-- ALTER TABLE users RENAME COLUMN username TO user_name;

-- Column ka data type change karna
-- ALTER TABLE users ALTER COLUMN age TYPE VARCHAR(10);

-- Table ka naam change karna
-- ALTER TABLE users RENAME TO app_users;

-- Specific user ka name update karna
-- UPDATE users SET name = 'Faizan' WHERE id = 1;

-- Sabhi users ka status active karna
-- UPDATE users SET status = 'active';

-- Multiple columns update karna
-- UPDATE users SET name = 'Ali', age = 25 WHERE id = 2;

-- User ko delete karna
-- DELETE FROM users WHERE id = 3;      
-- Sabhi users ko delete karna
-- DELETE FROM users;
-- User ko soft delete karna
-- UPDATE users SET is_deleted = TRUE WHERE id = 4;


-- ALTER TABLE employee ADD COLUMN is_hidden boolean DEFAULT FALSE;
-- ALTER TABLE map_locations ADD COLUMN loc_type VARCHAR(20);



CREATE TABLE IF NOT EXISTS layer_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,       
    type VARCHAR(50) NOT NULL,       
    description TEXT,
    image VARCHAR(255)
);

ALTER TABLE map_locations
ADD COLUMN layer_type_id INTEGER REFERENCES layer_type(id);

ALTER TABLE map_lines
ADD COLUMN layer_type_id INTEGER REFERENCES layer_type(id);

ALTER TABLE threat_route
ADD COLUMN layer_type_id INTEGER REFERENCES layer_type(id);

CREATE TABLE IF NOT EXISTS user_layer_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    layer_type_id INTEGER NOT NULL REFERENCES layer_type(id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP DEFAULT NULL
);

ALTER TABLE layer_type
ADD COLUMN is_public BOOLEAN DEFAULT FALSE;