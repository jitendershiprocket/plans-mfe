import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ContactSalesForm } from '../models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class ContactSalesService {
  private apiUrl = '/api/contact-sales'; // Update with actual API endpoint
  private http = inject(HttpClient); // Angular 21: use inject() instead of constructor

  /**
   * Submit contact sales form
   */
  submitContactForm(formData: ContactSalesForm): Observable<{ success: boolean; message: string }> {
    // TODO: Replace with actual API call
    // return this.http.post<{ success: boolean; message: string }>(this.apiUrl, formData);
    
    // Mock response
    return of({
      success: true,
      message: 'Your request has been submitted successfully. Our team will contact you soon.'
    });
  }
}

