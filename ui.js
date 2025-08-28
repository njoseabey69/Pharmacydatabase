// UI interactions for PharmaSys

class UIManager {
    constructor() {
        this.initEventListeners();
        this.initModals();
    }

    initEventListeners() {
        // Form submission handlers
        this.initFormHandlers();
        
        // Button click handlers
        this.initButtonHandlers();
        
        // Search functionality
        this.initSearchHandlers();
    }

    initFormHandlers() {
        // Save Medication Button
        $("#saveMedicationBtn").click(() => this.handleSaveMedication());
        
        // Update Medication Button
        $("#updateMedicationBtn").click(() => this.handleUpdateMedication());
        
        // Save Customer Button
        $("#saveCustomerBtn").click(() => this.handleSaveCustomer());
        
        // Update Customer Button
        $("#updateCustomerBtn").click(() => this.handleUpdateCustomer());
        
        // Save Doctor Button
        $("#saveDoctorBtn").click(() => this.handleSaveDoctor());
        
        // Update Doctor Button
        $("#updateDoctorBtn").click(() => this.handleUpdateDoctor());
        
        // Save Supplier Button
        $("#saveSupplierBtn").click(() => this.handleSaveSupplier());
        
        // Update Supplier Button
        $("#updateSupplierBtn").click(() => this.handleUpdateSupplier());
        
        // Save Prescription Button
        $("#savePrescriptionBtn").click(() => this.handleSavePrescription());
        
        // Generate Report Button
        $("#generateReportBtn").click(() => this.handleGenerateReport());
    }

    initButtonHandlers() {
        // Delete buttons
        $(".btn-danger").click((e) => {
            const button = $(e.target).closest('.btn-danger');
            this.handleDelete(button);
        });

        // View buttons
        $(".btn-info").click((e) => {
            const button = $(e.target).closest('.btn-info');
            this.handleView(button);
        });

        // Print buttons
        $(".btn-success[title='Print']").click((e) => {
            const button = $(e.target).closest('.btn-success');
            this.handlePrint(button);
        });
    }

    initSearchHandlers() {
        // Search input handlers
        $("input[type='search']").on('input', (e) => {
            this.handleSearch(e.target);
        });

        // Filter dropdowns
        $("select").change((e) => {
            this.handleFilter(e.target);
        });
    }

    initModals() {
        // Modal show/hide events
        $('.modal').on('show.bs.modal', (e) => {
            this.handleModalShow(e);
        });

        $('.modal').on('hide.bs.modal', (e) => {
            this.handleModalHide(e);
        });
    }

    // Form handling methods
    async handleSaveMedication() {
        try {
            this.showLoading();
            
            const formData = this.getFormData('#addMedicationForm');
            const validation = this.validateMedicationForm(formData);
            
            if (!validation.isValid) {
                this.showError(validation.errors.join(', '));
                this.hideLoading();
                return;
            }

            const medication = window.dataManager.addMedication(formData);
            this.showSuccess('Medication added successfully!');
            
            // Close modal and reset form
            $('#addMedicationModal').modal('hide');
            $('#addMedicationForm')[0].reset();
            
            // Refresh medication list
            this.refreshMedicationList();
            
        } catch (error) {
            this.showError('Failed to add medication: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async handleUpdateMedication() {
        try {
            this.showLoading();
            
            const formData = this.getFormData('#editMedicationForm');
            const validation = this.validateMedicationForm(formData);
            
            if (!validation.isValid) {
                this.showError(validation.errors.join(', '));
                this.hideLoading();
                return;
            }

            // Get medication ID from somewhere (this would need implementation)
            const medicationId = $('#editMedicationModal').data('medicationId');
            const medication = window.dataManager.updateMedication(medicationId, formData);
            
            if (medication) {
                this.showSuccess('Medication updated successfully!');
                $('#editMedicationModal').modal('hide');
                this.refreshMedicationList();
            } else {
                this.showError('Medication not found');
            }
            
        } catch (error) {
            this.showError('Failed to update medication: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // Similar methods for other entities (customers, doctors, suppliers, prescriptions)
    async handleSaveCustomer() {
        // Implementation similar to handleSaveMedication
        this.showLoading();
        setTimeout(() => {
            this.showSuccess('Customer added successfully!');
            $('#addCustomerModal').modal('hide');
            this.hideLoading();
        }, 1000);
    }

    async handleSaveDoctor() {
        this.showLoading();
        setTimeout(() => {
            this.showSuccess('Doctor added successfully!');
            $('#addDoctorModal').modal('hide');
            this.hideLoading();
        }, 1000);
    }

    async handleSaveSupplier() {
        this.showLoading();
        setTimeout(() => {
            this.showSuccess('Supplier added successfully!');
            $('#addSupplierModal').modal('hide');
            this.hideLoading();
        }, 1000);
    }

    async handleSavePrescription() {
        this.showLoading();
        setTimeout(() => {
            this.showSuccess('Prescription created successfully!');
            $('#addPrescriptionModal').modal('hide');
            this.hideLoading();
        }, 1000);
    }

    async handleGenerateReport() {
        this.showLoading();
        setTimeout(() => {
            this.showSuccess('Report generated successfully!');
            this.hideLoading();
        }, 2000);
    }

    // Utility methods
    getFormData(formSelector) {
        const form = $(formSelector)[0];
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    validateMedicationForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Medication name is required');
        }
        
        if (!data.dosage || data.dosage.trim().length === 0) {
            errors.push('Dosage is required');
        }
        
        if (!data.quantity || data.quantity < 0) {
            errors.push('Valid quantity is required');
        }
        
        if (!data.price || data.price < 0) {
            errors.push('Valid price is required');
        }
        
        if (!data.expirationDate) {
            errors.push('Expiration date is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // UI feedback methods
    showLoading() {
        $("#loadingOverlay").addClass("show");
    }

    hideLoading() {
        $("#loadingOverlay").removeClass("show");
    }

    showSuccess(message) {
        this.showToast("success", message);
    }

    showError(message) {
        this.showToast("error", message);
    }

    showToast(type, message) {
        const toast = type === "success" ? $("#successToast") : $("#errorToast");
        const messageElement = type === "success" ? $("#successToastMessage") : $("#errorToastMessage");
        
        messageElement.text(message);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    // Data refresh methods
    refreshMedicationList() {
        const medications = window.dataManager.getMedications();
        // Implementation to update medication table would go here
        console.log('Refreshing medication list:', medications.length, 'items');
    }

    refreshCustomerList() {
        const customers = window.dataManager.getCustomers();
        // Implementation to update customer table
        console.log('Refreshing customer list:', customers.length, 'items');
    }

    // Modal handlers
    handleModalShow(event) {
        const modal = $(event.target);
        console.log('Modal shown:', modal.attr('id'));
    }

    handleModalHide(event) {
        const modal = $(event.target);
        console.log('Modal hidden:', modal.attr('id'));
        modal.find('form')[0].reset();
    }

    // Button action handlers
    handleDelete(button) {
        const confirmed = confirm('Are you sure you want to delete this item?');
        if (confirmed) {
            this.showLoading();
            setTimeout(() => {
                this.showSuccess('Item deleted successfully!');
                this.hideLoading();
            }, 1000);
        }
    }

    handleView(button) {
        console.log('View item:', button.closest('tr').find('td:first').text());
    }

    handlePrint(button) {
        console.log('Print item:', button.closest('tr').find('td:first').text());
        window.print();
    }

    // Search and filter handlers
    handleSearch(input) {
        const query = $(input).val();
        const table = $(input).closest('.card').find('table');
        console.log('Search query:', query, 'in table:', table.attr('class'));
    }

    handleFilter(select) {
        const filterValue = $(select).val();
        const filterType = $(select).attr('name') || $(select).closest('.col-md-3').find('label').text();
        console.log('Filter by', filterType, ':', filterValue);
    }

    // Responsive helpers
    toggleSidebar() {
        $(".sidebar").toggleClass("collapsed");
        $(".main-content").toggleClass("expanded");
        $(".topbar").toggleClass("expanded");
    }

    // Data export/import
    exportData(format = 'json') {
        const data = window.dataManager.exportData(format);
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pharmasys-backup-${new Date().toISOString().split('T')[0]}.${format}`;
            a.click();
            URL.revokeObjectURL(url);
            this.showSuccess('Data exported successfully!');
        }
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const success = window.dataManager.importData(e.target.result);
            if (success) {
                this.showSuccess('Data imported successfully!');
                this.refreshAllLists();
            } else {
                this.showError('Failed to import data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    refreshAllLists() {
        this.refreshMedicationList();
        this.refreshCustomerList();
        // Refresh other lists as needed
    }
}

// Create global UI manager instance when document is ready
$(document).ready(() => {
    window.uiManager = new UIManager();
});
