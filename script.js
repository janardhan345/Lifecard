// Medical Smart Card Application JavaScript

class MedicalSmartCard {
    constructor() {
        this.currentPatient = null;
        this.initializeApp();
        this.setupEventListeners();
        this.loadSampleData();
    }

    initializeApp() {
        // Initialize local storage if it doesn't exist
        if (!localStorage.getItem('patients')) {
            localStorage.setItem('patients', JSON.stringify({}));
        }
        if (!localStorage.getItem('medicalRecords')) {
            localStorage.setItem('medicalRecords', JSON.stringify({}));
        }
        if (!localStorage.getItem('prescriptions')) {
            localStorage.setItem('prescriptions', JSON.stringify({}));
        }
        if (!localStorage.getItem('appointments')) {
            localStorage.setItem('appointments', JSON.stringify({}));
        }
    }

    loadSampleData() {
        // Load sample data if no data exists
        const patients = JSON.parse(localStorage.getItem('patients'));
        if (Object.keys(patients).length === 0) {
            const samplePatient = {
                cardId: 'MC001',
                pin: '1234',
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '1990-01-15',
                bloodGroup: 'O+',
                emergencyContact: '+1-555-0123',
                registeredDate: new Date().toISOString()
            };
            
            patients[samplePatient.cardId] = samplePatient;
            localStorage.setItem('patients', JSON.stringify(patients));

            // Sample medical records
            const medicalRecords = {
                'MC001': [
                    {
                        id: 1,
                        date: '2024-01-15',
                        condition: 'Annual Checkup',
                        doctor: 'Dr. Smith',
                        notes: 'All vital signs normal. Patient in good health.'
                    },
                    {
                        id: 2,
                        date: '2024-03-22',
                        condition: 'Common Cold',
                        doctor: 'Dr. Johnson',
                        notes: 'Prescribed rest and fluids. Follow up if symptoms persist.'
                    }
                ]
            };
            localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));

            // Sample prescriptions
            const prescriptions = {
                'MC001': [
                    {
                        id: 1,
                        medication: 'Vitamin D3',
                        dosage: '1000 IU daily',
                        prescribedBy: 'Dr. Smith',
                        prescribedDate: '2024-01-15',
                        duration: '3 months',
                        status: 'Active'
                    }
                ]
            };
            localStorage.setItem('prescriptions', JSON.stringify(prescriptions));

            // Sample appointments
            const appointments = {
                'MC001': [
                    {
                        id: 1,
                        date: '2024-10-15',
                        time: '10:00 AM',
                        doctor: 'Dr. Smith',
                        department: 'General Medicine',
                        status: 'Scheduled'
                    }
                ]
            };
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginForm());
        document.getElementById('registerBtn').addEventListener('click', () => this.showRegisterForm());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Form submissions
        document.getElementById('loginFormElement').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerFormElement').addEventListener('submit', (e) => this.handleRegister(e));

        // Dashboard navigation
        document.getElementById('medicalHistoryBtn').addEventListener('click', () => this.showSection('medicalHistory'));
        document.getElementById('prescriptionsBtn').addEventListener('click', () => this.showSection('prescriptions'));
        document.getElementById('appointmentsBtn').addEventListener('click', () => this.showSection('appointments'));
        document.getElementById('emergencyBtn').addEventListener('click', () => this.showSection('emergency'));

        // Modal buttons
        document.getElementById('addMedicalRecordBtn').addEventListener('click', () => this.showMedicalRecordModal());
        document.getElementById('cancelMedicalRecord').addEventListener('click', () => this.hideMedicalRecordModal());
        document.getElementById('medicalRecordForm').addEventListener('submit', (e) => this.addMedicalRecord(e));
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        this.clearForms();
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        this.clearForms();
    }

    clearForms() {
        document.getElementById('loginFormElement').reset();
        document.getElementById('registerFormElement').reset();
    }

    handleLogin(e) {
        e.preventDefault();
        const cardId = document.getElementById('loginCardId').value;
        const pin = document.getElementById('loginPin').value;

        const patients = JSON.parse(localStorage.getItem('patients'));
        const patient = patients[cardId];

        if (patient && patient.pin === pin) {
            this.currentPatient = patient;
            this.showDashboard();
            this.showSection('medicalHistory'); // Default section
        } else {
            alert('Invalid Card ID or PIN');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const bloodGroup = document.getElementById('bloodGroup').value;
        const emergencyContact = document.getElementById('emergencyContact').value;
        const pin = document.getElementById('registerPin').value;

        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            alert('PIN must be exactly 4 digits');
            return;
        }

        // Generate unique card ID
        const cardId = 'MC' + String(Date.now()).slice(-6);
        
        const newPatient = {
            cardId,
            pin,
            firstName,
            lastName,
            dateOfBirth,
            bloodGroup,
            emergencyContact,
            registeredDate: new Date().toISOString()
        };

        const patients = JSON.parse(localStorage.getItem('patients'));
        patients[cardId] = newPatient;
        localStorage.setItem('patients', JSON.stringify(patients));

        // Initialize empty records for new patient
        const medicalRecords = JSON.parse(localStorage.getItem('medicalRecords'));
        medicalRecords[cardId] = [];
        localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));

        const prescriptions = JSON.parse(localStorage.getItem('prescriptions'));
        prescriptions[cardId] = [];
        localStorage.setItem('prescriptions', JSON.stringify(prescriptions));

        const appointments = JSON.parse(localStorage.getItem('appointments'));
        appointments[cardId] = [];
        localStorage.setItem('appointments', JSON.stringify(appointments));

        alert(`Registration successful! Your Card ID is: ${cardId}`);
        this.showLoginForm();
    }

    showDashboard() {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        this.displayPatientInfo();
    }

    displayPatientInfo() {
        const patientInfoDiv = document.getElementById('patientInfo');
        const patient = this.currentPatient;
        
        patientInfoDiv.innerHTML = `
            <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-semibold text-blue-800">Personal Information</h4>
                <p><strong>Name:</strong> ${patient.firstName} ${patient.lastName}</p>
                <p><strong>Card ID:</strong> ${patient.cardId}</p>
                <p><strong>Date of Birth:</strong> ${patient.dateOfBirth}</p>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
                <h4 class="font-semibold text-red-800">Medical Information</h4>
                <p><strong>Blood Group:</strong> <span class="text-2xl font-bold text-red-600">${patient.bloodGroup}</span></p>
                <p><strong>Emergency Contact:</strong> ${patient.emergencyContact}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-semibold text-green-800">Card Status</h4>
                <p><strong>Status:</strong> <span class="text-green-600 font-semibold">Active</span></p>
                <p><strong>Registered:</strong> ${new Date(patient.registeredDate).toLocaleDateString()}</p>
            </div>
        `;
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('[id$="Section"]').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        const sectionId = section + 'Section';
        document.getElementById(sectionId).classList.remove('hidden');

        // Load section data
        switch(section) {
            case 'medicalHistory':
                this.loadMedicalHistory();
                break;
            case 'prescriptions':
                this.loadPrescriptions();
                break;
            case 'appointments':
                this.loadAppointments();
                break;
            case 'emergency':
                this.loadEmergencyInfo();
                break;
        }
    }

    loadMedicalHistory() {
        const medicalRecords = JSON.parse(localStorage.getItem('medicalRecords'));
        const patientRecords = medicalRecords[this.currentPatient.cardId] || [];
        const listDiv = document.getElementById('medicalHistoryList');

        if (patientRecords.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-600">No medical history records found.</p>';
            return;
        }

        listDiv.innerHTML = patientRecords.map(record => `
            <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h5 class="font-semibold text-lg">${record.condition}</h5>
                        <p class="text-gray-600"><i class="fas fa-calendar mr-2"></i>${record.date}</p>
                        <p class="text-gray-600"><i class="fas fa-user-md mr-2"></i>${record.doctor}</p>
                        ${record.notes ? `<p class="mt-2 text-gray-700">${record.notes}</p>` : ''}
                    </div>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Medical Record</span>
                </div>
            </div>
        `).join('');
    }

    loadPrescriptions() {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions'));
        const patientPrescriptions = prescriptions[this.currentPatient.cardId] || [];
        const listDiv = document.getElementById('prescriptionsList');

        if (patientPrescriptions.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-600">No current prescriptions found.</p>';
            return;
        }

        listDiv.innerHTML = patientPrescriptions.map(prescription => `
            <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h5 class="font-semibold text-lg">${prescription.medication}</h5>
                        <p class="text-gray-600"><i class="fas fa-pills mr-2"></i>${prescription.dosage}</p>
                        <p class="text-gray-600"><i class="fas fa-user-md mr-2"></i>Prescribed by ${prescription.prescribedBy}</p>
                        <p class="text-gray-600"><i class="fas fa-calendar mr-2"></i>Date: ${prescription.prescribedDate}</p>
                        <p class="text-gray-600"><i class="fas fa-clock mr-2"></i>Duration: ${prescription.duration}</p>
                    </div>
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">${prescription.status}</span>
                </div>
            </div>
        `).join('');
    }

    loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments'));
        const patientAppointments = appointments[this.currentPatient.cardId] || [];
        const listDiv = document.getElementById('appointmentsList');

        if (patientAppointments.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-600">No scheduled appointments found.</p>';
            return;
        }

        listDiv.innerHTML = patientAppointments.map(appointment => `
            <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h5 class="font-semibold text-lg">${appointment.department}</h5>
                        <p class="text-gray-600"><i class="fas fa-calendar mr-2"></i>${appointment.date} at ${appointment.time}</p>
                        <p class="text-gray-600"><i class="fas fa-user-md mr-2"></i>${appointment.doctor}</p>
                    </div>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${appointment.status}</span>
                </div>
            </div>
        `).join('');
    }

    loadEmergencyInfo() {
        const patient = this.currentPatient;
        const emergencyDiv = document.getElementById('emergencyInfo');
        
        emergencyDiv.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 class="font-bold text-red-800 mb-2">Patient Information</h4>
                    <p><strong>Name:</strong> ${patient.firstName} ${patient.lastName}</p>
                    <p><strong>Card ID:</strong> ${patient.cardId}</p>
                    <p><strong>Date of Birth:</strong> ${patient.dateOfBirth}</p>
                    <p><strong>Blood Group:</strong> <span class="text-2xl font-bold text-red-600">${patient.bloodGroup}</span></p>
                </div>
                <div>
                    <h4 class="font-bold text-red-800 mb-2">Emergency Contact</h4>
                    <p class="text-lg"><strong>Phone:</strong> <a href="tel:${patient.emergencyContact}" class="text-blue-600 hover:underline">${patient.emergencyContact}</a></p>
                    <div class="mt-4">
                        <h4 class="font-bold text-red-800 mb-2">Emergency Actions</h4>
                        <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2">
                            <i class="fas fa-phone mr-2"></i>Call Emergency Contact
                        </button>
                        <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                            <i class="fas fa-ambulance mr-2"></i>Call 911
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showMedicalRecordModal() {
        document.getElementById('medicalRecordModal').classList.remove('hidden');
        document.getElementById('recordDate').value = new Date().toISOString().split('T')[0];
    }

    hideMedicalRecordModal() {
        document.getElementById('medicalRecordModal').classList.add('hidden');
        document.getElementById('medicalRecordForm').reset();
    }

    addMedicalRecord(e) {
        e.preventDefault();
        const date = document.getElementById('recordDate').value;
        const condition = document.getElementById('recordCondition').value;
        const doctor = document.getElementById('recordDoctor').value;
        const notes = document.getElementById('recordNotes').value;

        const medicalRecords = JSON.parse(localStorage.getItem('medicalRecords'));
        const patientRecords = medicalRecords[this.currentPatient.cardId] || [];
        
        const newRecord = {
            id: Date.now(),
            date,
            condition,
            doctor,
            notes
        };

        patientRecords.push(newRecord);
        medicalRecords[this.currentPatient.cardId] = patientRecords;
        localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));

        this.hideMedicalRecordModal();
        this.loadMedicalHistory();
        alert('Medical record added successfully!');
    }

    logout() {
        this.currentPatient = null;
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('authSection').classList.remove('hidden');
        this.showLoginForm();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedicalSmartCard();
});