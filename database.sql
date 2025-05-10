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



-- Congestion Checker

CREATE OR REPLACE FUNCTION check_congestion_for_all_cars_fn(
    graphhopper_coordinates jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
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

    status TEXT;
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
        status := 'no match';
    ELSIF congested_count > total_count / 2 THEN
        status := 'congested';
    ELSE
        status := 'not congested';
    END IF;

    RETURN jsonb_build_object(
        'status', status,
        'congested_count', congested_count,
        'total_matched', total_count,
        'matched_points', matched_cars
    );
END;
$$;


SELECT check_congestion_for_all_cars_fn(
    '[ [33.61917, 73.01991], [33.61899, 73.02042] ]'::jsonb
);