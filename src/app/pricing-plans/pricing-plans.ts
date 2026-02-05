import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlansService } from '../services/plans.service';
import { PricingPlan, ShipmentDetails } from '../models/plan.model';
import { EditSampleShipmentModal } from '../edit-sample-shipment-modal/edit-sample-shipment-modal';
import { PlanActivationSuccessModal } from '../plan-activation-success-modal/plan-activation-success-modal';
import { DowngradeConfirmationModal } from '../downgrade-confirmation-modal/downgrade-confirmation-modal';
import { ContactSalesFormModal } from '../contact-sales-form-modal/contact-sales-form-modal';
import { ZeroMonthlyFeeOfferModal } from '../zero-monthly-fee-offer-modal/zero-monthly-fee-offer-modal';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-pricing-plans',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pricing-plans.html',
  styleUrl: './pricing-plans.scss',
})
export class PricingPlans implements OnInit {
  private plansService = inject(PlansService);
  private modalService = inject(ModalService);

  // Using signals for reactive state - Angular 21 feature
  plans = signal<PricingPlan[]>([]);
  loading = signal(false);
  shipmentDetails = signal<ShipmentDetails>({
    weight: '500g',
    mode: 'Surface',
    payment: 'Prepaid',
    pickupPincode: '110001',
    deliveryPincode: '400059',
    orderValue: 1000
  });

  // Computed signals for derived state - more efficient
  currentPlan = computed(() => this.plans().find(p => p.isCurrentPlan) || null);
  recommendedPlan = computed(() => this.plans().find(p => p.isRecommended) || null);
  shipmentDetailsDisplay = computed(() => {
    const details = this.shipmentDetails();
    return `${details.weight} • ${details.mode} Mode • ${details.payment} • ${details.pickupPincode} → ${details.deliveryPincode}`;
  });

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    this.plansService.getPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading plans:', error);
        this.loading.set(false);
      }
    });
  }

  openEditShipmentModal(): void {
    this.modalService.open(EditSampleShipmentModal, {
      shipmentDetails: { ...this.shipmentDetails() }
    }, '500px').subscribe((result) => {
      if (result) {
        // Temporary state - not stored, just for calculation
        this.shipmentDetails.set(result);
        this.recalculateCosts();
      }
    });
  }

  recalculateCosts(): void {
    // Recalculate average shipment costs for all plans
    const currentDetails = this.shipmentDetails();
    this.plans().forEach(plan => {
      this.plansService.calculateShipmentCost(plan.id, currentDetails).subscribe({
        next: (cost) => {
          // Update plan in signal
          const updatedPlans = this.plans().map(p => 
            p.id === plan.id ? { ...p, avgShipmentCost: cost } : p
          );
          this.plans.set(updatedPlans);
        }
      });
    });
  }

  activatePlan(plan: PricingPlan): void {
    // Check if downgrading
    const current = this.currentPlan();
    if (current && this.isDowngrade(current, plan)) {
      this.openDowngradeConfirmation(plan);
    } else {
      this.confirmActivation(plan);
    }
  }

  isDowngrade(currentPlan: PricingPlan, newPlan: PricingPlan): boolean {
    // Compare plan tiers - lower price means downgrade
    return newPlan.price < currentPlan.price;
  }

  openDowngradeConfirmation(plan: PricingPlan): void {
    const current = this.currentPlan();
    if (!current) return;

    this.plansService.getPlanBenefits(current.id).subscribe({
      next: (benefits) => {
        this.plansService.getDowngradeEffectiveDate().subscribe({
          next: (effectiveDate) => {
            this.modalService.open(DowngradeConfirmationModal, {
              targetPlan: plan,
              currentPlan: current,
              benefits: benefits,
              effectiveDate: effectiveDate
            }, '600px').subscribe((confirmed) => {
              if (confirmed) {
                this.confirmActivation(plan);
              }
            });
          }
        });
      }
    });
  }

  confirmActivation(plan: PricingPlan): void {
    this.loading.set(true);
    this.plansService.activatePlan({
      planId: plan.id,
      shipmentDetails: this.shipmentDetails()
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          this.openActivationSuccessModal(plan, response);
          this.loadPlans(); // Reload to get updated current plan
        }
      },
      error: (error) => {
        console.error('Error activating plan:', error);
        this.loading.set(false);
      }
    });
  }

  openActivationSuccessModal(plan: PricingPlan, response: any): void {
    this.modalService.open(PlanActivationSuccessModal, {
      plan: plan,
      billingCycleDate: response.billingCycleDate
    }, '600px');
  }

  openContactSalesModal(): void {
    this.modalService.open(ContactSalesFormModal, undefined, '600px');
  }

  openZeroFeeOfferModal(milestone: number): void {
    this.modalService.open(ZeroMonthlyFeeOfferModal, { milestone }, '500px');
  }

  viewRateCard(plan: PricingPlan): void {
    // TODO: Implement rate card view
    console.log('View rate card for:', plan.name);
  }
}
