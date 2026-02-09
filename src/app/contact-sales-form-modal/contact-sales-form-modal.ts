import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactSalesService, ContactSalesResponse } from '../services/contact-sales.service';
import { ModalService } from '../services/modal.service';
import { CdnIconComponent } from '../cdn-icons-images/getIcon/cdn-icon.component';

@Component({
  selector: 'app-contact-sales-form-modal',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdnIconComponent
  ],
  templateUrl: './contact-sales-form-modal.html',
  styleUrl: './contact-sales-form-modal.scss',
})
export class ContactSalesFormModal {
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private contactSalesService = inject(ContactSalesService);
  private cdr = inject(ChangeDetectorRef);

  contactForm: FormGroup;
  loading = false;
  characterCount = 0;
  maxCharacters = 500;
  submittedSuccessfully = false;

  shippingProviders = [
    'Delhivery',
    'Blue Dart',
    'FedEx',
    'DTDC',
    'Xpressbees',
    'Other'
  ];

  monthlyShipmentVolumeOptions = [
    '0-100',
    '101-500',
    '501-1000',
    '1001-5000',
    '5000+'
  ];
  User= JSON.parse(localStorage.getItem('ngStorage-USER') || '{}');


  constructor() {
    const fullName = this.User?.first_name && this.User?.last_name 
      ? `${this.User.first_name} ${this.User.last_name}`.trim() 
      : '';
    const email = this.User?.email || '';
    const phoneNumber = this.User?.mobile || '';
    const companyName = this.User?.company_name || '';
    const websiteUrl = this.User?.company_website_url || '';

    this.contactForm = this.fb.group({
      fullName: [fullName, [Validators.required]],
      email: [email, [Validators.required, Validators.email]],
      phoneNumber: [phoneNumber, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      companyName: [companyName, [Validators.required]],
      websiteUrl: [websiteUrl],
      monthlyShipmentVolume: ['', [Validators.required]],
      currentShippingProvider: [''],
      specificRequirements: ['']
    });

    this.contactForm.get('specificRequirements')?.valueChanges.subscribe(value => {
      this.characterCount = value?.length || 0;
    });
  }

  onCancel(): void {
    this.modalService.close();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.loading = true;
      this.contactSalesService.submitContactForm(this.contactForm.value).subscribe({
        next: (response: ContactSalesResponse) => {
          this.loading = false;
          if (response.success) {
            this.submittedSuccessfully = true;
          } else {
            alert(response.message);
          }
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error submitting form:', error);
          this.loading = false;
          alert('An error occurred. Please try again.');
          this.cdr.detectChanges();
        }
      });
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.contactForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Invalid email format';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid phone number';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
