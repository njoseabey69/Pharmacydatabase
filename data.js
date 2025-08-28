// Data management for PharmaSys

class DataManager {
    constructor() {
        this.storageKey = 'pharmaData';
        this.defaultData = this.getDefaultData();
        this.data = this.loadData();
    }

    getDefaultData() {
        return {
            medications: [
                {
                    id: 'MED001',
                    name: 'Amoxicillin',
                    dosage: '500mg',
                    quantity: 100,
                    expirationDate: '2025-12-31',
                    price: 0.50,
                    supplier: 'PharmaCorp Inc.',
                    description: 'Antibiotic used to treat a number of bacterial infections.',
                    category: 'Antibiotics',
                    minStockLevel: 50,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'MED002',
                    name: 'Lisinopril',
                    dosage: '10mg',
                    quantity: 75,
                    expirationDate: '2025-11-15',
                    price: 0.35,
                    supplier: 'MediSource Ltd.',
                    description: 'ACE inhibitor used to treat high blood pressure.',
                    category: 'Cardiovascular',
                    minStockLevel: 30,
                    createdAt: new Date().toISOString()
                }
            ],
            customers: [
                {
                    id: 'CUST001',
                    firstName: 'Sarah',
                    lastName: 'Johnson',
                    phone: '(555) 123-4567',
                    email: 'sarah.j@example.com',
                    address: '123 Main St, Anytown, USA',
                    status: 'active',
                    prescriptions: 5,
                    createdAt: new Date().toISOString()
                }
            ],
            doctors: [
                {
                    id: 'DOC001',
                    firstName: 'Dr.',
                    lastName: 'Miller',
                    specialty: 'Cardiologist',
                    phone: '(555) 111-2222',
                    email: 'dr.miller@example.com',
                    prescriptions: 15,
                    createdAt: new Date().toISOString()
                }
            ],
            suppliers: [
                {
                    id: 'SUPP001',
                    name: 'PharmaCorp Inc.',
                    phone: '(555) 111-0000',
                    email: 'contact@pharmacorp.com',
                    address: '500 Corporate Way, Business Park, CA 90001',
                    website: 'https://www.pharmacorp.com',
                    status: 'active',
                    products: 120,
                    createdAt: new Date().toISOString()
                }
            ],
            prescriptions: [
                {
                    id: 'PRE0023',
                    customerId: 'CUST001',
                    doctorId: 'DOC001',
                    dateIssued: '2025-04-12',
                    medications: [
                        { medicationId: 'MED001', dosage: '500mg', quantity: 2, price: 1.00 },
                        { medicationId: 'MED002', dosage: '10mg', quantity: 1, price: 0.35 }
                    ],
                    total: 1.35,
                    notes: 'Take as directed',
                    status: 'completed',
                    createdAt: new Date().toISOString()
                }
            ],
            reports: [
                {
                    id: 'REP0015',
                    type: 'Inventory Status',
                    dateRange: 'Apr 1 - Apr 15, 2025',
                    generatedBy: 'John Doe',
                    dateCreated: '2025-04-16',
                    format: 'PDF',
                    filters: {},
                    createdAt: new Date().toISOString()
                }
            ]
        };
    }

    loadData() {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            if (storedData) {
                return JSON.parse(storedData);
            }
            return this.defaultData;
        } catch (error) {
            console.error('Failed to load data from localStorage:', error);
            return this.defaultData;
        }
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
            return false;
        }
    }

    // Medication methods
    getMedications() {
        return this.data.medications;
    }

    addMedication(medication) {
        const newMedication = {
            ...medication,
            id: 'MED' + this.generateId(),
            createdAt: new Date().toISOString()
        };
        this.data.medications.push(newMedication);
        this.saveData();
        return newMedication;
    }

    updateMedication(id, updates) {
        const index = this.data.medications.findIndex(m => m.id === id);
        if (index !== -1) {
            this.data.medications[index] = { ...this.data.medications[index], ...updates };
            this.saveData();
            return this.data.medications[index];
        }
        return null;
    }

    deleteMedication(id) {
        const index = this.data.medications.findIndex(m => m.id === id);
        if (index !== -1) {
            this.data.medications.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // Customer methods
    getCustomers() {
        return this.data.customers;
    }

    addCustomer(customer) {
        const newCustomer = {
            ...customer,
            id: 'CUST' + this.generateId(),
            createdAt: new Date().toISOString()
        };
        this.data.customers.push(newCustomer);
        this.saveData();
        return newCustomer;
    }

    // Doctor methods
    getDoctors() {
        return this.data.doctors;
    }

    addDoctor(doctor) {
        const newDoctor = {
            ...doctor,
            id: 'DOC' + this.generateId(),
            createdAt: new Date().toISOString()
        };
        this.data.doctors.push(newDoctor);
        this.saveData();
        return newDoctor;
    }

    // Supplier methods
    getSuppliers() {
        return this.data.suppliers;
    }

    addSupplier(supplier) {
        const newSupplier = {
            ...supplier,
            id: 'SUPP' + this.generateId(),
            createdAt: new Date().toISOString()
        };
        this.data.suppliers.push(newSupplier);
        this.saveData();
        return newSupplier;
    }

    // Prescription methods
    getPrescriptions() {
        return this.data.prescriptions;
    }

    addPrescription(prescription) {
        const newPrescription = {
            ...prescription,
            id: 'PRE' + this.generateId(),
            createdAt: new Date().toISOString()
        };
        this.data.prescriptions.push(newPrescription);
        this.saveData();
        return newPrescription;
    }

    // Utility methods
    generateId() {
        return Date.now().toString().slice(-6);
    }

    // Search methods
    searchMedications(query) {
        return this.data.medications.filter(med => 
            med.name.toLowerCase().includes(query.toLowerCase()) ||
            med.category.toLowerCase().includes(query.toLowerCase()) ||
            med.supplier.toLowerCase().includes(query.toLowerCase())
        );
    }

    searchCustomers(query) {
        return this.data.customers.filter(customer => 
            customer.firstName.toLowerCase().includes(query.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query)
        );
    }

    // Get low stock medications
    getLowStockMedications() {
        return this.data.medications.filter(med => 
            med.quantity <= med.minStockLevel
        );
    }

    // Get expiring medications
    getExpiringMedications(days = 30) {
        const today = new Date();
        const thresholdDate = new Date();
        thresholdDate.setDate(today.getDate() + days);
        
        return this.data.medications.filter(med => {
            const expDate = new Date(med.expirationDate);
            return expDate <= thresholdDate && expDate >= today;
        });
    }

    // Export data
    exportData(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.data, null, 2);
        }
        // Add CSV export functionality here
        return null;
    }

    // Import data
    importData(jsonData) {
        try {
            const parsedData = JSON.parse(jsonData);
            this.data = { ...this.defaultData, ...parsedData };
            this.saveData();
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}

// Create global data manager instance
window.dataManager = new DataManager();
