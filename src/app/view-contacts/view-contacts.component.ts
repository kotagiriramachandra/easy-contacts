import { Component, OnInit } from '@angular/core';
import { ApiFacadeService } from '../core/api-facade.service';
import { EcContact } from '../core/contact.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { ViewContactsService } from './view-contacts.service';

@Component({
	selector: 'app-contacts',
	templateUrl: './view-contacts.component.html',
	styleUrls: ['./view-contacts.component.scss']
})
export class ViewContactsComponent implements OnInit {
	public contacts: EcContact[] = [];
	public favouriteContacts: EcContact[] = [];
	public searchQuery: string;
	public form: FormGroup;
	public loadingContacts: boolean = false;
	public loadingFavouriteContacts: boolean = false;

	constructor(
		private apiFacade: ApiFacadeService,
		private router: Router,
		private formBuilder: FormBuilder,
		private matDialog: MatDialog,
		private viewContactsService: ViewContactsService,
	) { }

	ngOnInit() {
		this.createForm();
		this.registerEvents();
		this.loadContactList();
		this.loadFavouriteContactList();
	}

	private loadContactList(): void {
		this.loadingContacts = true;

		const params = { _sort: 'firstName' };
		this.apiFacade.httpRequestGet('contacts', params).subscribe(responseData => {
			this.contacts = responseData;
			this.loadingContacts = false;
		}, errorResponse => this.loadingContacts = false);
	}

	private loadFavouriteContactList(): void {
		this.loadingFavouriteContacts = true;

		const params = {
			_sort: 'firstName',
			favourite: true,
		};
		this.apiFacade.httpRequestGet('contacts', params).subscribe(responseData => {
			this.favouriteContacts = responseData;
			this.loadingFavouriteContacts = false;
		}, errorResponse => this.loadingFavouriteContacts = false);
	}

	private createForm(): void {
		this.form = this.formBuilder.group({
			'searchQuery': [null]
		});
	}

	private registerEvents(): void {
		this.form.controls['searchQuery'].valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
		).subscribe(value => {
			this.searchQuery = value;
		});

		this.viewContactsService.contactFormEditSavedSource$.subscribe(() => {
			this.loadContactList();
			this.loadFavouriteContactList();
		});
	}

	public navigateToAddContact(): void {
		this.router.navigate(['/add-contacts']);
	}

	public getInitials(contactUser: EcContact): string {
		const initials = contactUser.firstName.charAt(0) + contactUser.lastName.charAt(0)
		return initials.toUpperCase();
	}

	public trackByFn(index, item) {
		return index; // or item.id
	}

	public toggleFavourite(contact: EcContact): void {
		contact.favourite = !contact.favourite;
		this.apiFacade.httpRequestPut(`contacts/${contact.id}`, contact).subscribe(responseData => {
			this.loadContactList();
			this.loadFavouriteContactList();
		});
	}

	public triggerDialog(editMode: boolean, selectedContact?: EcContact): void {
		const dialogOptions: any = {
			panelClass: ['ec-dialog'],
			maxHeight: '100vh',
			autoFocus: false,
			data: {
				editMode: editMode ? true : false,
			},
		};
		if (selectedContact) {
			dialogOptions.data.selectedContact = selectedContact;
		}
		const dialogRef = this.matDialog.open(InfoDialogComponent, dialogOptions);
	}
}
