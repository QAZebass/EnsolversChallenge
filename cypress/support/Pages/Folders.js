class Folders {
	get = {
		manageFoldersButton: () => cy.get('[class="mr-2 btn btn-info"]').eq(1),
		NewFolderButton: () => cy.get('[data-cy="entityCreateButton"]'),
		nameFieldfolder: () => cy.get('[data-cy="name"]'),
		nameLabelFolder: () => cy.get('div.col-md-8').eq(1),
		saveButton: () => cy.get('[data-cy="entityCreateSaveButton"]'),
		modal: () => cy.get('[class*="--success toastify-toast"]'),
		modalDelete: () => cy.get('[class="modal-content"]'),
		confirmDeletionbutton: () => cy.get('[data-cy="entityConfirmDeleteButton"]'),
		backButton: () => cy.get('[data-cy="entityCreateCancelButton"]'),
		folderHeading: () => cy.get('[data-cy="FolderHeading"]'),
		deleteButtons: () => cy.get('[data-cy="entityDeleteButton"]'),
		editButtons: () => cy.get('[data-cy="entityEditButton"]'),
		editFields: () => cy.get('form'),
		rows: () => cy.get('[data-cy="entityTable"]'),
		modalFolder: () => cy.get('[class="Toastify"]'),
		viewButtons: () => cy.get('[data-cy="entityDetailsButton"]'),
		viewFolderInfo: () => cy.get('[class="col-md-8"]'),
	};
	clickManageFolders() {
		this.get.manageFoldersButton().click();
	}
	clickOnNewFolder() {
		this.get.NewFolderButton().click();
	}
	inputNameNewFolder(name) {
		this.get.nameFieldfolder().type(name);
	}
	clickSave() {
		this.get.saveButton().click();
	}
	clickBackButton() {
		this.get.backButton().click();
	}
	clickDeleteButton(number) {
		this.get.deleteButtons().eq(number).click();
	}
	clickDeleteConfirmation() {
		this.get.confirmDeletionbutton().click();
	}
	clickEditFolder(number) {
		this.get.editButtons().eq(number).click();
	}
	inputNameEditFolder(name) {
		this.get.nameFieldfolder().type(name);
	}
	clickViewFolderButton(number) {
		this.get.viewButtons().eq(number).click();
	}
}
export const folders = new Folders();
