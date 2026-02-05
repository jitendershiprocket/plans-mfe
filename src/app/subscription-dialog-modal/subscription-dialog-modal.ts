import { Component, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

import { ModalService } from '../services/modal.service';
import { PricingPlan } from '../models/plan.model';
import { AuthService } from '../services/auth.service';
import { API_BASE_URL } from '../config/api.config';

type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed' | 'timeout';

@Component({
  selector: 'app-subscription-dialog-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-dialog-modal.html',
  styleUrl: './subscription-dialog-modal.scss',
})
export class SubscriptionDialogModal implements OnDestroy {
  private modalService = inject(ModalService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // These will be assigned by ModalHostComponent via modal data
  plan?: PricingPlan;

  // Result consumed by PricingPlans
  result: 'upgrade' | 'cancel' | undefined;

  // Payment / mandate state (mirrors SR_Web flow)
  qrCode: string | null = null;
  paymentStatus: PaymentStatus = 'idle';
  paymentId: number | null = null;
  timeRemaining = 120; // seconds
  private timerIntervalId: any;
  private pollingSub?: Subscription;

  // Mandate meta
  merchantVpa = '';
  transactionNote = '';
  merchantName = '';
  fromDate = '';
  toDate = '';
  revokableByCustomer = true;
  frequency = '';
  mandateAmount?: number;
  currency?: string;
  shortLink?: string;

  // Thank-you & redirect after success
  showThankYou = false;
  countdownSeconds = 5;
  private redirectTimerId: any;

  ngOnDestroy(): void {
    this.stopPaymentPolling();
    if (this.redirectTimerId) {
      clearInterval(this.redirectTimerId);
    }
  }

  /**
   * Primary CTA from UI.
   * First click → initiate mandate and show QR.
   * On timeout → user can click again to retry.
   */
  onUpgrade(): void {
    if (this.paymentStatus === 'pending' || this.paymentStatus === 'success') {
      // Already in progress / done.
      return;
    }

    this.initiateMandate();
  }

  onContinueWithCurrent(): void {
    this.result = 'cancel';
    this.modalService.close(this.result);
  }

  /**
   * Call backend to initiate mandate and fetch QR (similar to SR_Web SubscriptionDialogComponent).
   */
  private initiateMandate(): void {
    const productId = this.plan?.id;
    if (!productId) {
      console.error('Missing productId on plan; cannot initiate mandate.', this.plan);
      return;
    }

    const payload = {
      is_web: 1,
      product_id: productId,
      product_type: 1,
    };

    const headers = this.authService.getAuthHeaders();

    this.http.post<any>(`${API_BASE_URL}setu/initiate-mandate`, payload, { headers }).subscribe({
      next: (response) => {
        const data = response?.data;
        if (!data) {
          console.error('Failed to initiate mandate, missing data:', response);
          return;
        }

        this.qrCode = data.qr_code || null;
        this.paymentId = data.id ?? null;
        this.paymentStatus = 'pending';

        // Timer: use expire_after minutes from API if present, else default 2 minutes.
        const expireMinutes = typeof data.expire_after === 'number' ? data.expire_after : 2;
        this.timeRemaining = expireMinutes * 60;

        this.merchantVpa = data.merchant_vpa || '';
        this.transactionNote = data.transaction_note || '';
        this.merchantName = 'Bigfoot Retail UPI Setu';
        this.mandateAmount = typeof data.amount === 'number' ? data.amount : undefined;
        this.currency = data.currency || 'INR';
        this.shortLink = data.short_link || '';
        this.fromDate = this.formatDate(data.start_date);
        this.toDate = this.formatDate(data.end_date);
        this.frequency = (data.frequency || 'MONTHLY').toString().toUpperCase();
        this.revokableByCustomer = true;

        this.startPaymentTimer();
        this.startPaymentPolling();

        // Ensure view updates immediately even when using fetch/zoneless HTTP
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error initiating mandate:', error);
      },
    });
  }

  private startPaymentTimer(): void {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }

    this.timerIntervalId = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerIntervalId);
        this.paymentStatus = 'timeout';
        this.stopPaymentPolling();
      }
      // Manually trigger change detection so the UI timer updates every second
      this.cdr.detectChanges();
    }, 1000);
  }

  private startPaymentPolling(): void {
    if (!this.paymentId) return;

    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }

    this.pollingSub = interval(3000).subscribe(() => {
      this.checkPaymentStatus();
    });
  }

  private stopPaymentPolling(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = undefined;
    }
  }

  private checkPaymentStatus(): void {
    if (!this.paymentId) return;

    const headers = this.authService.getAuthHeaders();

    this.http
      .get<any>(`${API_BASE_URL}setu/payment-status/${this.paymentId}`, { headers })
      .subscribe({
        next: (res) => {
          if (res?.payment_status) {
            this.paymentStatus = 'success';
            this.stopPaymentPolling();
            this.showThankYou = true;
            this.startRedirectCountdown();
          }
        },
        error: (err) => {
          console.error('Error checking payment status:', err);
        },
      });
  }

  private startRedirectCountdown(): void {
    if (this.redirectTimerId) {
      clearInterval(this.redirectTimerId);
    }

    this.countdownSeconds = 5;

    this.redirectTimerId = setInterval(() => {
      this.countdownSeconds--;
      if (this.countdownSeconds <= 0) {
        clearInterval(this.redirectTimerId);
        this.redirectTimerId = undefined;
        // Inform parent (PricingPlans) that payment succeeded → proceed with activation.
        this.result = 'upgrade';
        this.modalService.close(this.result);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userJson = window.localStorage.getItem('ngStorage-USER');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }
}
