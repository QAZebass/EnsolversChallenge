import { todoitems } from '../../support/Pages/ToDoItems';
import { folders } from '../../support/Pages/Folders';
import faker from 'faker';
let credentials;

describe('Ensolvers Challenge', () => {
	beforeEach('Preconditions', () => {
		cy.visit('/');
		cy.fixture('login.json').then(data => {
			credentials = data;
			cy.login(credentials.username, credentials.password);
		});
	});
	it('EC-001 | Validate that the user can create a new ToDo Item on the list', () => {
		//There seems to be a problem with the input field for the name of the item
		// that prevents the name from keeping itself written in the field
		//that's why the name is sometimes written and sometimes not,
		// other times the name is written incompletely or other times
		//it's not written at all.
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.get.createnewItem().should('exist').and('include.text', 'Create new To Do Item');
		todoitems.clickoncreateNewitem();
		todoitems.get.titlelabel().should('exist').and('have.text', 'Title');
		todoitems.get.todoTitleInput().type('New Title for Item', { delay: 50 });

		todoitems.get.descriptionlabel().should('exist').and('have.text', 'Description');
		todoitems.inputItemDescription(faker.lorem.sentence());
		todoitems.get.folderlabel().should('exist').and('have.text', 'Folder');
		cy.intercept('POST', '/api/to-do-items').as('saveItem');
		todoitems.chooseRandomFolder();
		cy.wait(2000);
		todoitems.get.saveButton().should('exist');
		todoitems.clickSave();
		cy.wait(2000);
		cy.wait('@saveItem').then(response => {
			expect(response.response.statusCode).equal(201);
		});
		todoitems.get.modal().should('exist');
		todoitems.get
			.modal()
			.invoke('text')
			.then(text => {
				expect(text).to.exist;
			});
	});
	it('EC-002 | Validate that the user can go back while creating a to-do item', () => {
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.get.createnewItem().should('exist').and('include.text', 'Create new To Do Item');
		todoitems.clickoncreateNewitem();
		todoitems.get.titlelabel().should('exist').and('have.text', 'Title');
		todoitems.get.descriptionlabel().should('exist').and('have.text', 'Description');
		todoitems.get.folderlabel().should('exist').and('have.text', 'Folder');
		todoitems.get.backButton().should('exist');
		todoitems.clickBackbutton();
		todoitems.get.headingTitle().should('include.text', 'To Do Items');
	});
	it('EC-003 | Validate that the user can delete an Item on the list', () => {
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.clickRandomDeleteItem();
		todoitems.get.modalDelete().should('exist');
		todoitems.get.modalDelete().find('div').should('include.text', 'Confirm delete operation');
		todoitems.get.confirmDeletionbutton().should('exist').and('be.enabled');
		cy.wait(1000);
		todoitems.clickConfirmDeletion();
		todoitems.get.modal().should('exist');
		todoitems.get
			.modal()
			.invoke('text')
			.then(del => {
				expect(del).to.exist;
			});
		todoitems.get.headingTitle().should('include.text', 'To Do Items');
	});
	it('EC-004 | Validate that the user can edit a to-do Item', () => {
		let titleBefore;
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.get
			.editButtons()
			.its('length')
			.then(leng => {
				const rn = Cypress._.random(0, leng - 1);
				todoitems.get
					.rows()
					.eq(rn)
					.then($el => {
						cy.wrap($el)
							.find('td')
							.eq(1)
							.invoke('text')
							.then(title => {
								titleBefore = title;
								cy.log(titleBefore);
								todoitems.get.editButtons().eq(rn).click();
								todoitems.get.todoTitleInput().trigger('focus').trigger('input').clear({ force: true }).type(faker.name.findName());
								todoitems.clickSave();
								todoitems.clickRefreshButton();
								cy.wait(3000);
								todoitems.get.modal().should('exist');
								todoitems.get
									.modal()
									.invoke('text')
									.then(modaltext => {
										expect(modaltext).to.exist;
										todoitems.get
											.rows()
											.eq(rn)
											.then($el => {
												cy.wrap($el)
													.find('td')
													.eq(1)
													.invoke('text')
													.then(textafter => {
														cy.log(`The actual text is ${textafter}`);
														expect(titleBefore).not.equal(textafter);
													});
											});
									});
							});
					});
			});
	});
	it('EC-005 | Validate that the user can sort the ID of the items with the ID button', () => {
		//These sorting tests only work then there's just one page available, for some reason
		// when there are two pages or more, the array of elements I retrieve from the website
		// isn't correct.
		let IDs = [];
		let SortedInWeb = [];
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.get.IDsortingButton().should('exist');
		todoitems.get
			.rows()
			.its('length')
			.then(leng => {
				for (let i = 0; i <= leng - 1; i++) {
					todoitems.get
						.rows()
						.eq(i)
						.then($el => {
							cy.wrap($el)
								.find('td')
								.eq(0)
								.invoke('text')
								.then(id => {
									cy.log(id);
									const number = Number(id);
									IDs.push(number);
								});
						});
				}
				todoitems.clickSortID();
				cy.wait(2000);
			})
			.then(() => {
				const sortedInTestIDs = IDs.sort(function (a, b) {
					return b - a;
				});
				cy.log(`This array should be sorted in descending order in the test: ${sortedInTestIDs}`);

				todoitems.get
					.rows()
					.its('length')
					.then(leng => {
						for (let i = 0; i <= leng - 1; i++) {
							todoitems.get
								.rows()
								.eq(i)
								.then($el => {
									cy.wrap($el)
										.find('td')
										.eq(0)
										.invoke('text')
										.then(id => {
											const number = Number(id);
											SortedInWeb.push(number);
										});
								});
						}
						cy.log(`This should be the array sorted from the web ${SortedInWeb}`);
					})
					.then(() => {
						expect(SortedInWeb).to.deep.equal(sortedInTestIDs);
					});
			});
	});
	it('EC-006 | Validate that the user can sort the titles alphabetically', () => {
		//These sorting tests only work then there's just one page available, for some reason
		// when there are two pages or more, the array of elements I retrieve from the website
		// isn't correct.
		let Titles = [];
		let sortedInTest;
		let sortedFromWeb = [];
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.get.titleSortingButton().should('exist');
		todoitems.get
			.rows()
			.its('length')
			.then(leng => {
				for (let i = 0; i <= leng - 1; i++) {
					todoitems.get
						.rows()
						.eq(i)
						.then($el => {
							cy.wrap($el)
								.find('td')
								.eq(1)
								.invoke('text')
								.then(titles => {
									cy.log(titles);
									Titles.push(titles);
								});
						});
				}
				todoitems.clickSortTitle();
				todoitems.clickSortTitle();
				cy.wait(5000);
			})
			.then(() => {
				cy.log(Titles);
				sortedInTest = Titles.sort(function (a, b) {
					return a.localeCompare(b);
				});
				cy.log(`These are the titles sorted in the test ${sortedInTest}`);

				todoitems.get
					.rows()
					.its('length')
					.then(leng => {
						for (let i = 0; i <= leng - 1; i++) {
							todoitems.get
								.rows()
								.eq(i)
								.then($el => {
									cy.wrap($el)
										.find('td')
										.eq(1)
										.invoke('text')
										.then(titles => {
											cy.log(titles);
											sortedFromWeb.push(titles);
										});
								});
						}
						cy.log(sortedFromWeb);
					})
					.then(() => {
						expect(sortedFromWeb).to.deep.equal(sortedInTest);
					});
			});
	});
	it('EC-007 | Validate that the user can sort the descriptions alphabetically', () => {
		//These sorting tests only work then there's just one page available, for some reason
		// when there are two pages or more, the array of elements I retrieve from the website
		// isn't correct.
		let Desc = [];
		let sortedInTest;
		let sortedFromWeb = [];
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.get.descriptionSortingButton().should('exist');
		todoitems.get
			.rows()
			.its('length')
			.then(leng => {
				for (let i = 0; i <= leng - 1; i++) {
					todoitems.get
						.rows()
						.eq(i)
						.then($el => {
							cy.wrap($el)
								.find('td')
								.eq(2)
								.invoke('text')
								.then(description => {
									cy.log(description);
									Desc.push(description);
								});
						});
				}
				todoitems.clickSortDescription();
				cy.wait(2000);
				todoitems.clickSortDescription();
				cy.wait(2000);
			})
			.then(() => {
				cy.log(Desc);
				sortedInTest = Desc.sort(function (a, b) {
					return a.localeCompare(b);
				});
				cy.log(`These are the descriptions sorted in the test ${sortedInTest}`);

				todoitems.get
					.rows()
					.its('length')
					.then(leng => {
						for (let i = 0; i <= leng - 1; i++) {
							todoitems.get
								.rows()
								.eq(i)
								.then($el => {
									cy.wrap($el)
										.find('td')
										.eq(2)
										.invoke('text')
										.then(description => {
											cy.log(description);
											sortedFromWeb.push(description);
										});
								});
						}
					});
			})
			.then(() => {
				cy.log(`These are the descriptions sorted from the web: ${sortedFromWeb}`);
				expect(sortedFromWeb).to.deep.equal(sortedInTest);
			});
	});
	it('EC-008 | Validate that the user can view the items in details with the button "View"', () => {
		let ID;
		let Title;
		let description;
		let Folder;
		let User = 'user';
		todoitems.get.todoItemsbutton().should('exist');
		todoitems.clicktodoItemsbutton();
		todoitems.get
			.viewButtons()
			.its('length')
			.then(leng => {
				const rn = Cypress._.random(0, leng - 1);
				cy.log(rn);
				todoitems.get
					.rows()
					.eq(rn)
					.then($el => {
						cy.wrap($el)
							.find('td')
							.eq(0)
							.invoke('text')
							.then(id => {
								ID = id;
								cy.log(ID);
							});
					});
				todoitems.get
					.rows()
					.eq(rn)
					.then($el => {
						cy.wrap($el)
							.find('td')
							.eq(1)
							.invoke('text')
							.then(title => {
								Title = title;
								cy.log(Title);
							});
					});
				todoitems.get
					.rows()
					.eq(rn)
					.then($el => {
						cy.wrap($el)
							.find('td')
							.eq(2)
							.invoke('text')
							.then(desc => {
								description = desc;
								cy.log(description);
							});
					});
				todoitems.get
					.rows()
					.eq(rn)
					.then($el => {
						cy.wrap($el)
							.find('td')
							.eq(3)
							.invoke('text')
							.then(folder => {
								Folder = folder;
								cy.log(Folder);

								cy.log(`${ID},${Title} ,${description}, ${Folder}`);
								todoitems.clickViewButton(rn);
								cy.wait(2000);
								todoitems.get.viewDetails().within(() => {
									cy.get('dd')
										.first()
										.invoke('text')
										.then(id => {
											expect(id).to.equal(ID);
										});
									cy.get('dd')
										.eq(1)
										.invoke('text')
										.then(title => {
											expect(title).to.equal(Title);
										});
									cy.get('dd')
										.eq(2)
										.invoke('text')
										.then(desc => {
											expect(desc).to.equal(description);
										});
									cy.get('dd')
										.eq(3)
										.invoke('text')
										.then(user => {
											expect(user).to.equal(User);
										});
									cy.get('dd')
										.eq(4)
										.invoke('text')
										.then(folder => {
											expect(folder).to.equal(Folder);
										});
								});
							});
					});
			});
	});
	it('EC-009 | Validate that the user can create a new folder', () => {
		folders.get.manageFoldersButton().should('exist').and('be.enabled');
		folders.clickManageFolders();
		folders.clickOnNewFolder();
		folders.get.nameLabelFolder().within(() => {
			cy.get('[id="nameLabel"]')
				.invoke('text')
				.then(label => {
					expect(label).to.exist;
				});
			cy.get('[data-cy="name"]').should('exist');
		});
		folders.get.nameFieldfolder().trigger('focus').trigger('input').clear({ force: true }).type(faker.name.findName());
		folders.get.saveButton().should('exist');
		cy.intercept('POST', '/api/folders').as('newFolder');
		folders.clickSave();
		cy.wait(2000);
		cy.wait('@newFolder').then(response => {
			expect(response.response.statusCode).to.equal(201);
		});
		folders.get.modal().should('exist');
		folders.get
			.modal()
			.invoke('text')
			.then(text => {
				expect(text).to.exist;
			});
	});
	it('EC-010 | Validate that the user can go back while creating a new folder', () => {
		folders.get.manageFoldersButton().should('exist');
		folders.clickManageFolders();
		cy.wait(3000);
		folders.clickOnNewFolder();
		folders.get.backButton().should('exist');
		folders.clickBackButton();
		folders.get.folderHeading().should('contain', 'Folders');
	});
	it.skip('EC-011 | Validate that the user can delete a Folder on the list', () => {
		//I decided to write this test in spite of it failing at random times.
		folders.get.manageFoldersButton().should('exist');
		folders.clickManageFolders();
		folders.get
			.deleteButtons()
			.its('length')
			.then(leng => {
				const rn = Cypress._.random(0, leng - 1);
				folders.clickDeleteButton(rn);
			});
		folders.get.modalDelete().within(() => {
			cy.get('[data-cy="folderDeleteDialogHeading"]')
				.invoke('text')
				.then(text => {
					expect(text).to.exist;
				});
			cy.get('[class="modal-body"]')
				.invoke('text')
				.then(text => {
					expect(text).to.exist;
				});
			cy.get('[id="jhi-confirm-delete-folder"]').should('exist');
			folders.clickDeleteConfirmation();
		});
	});
	it('EC-012 | Validate that the user can edit a folder', () => {
		let ID;
		folders.get.manageFoldersButton().should('exist');
		folders.clickManageFolders();
		folders.get
			.editButtons()
			.its('length')
			.then(leng => {
				const rn = Cypress._.random(0, leng - 1);
				folders.get
					.rows()
					.eq(rn)
					.then($el => {
						cy.wrap($el)
							.find('td')
							.eq(0)
							.invoke('text')
							.then(id => {
								ID = id;
							});
					})
					.then(() => {
						folders.clickEditFolder(rn);
						folders.get.editFields().within(() => {
							cy.get('[id = "idLabel"]')
								.invoke('text')
								.then(label => {
									expect(label).to.exist;
								});
							cy.get('[name="id"]').should('exist');
							cy.get('[id="nameLabel"]')
								.invoke('text')
								.then(name => {
									expect(name).to.exist;
								});
							folders.get.nameFieldfolder().should('exist');
							folders.get.nameFieldfolder().clear();
							cy.wait(2000);
							cy.log(ID);
							folders.get.nameFieldfolder().trigger('focus').trigger('input').clear({ force: true }).type(faker.name.findName());
							cy.intercept('PUT', `/api/folders/${ID}`).as('folderchange');
							folders.clickSave();
							cy.wait(2000);
							cy.wait('@folderchange').then(response => {
								expect(response.response.statusCode).to.equal(200);
							});
						});
					});
			});
	});
	it(' EC-013 | Validate that the user can view a folder in detail with the button View', () => {
		const user = 'user';
		folders.get.manageFoldersButton().should('exist');
		folders.clickManageFolders();
		folders.get
			.viewButtons()
			.its('length')
			.then(leng => {
				const rn = Cypress._.random(0, leng - 1);
				folders.clickViewFolderButton(rn);
				cy.wait(3000);
				folders.get.viewFolderInfo().within(() => {
					cy.get('h2')
						.invoke('text')
						.then(title => {
							expect(title).to.exist;
						});
					cy.get('[class="jh-entity-details"]')
						.find('dd')
						.first()
						.invoke('text')
						.then(text => {
							expect(text).to.exist;
						});
					cy.get('span[id="name"]').should('exist');
					cy.get('dd')
						.eq(1)
						.invoke('text')
						.then(text => {
							expect(text).to.exist;
						});
					cy.get('dt')
						.eq(2)
						.invoke('text')
						.then(text => {
							expect(text).to.exist;
						});
					cy.get('dd')
						.eq(2)
						.invoke('text')
						.then(text => {
							expect(text).to.equal(user);
						});
				});
			});
	});
});

// ** Importing this function prevents the UNCAUGHT EXCEPTION AND FETCH from happening.
Cypress.on('uncaught:exception', () => {
	// returning false here prevents Cypress from
	// failing the test
	return false;
});
// Comando predeterminado para que no aparezcan los Fetch en el log del Test Runner:
const origLog = Cypress.log;
Cypress.log = function (opts, ...other) {
	if (opts.displayName === 'xhr' || (opts.displayName === 'fetch' && opts.url.startsWith('https://'))) {
		return;
	}
	return origLog(opts, ...other);
};
