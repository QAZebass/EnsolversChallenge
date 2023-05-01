export let deletebutton;
class TodoItems {
	get = {
		userInput: () => cy.get('[data-cy="username"]'),
		passInput: () => cy.get('[data-cy="password"]'),
		submitButton: () => cy.get('[data-cy="submit"]'),
		todoItemsbutton: () => cy.get('[class="mr-2 btn btn-info"]').first(),
		createnewItem: () => cy.get('[data-cy="entityCreateButton"]'),
		todoTitleInput: () => cy.get('[data-cy="title"]', { timeout: 2000 }),
		todoDescInput: () => cy.get('[data-cy="description"]'),
		folders: () => cy.get('[data-cy="folder"] option'),
		foldersContainer: () => cy.get('[data-cy="folder"]'),
		titlelabel: () => cy.get('[id="titleLabel"]'),
		descriptionlabel: () => cy.get('[id="descriptionLabel"]'),
		folderlabel: () => cy.get('[id="folderIdLabel"]'),
		saveButton: () => cy.get('[data-cy="entityCreateSaveButton"]'),
		modal: () => cy.get('[class*="--success toastify-toast"]'),
		IDcell: () => cy.get('a.btn.btn-link.btn-sm'),
		LastPage: () => cy.get('[aria-label="Last"]'),
		backButton: () => cy.get('[data-cy="entityCreateCancelButton"]'),
		headingTitle: () => cy.get('[id="to-do-item-heading"]'),
		deleteButtons: () => cy.get('a.btn.btn-danger.btn-sm'),
		viewButtons: () => cy.get('[data-cy="entityDetailsButton"]'),
		modalDelete: () => cy.get('[class="modal-content"]'),
		confirmDeletionbutton: () => cy.get('[data-cy="entityConfirmDeleteButton"]'),
		rows: () => cy.get('[data-cy="entityTable"]'),
		editButtons: () => cy.get('a.btn.btn-primary.btn-sm'),
		refreshButton: () => cy.get('[class="mr-2 btn btn-info"]'),
		IDsortingButton: () => cy.get('[class="hand"]').first(),
		titleSortingButton: () => cy.get('[class="hand"]').eq(1),
		descriptionSortingButton: () => cy.get('[class="hand"]').eq(2),
		viewDetails: () => cy.get('[class="jh-entity-details"]'),
	};
	clicktodoItemsbutton() {
		this.get.todoItemsbutton().click();
	}
	clickoncreateNewitem() {
		this.get.createnewItem().click();
	}
	inputItemTitle(title) {
		this.get.todoTitleInput().type(title);
	}
	inputItemDescription(description) {
		this.get.todoDescInput().type(description);
	}
	chooseRandomFolder() {
		this.get
			.folders()
			.its('length')
			.then(length => {
				const rn = Cypress._.random(1, length - 1);
				this.get.foldersContainer().select(rn);
			});
	}
	clickSave() {
		this.get.saveButton().click();
	}
	clickLastPage() {
		this.get.LastPage().click({ force: true });
	}
	clickBackbutton() {
		this.get.backButton().click();
	}
	clickRandomDeleteItem() {
		this.get
			.deleteButtons()
			.its('length')
			.then(leng => {
				const rn = Cypress._.random(0, leng - 1);

				this.get.deleteButtons().eq(rn).click();
			});
	}
	clickConfirmDeletion() {
		this.get.confirmDeletionbutton().click();
	}
	clickEditbutton(number) {
		this.get.editButtons().eq(number);
	}
	clickRefreshButton() {
		this.get.refreshButton().click();
	}
	clickSortID() {
		this.get.IDsortingButton().click();
	}
	clickSortTitle() {
		this.get.titleSortingButton().click();
	}
	clickSortDescription() {
		this.get.descriptionSortingButton().click();
	}
	clickViewButton(number) {
		this.get.viewButtons().eq(number).click();
	}
}

export const todoitems = new TodoItems();
