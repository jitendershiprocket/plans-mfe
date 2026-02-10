import { Component, inject, OnInit } from '@angular/core';
import { PricingPlan } from '../models/plan.model';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-plan-activation-success-modal',
  imports: [], // No imports needed - using built-in control flow
  templateUrl: './plan-activation-success-modal.html',
  styleUrl: './plan-activation-success-modal.scss',
})
export class PlanActivationSuccessModal implements OnInit {
  private modalService = inject(ModalService);
  private route = inject(Router);
  plan?: PricingPlan;
  billingCycleDate?: string;

  ngOnInit(): void {
    // Get data from injected properties
    if ((this as any).plan) {
      this.plan = (this as any).plan;
    }
    if ((this as any).billingCycleDate) {
      this.billingCycleDate = (this as any).billingCycleDate;
    }
  }

  onContactAccountManager(): void {
    console.log('Contact account manager');
    this.modalService.close();
    this.route.navigateByUrl('/seller/user-profile');
    
    // window.location.href = '/user-profile';
    
  }

  onStartShipping(): void {
    this.modalService.close();
    this.route.navigateByUrl('/seller/orders/new');
    // window.location.href = '/orders/new';
  }
}
