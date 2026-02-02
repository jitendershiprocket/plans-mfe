import { Component, inject, OnInit } from '@angular/core';
import { PricingPlan } from '../models/plan.model';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-plan-activation-success-modal',
  imports: [], // No imports needed - using built-in control flow
  templateUrl: './plan-activation-success-modal.html',
  styleUrl: './plan-activation-success-modal.scss',
})
export class PlanActivationSuccessModal implements OnInit {
  private modalService = inject(ModalService);

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
  }

  onStartShipping(): void {
    this.modalService.close();
  }
}
