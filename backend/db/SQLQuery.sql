CREATE DATABASE HealthCareDB;

USE HealthCareDB;

-- CREATE TABLE Admins (
--     AdminID INT PRIMARY KEY IDENTITY(1,1),
--     Name NVARCHAR(100) NOT NULL,
--     Username NVARCHAR(50) UNIQUE NOT NULL,
--     Email NVARCHAR(100) UNIQUE NOT NULL,
--     Password NVARCHAR(50) NOT NULL,
--     ProfilePic NVARCHAR(255),
--     CreatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedAt DATETIME DEFAULT GETDATE()
-- );

-- CREATE TABLE Patients (
--     PatientID INT PRIMARY KEY IDENTITY(1,1),
--     FullName NVARCHAR(100) NOT NULL,
--     Username NVARCHAR(50) UNIQUE NOT NULL,
--     Email NVARCHAR(100) UNIQUE NOT NULL,
--     ProfilePic NVARCHAR(255),
--     PhoneNumber NVARCHAR(20),
--     DateOfBirth DATE,
--     Gender NVARCHAR(10),
--     Address NVARCHAR(255),
--     EmergencyContact NVARCHAR(100),
--     AccountStatus NVARCHAR(20) CHECK (AccountStatus IN ('Active', 'Deactivated', 'Deleted')),
--     CreatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedAt DATETIME DEFAULT GETDATE()
-- );

-- CREATE TABLE PatientNotifications (
--     NotificationID INT PRIMARY KEY IDENTITY(1,1),
--     PatientID INT FOREIGN KEY REFERENCES Patients(PatientID) ON DELETE CASCADE,
--     NotificationType NVARCHAR(20) CHECK (NotificationType IN ('Email', 'SMS')),
--     AppointmentReminders BIT NOT NULL DEFAULT 1,
--     AppointmentChanges BIT NOT NULL DEFAULT 1,
--     MedicalUpdates BIT NOT NULL DEFAULT 1,
--     IsEnabled BIT NOT NULL DEFAULT 1
-- );

-- CREATE TABLE Doctors (
--     DoctorID INT PRIMARY KEY IDENTITY(1,1),
--     FullName NVARCHAR(100) NOT NULL,
--     Email NVARCHAR(100) UNIQUE NOT NULL,
--     Specialty NVARCHAR(100),
--     Status NVARCHAR(20) CHECK (Status IN ('Active', 'Inactive')),
--     ServiceDays NVARCHAR(50), -- e.g. "Mon, Wed, Fri"
--     AvailabilityTimes NVARCHAR(100), -- e.g. "10:00-12:00,14:00-17:00"
--     Bio NVARCHAR(MAX),
--     CreatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedAt DATETIME DEFAULT GETDATE()
-- );

-- CREATE TABLE Appointments (
--     AppointmentID INT PRIMARY KEY IDENTITY(1,1),
--     PatientID INT FOREIGN KEY REFERENCES Patients(PatientID) ON DELETE CASCADE,
--     DoctorID INT FOREIGN KEY REFERENCES Doctors(DoctorID) ON DELETE CASCADE,
--     AppointmentDate DATE NOT NULL,
--     AppointmentTime TIME NOT NULL,
--     AppointmentType NVARCHAR(50),
--     ReasonForVisit NVARCHAR(255),
--     AppointmentStatus NVARCHAR(20) CHECK (AppointmentStatus IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
--     Notes NVARCHAR(MAX),
--     CancellationReason NVARCHAR(255),
--     RescheduleReason NVARCHAR(255),
--     RescheduleDate DATE,
--     RescheduleTime TIME,
--     CreatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedAt DATETIME DEFAULT GETDATE()
-- );

-- Dummy Data
-- Admin
INSERT INTO Admins (Name, Username, Email, Password, ProfilePic)
VALUES ('Admin', 'admin', 'admin@healthcare.com','admin123' ,'profile1.png');
SELECT * from Admins;

-- Patients
INSERT INTO Patients (FullName, Username, Email, ProfilePic, PhoneNumber, DateOfBirth, Gender, Address, EmergencyContact, AccountStatus)
VALUES 
('John Doe', 'johndoe', 'john@example.com', 'john.png', '1234567890', '1990-05-10', 'Male', '123 Street, City', 'Jane Doe - 9876543210', 'Active'),
('Alice Smith', 'alice', 'alice@example.com', 'alice.png', '5551234567', '1985-11-20', 'Female', '456 Road, City', 'Bob Smith - 7778889999', 'Active');
SELECT * from Patients;

-- Notifications
INSERT INTO PatientNotifications (PatientID, NotificationType,AppointmentReminders,AppointmentChanges,MedicalUpdates, IsEnabled)
VALUES
(1, 'Email', 1, 1, 1, 1),
(1, 'SMS', 0, 1, 1, 1),
(2, 'Email', 1, 1, 1, 1);
Select * from PatientNotifications;

-- Doctors
INSERT INTO Doctors (FullName, Email, Specialty, Status, ServiceDays, AvailabilityTimes, Bio)
VALUES 
('Dr. Sarah Lee', 'sarah.lee@hospital.com', 'Cardiology', 'Active', 'Mon, Wed, Fri', '10:00-12:00,14:00-17:00', 'Experienced in cardiovascular treatments.'),
('Dr. Michael Tan', 'michael.tan@hospital.com', 'Dermatology', 'Active', 'Tue, Thu', '09:00-11:00,13:00-15:00', 'Specialist in skin and allergy treatments.');
SELECT * from Doctors;

-- Appointments
INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime, AppointmentType, ReasonForVisit, AppointmentStatus)
VALUES 
(1, 1, '2025-04-20', '10:30', 'Consultation', 'Chest pain and discomfort.', 'Scheduled'),
(2, 2, '2025-04-21', '09:15', 'Follow-up', 'Skin allergy flare-up.', 'Scheduled');
SELECT * from Appointments;