CREATE DATABASE IF NOT EXISTS shoryan;
USE shoryan;

-- TABLE: users
-- Every user can both donate and request blood
--------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,          -- store password_hash() output
    phone VARCHAR(20) NOT NULL,
    blood_type ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NULL,
    gender ENUM('male','female') NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,   -- donor availability toggle
    last_donation_date DATE NULL,
    role ENUM('user','admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_blood_city (blood_type, city, is_available)   -- speeds up donor search/matching
);

--------------------------------------------------------

-- TABLE: blood_requests
--------------------------------------------------------
CREATE TABLE blood_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requester_id INT NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    blood_type ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    units_needed INT NOT NULL DEFAULT 1,
    hospital_name VARCHAR(150) NULL,
    city VARCHAR(100) NOT NULL,
    urgency ENUM('normal','urgent','critical') NOT NULL DEFAULT 'normal',
    status ENUM('open','fulfilled','cancelled') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_search (blood_type, city, status)   -- speeds up browse/search requests
);

--------------------------------------------------------

-- TABLE: donations (Matches)
--------------------------------------------------------
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    donor_id INT NOT NULL,
    status ENUM('pending','accepted','rejected','completed') NOT NULL DEFAULT 'pending',
    donation_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_donor (donor_id, status)   -- speeds up my_matches.php
);

-- ============================================
-- SEED DATA (for local testing only)
-- Plain-text passwords below are all: Password123!
-- Hash used here is a real password_hash() bcrypt output for that string.
-- ============================================

INSERT INTO users (full_name, email, password, phone, blood_type, city, gender, role) VALUES
('Admin User', 'admin@sharayin.com', '$2y$10$iEK1i.QGeWElj5L9LtgO6.l4cJvkYO8SlxePA05XJWp23Z1bQBFMK', '01000000000', 'O+', 'Cairo', 'male', 'admin'),
('Ahmed Hassan', 'ahmed@test.com', '$2y$10$iEK1i.QGeWElj5L9LtgO6.l4cJvkYO8SlxePA05XJWp23Z1bQBFMK', '01011111111', 'O-', 'Cairo', 'male', 'user'),
('Sara Ali', 'sara@test.com', '$2y$10$iEK1i.QGeWElj5L9LtgO6.l4cJvkYO8SlxePA05XJWp23Z1bQBFMK', '01022222222', 'A+', 'Giza', 'female', 'user'),
('Mona Youssef', 'mona@test.com', '$2y$10$iEK1i.QGeWElj5L9LtgO6.l4cJvkYO8SlxePA05XJWp23Z1bQBFMK', '01033333333', 'AB+', 'Cairo', 'female', 'user'),
('Karim Adel', 'karim@test.com', '$2y$10$iEK1i.QGeWElj5L9LtgO6.l4cJvkYO8SlxePA05XJWp23Z1bQBFMK', '01044444444', 'B+', 'Alexandria', 'male', 'user');

INSERT INTO blood_requests (requester_id, patient_name, blood_type, units_needed, hospital_name, city, urgency, description, status) VALUES
(3, 'Layla Ahmed', 'A+', 2, 'Cairo University Hospital', 'Cairo', 'urgent', 'Surgery scheduled tomorrow morning', 'open'),
(4, 'Omar Khaled', 'AB+', 1, 'Nile Badrawi Hospital', 'Cairo', 'critical', 'ICU patient, needs blood today', 'open'),
(5, 'Nour Mostafa', 'B+', 3, 'Alexandria Medical Center', 'Alexandria', 'normal', 'Scheduled procedure next week', 'open');

INSERT INTO donations (request_id, donor_id, status) VALUES
(1, 2, 'pending');