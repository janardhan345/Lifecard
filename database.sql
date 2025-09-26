-- Medical Smart Card Database Schema
-- This SQL script creates the necessary tables for the Medical Smart Card system

-- Create database
CREATE DATABASE IF NOT EXISTS medical_smart_card;
USE medical_smart_card;

-- Patients table
CREATE TABLE patients (
    card_id VARCHAR(20) PRIMARY KEY,
    pin VARCHAR(4) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    address TEXT,
    gender ENUM('Male', 'Female', 'Other'),
    phone VARCHAR(20),
    email VARCHAR(100),
    allergies TEXT,
    chronic_conditions TEXT,
    insurance_info TEXT,
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active'
);

-- Medical Records table
CREATE TABLE medical_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    record_date DATE NOT NULL,
    condition_diagnosis VARCHAR(200) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    hospital_clinic VARCHAR(100),
    treatment_notes TEXT,
    lab_results TEXT,
    images_attachments TEXT, -- JSON array of file paths
    severity ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('Ongoing', 'Resolved', 'Follow-up Required') DEFAULT 'Ongoing',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- Prescriptions table
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    prescribed_by VARCHAR(100) NOT NULL,
    prescribed_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    instructions TEXT,
    side_effects TEXT,
    status ENUM('Active', 'Completed', 'Discontinued') DEFAULT 'Active',
    refills_remaining INT DEFAULT 0,
    pharmacy_info VARCHAR(200),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    hospital_clinic VARCHAR(100),
    appointment_type ENUM('Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Surgery', 'Test') NOT NULL,
    reason VARCHAR(200),
    status ENUM('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show') DEFAULT 'Scheduled',
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- Doctors table
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    hospital_clinic VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals/Clinics table
CREATE TABLE healthcare_facilities (
    facility_id INT AUTO_INCREMENT PRIMARY KEY,
    facility_name VARCHAR(200) NOT NULL,
    facility_type ENUM('Hospital', 'Clinic', 'Diagnostic Center', 'Pharmacy') NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    emergency_contact VARCHAR(20),
    services_offered TEXT, -- JSON array of services
    operating_hours TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Results table
CREATE TABLE lab_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    result_value VARCHAR(100),
    normal_range VARCHAR(100),
    unit VARCHAR(20),
    status ENUM('Normal', 'Abnormal', 'Critical') NOT NULL,
    lab_name VARCHAR(100),
    doctor_ordered VARCHAR(100),
    notes TEXT,
    file_path VARCHAR(255), -- For storing report files
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- Emergency Contacts table
CREATE TABLE emergency_contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- Insurance Information table
CREATE TABLE insurance_info (
    insurance_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    insurance_provider VARCHAR(100) NOT NULL,
    policy_number VARCHAR(50) NOT NULL,
    group_number VARCHAR(50),
    coverage_details TEXT,
    expiry_date DATE,
    status ENUM('Active', 'Expired', 'Cancelled') DEFAULT 'Active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- Vaccination Records table
CREATE TABLE vaccination_records (
    vaccination_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    vaccination_date DATE NOT NULL,
    dose_number INT NOT NULL,
    batch_number VARCHAR(50),
    administered_by VARCHAR(100),
    location VARCHAR(100),
    next_dose_due DATE,
    side_effects TEXT,
    status ENUM('Completed', 'Pending', 'Overdue') DEFAULT 'Completed',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- Vital Signs table
CREATE TABLE vital_signs (
    vital_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    measurement_date DATETIME NOT NULL,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    heart_rate INT,
    temperature DECIMAL(4,2),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    bmi DECIMAL(4,2),
    oxygen_saturation INT,
    blood_sugar DECIMAL(5,2),
    measured_by VARCHAR(100),
    location VARCHAR(100),
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE CASCADE
);

-- System Logs table for tracking access and changes
CREATE TABLE system_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(20),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES patients(card_id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_patient_name ON patients(first_name, last_name);
CREATE INDEX idx_medical_records_date ON medical_records(record_date);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_lab_results_date ON lab_results(test_date);
CREATE INDEX idx_vital_signs_date ON vital_signs(measurement_date);

-- Insert sample data
INSERT INTO patients (card_id, pin, first_name, last_name, date_of_birth, blood_group, emergency_contact, gender, phone, email) VALUES
('MC001', '1234', 'John', 'Doe', '1990-01-15', 'O+', '+1-555-0123', 'Male', '+1-555-0111', 'john.doe@email.com'),
('MC002', '5678', 'Jane', 'Smith', '1985-05-20', 'A+', '+1-555-0124', 'Female', '+1-555-0112', 'jane.smith@email.com'),
('MC003', '9012', 'Bob', 'Johnson', '1978-12-03', 'B-', '+1-555-0125', 'Male', '+1-555-0113', 'bob.johnson@email.com');

INSERT INTO doctors (doctor_name, specialization, license_number, hospital_clinic, phone, email) VALUES
('Dr. Smith', 'General Medicine', 'LIC001', 'City General Hospital', '+1-555-0201', 'dr.smith@hospital.com'),
('Dr. Johnson', 'Cardiology', 'LIC002', 'Heart Care Center', '+1-555-0202', 'dr.johnson@heartcare.com'),
('Dr. Brown', 'Pediatrics', 'LIC003', 'Children\'s Hospital', '+1-555-0203', 'dr.brown@childrens.com');

INSERT INTO healthcare_facilities (facility_name, facility_type, address, phone, email) VALUES
('City General Hospital', 'Hospital', '123 Main St, City, State 12345', '+1-555-0301', 'info@citygeneral.com'),
('Heart Care Center', 'Clinic', '456 Oak Ave, City, State 12345', '+1-555-0302', 'info@heartcare.com'),
('QuickCare Pharmacy', 'Pharmacy', '789 Pine St, City, State 12345', '+1-555-0303', 'info@quickcare.com');

INSERT INTO medical_records (card_id, record_date, condition_diagnosis, doctor_name, hospital_clinic, treatment_notes) VALUES
('MC001', '2024-01-15', 'Annual Physical Examination', 'Dr. Smith', 'City General Hospital', 'Patient in good overall health. All vital signs normal.'),
('MC001', '2024-03-22', 'Common Cold', 'Dr. Johnson', 'Heart Care Center', 'Prescribed rest and increased fluid intake. Symptoms should resolve in 7-10 days.'),
('MC002', '2024-02-10', 'Hypertension', 'Dr. Smith', 'City General Hospital', 'Started on medication. Follow-up in 4 weeks.');

INSERT INTO prescriptions (card_id, medication_name, dosage, frequency, duration, prescribed_by, prescribed_date, start_date) VALUES
('MC001', 'Vitamin D3', '1000 IU', 'Once daily', '3 months', 'Dr. Smith', '2024-01-15', '2024-01-15'),
('MC002', 'Lisinopril', '10mg', 'Once daily', 'Ongoing', 'Dr. Smith', '2024-02-10', '2024-02-10'),
('MC001', 'Acetaminophen', '500mg', 'Every 6 hours as needed', '1 week', 'Dr. Johnson', '2024-03-22', '2024-03-22');

INSERT INTO appointments (card_id, appointment_date, appointment_time, doctor_name, department, hospital_clinic, appointment_type, reason) VALUES
('MC001', '2024-10-15', '10:00:00', 'Dr. Smith', 'General Medicine', 'City General Hospital', 'Follow-up', 'Routine follow-up examination'),
('MC002', '2024-10-20', '14:30:00', 'Dr. Smith', 'General Medicine', 'City General Hospital', 'Follow-up', 'Blood pressure check'),
('MC003', '2024-10-25', '09:15:00', 'Dr. Brown', 'Pediatrics', 'Children\'s Hospital', 'Check-up', 'Annual pediatric examination');

-- Create views for common queries
CREATE VIEW patient_summary AS
SELECT 
    p.card_id,
    CONCAT(p.first_name, ' ', p.last_name) as full_name,
    p.blood_group,
    p.emergency_contact,
    p.status,
    COUNT(DISTINCT mr.record_id) as total_medical_records,
    COUNT(DISTINCT pr.prescription_id) as total_prescriptions,
    COUNT(DISTINCT ap.appointment_id) as total_appointments
FROM patients p
LEFT JOIN medical_records mr ON p.card_id = mr.card_id
LEFT JOIN prescriptions pr ON p.card_id = pr.card_id
LEFT JOIN appointments ap ON p.card_id = ap.card_id
GROUP BY p.card_id;

CREATE VIEW active_prescriptions AS
SELECT 
    pr.*,
    CONCAT(p.first_name, ' ', p.last_name) as patient_name
FROM prescriptions pr
JOIN patients p ON pr.card_id = p.card_id
WHERE pr.status = 'Active' AND (pr.end_date IS NULL OR pr.end_date >= CURDATE());

CREATE VIEW upcoming_appointments AS
SELECT 
    ap.*,
    CONCAT(p.first_name, ' ', p.last_name) as patient_name
FROM appointments ap
JOIN patients p ON ap.card_id = p.card_id
WHERE ap.appointment_date >= CURDATE() AND ap.status IN ('Scheduled', 'Confirmed')
ORDER BY ap.appointment_date, ap.appointment_time;