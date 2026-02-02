import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PricingPlan, PlanActivationRequest, PlanActivationResponse } from '../models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  private apiUrl = '/api/plans'; // Update with actual API endpoint
  private http = inject(HttpClient); // Angular 21: use inject() instead of constructor

  /**
   * Fetch all available pricing plans
   * Plan prices, features, and shipping milestones should come from BE
   */
  getPlans(): Observable<PricingPlan[]> {
    // TODO: Replace with actual API call
    // return this.http.get<PricingPlan[]>(`${this.apiUrl}`);
    
    // Mock data for now - will be replaced with BE call
    return of(this.getMockPlans());
  }

  /**
   * Get recommended plan based on past 3 months average order count
   */
  getRecommendedPlan(): Observable<PricingPlan | null> {
    // TODO: Replace with actual API call
    // return this.http.get<PricingPlan>(`${this.apiUrl}/recommended`);
    return of(null);
  }

  /**
   * Get current active plan
   */
  getCurrentPlan(): Observable<PricingPlan | null> {
    // TODO: Replace with actual API call
    // return this.http.get<PricingPlan>(`${this.apiUrl}/current`);
    return of(null);
  }

  /**
   * Activate a pricing plan
   */
  activatePlan(request: PlanActivationRequest): Observable<PlanActivationResponse> {
    // TODO: Replace with actual API call
    // return this.http.post<PlanActivationResponse>(`${this.apiUrl}/activate`, request);
    
    // Mock response
    return of({
      success: true,
      message: 'Plan activated successfully',
      billingCycleDate: '2025-01-05',
      planName: request.planId
    });
  }

  /**
   * Calculate average shipment cost for a plan based on shipment details
   * Based on courier rate card - using Delhivery Surface
   */
  calculateShipmentCost(planId: string, shipmentDetails: any): Observable<number> {
    // TODO: Replace with actual API call
    // return this.http.post<number>(`${this.apiUrl}/calculate-cost`, { planId, shipmentDetails });
    
    // Mock calculation - will be replaced with BE call
    const baseCosts: { [key: string]: number } = {
      'lite': 150,
      'business': 130,
      'advanced': 110,
      'pro': 100
    };
    return of(baseCosts[planId.toLowerCase()] || 150);
  }

  /**
   * Get plan benefits that will be lost on downgrade
   */
  getPlanBenefits(planId: string): Observable<string[]> {
    // TODO: Replace with actual API call
    // return this.http.get<string[]>(`${this.apiUrl}/${planId}/benefits`);
    
    // Mock benefits
    return of([
      'No dedicated account manager for ongoing guidance',
      'No monthly courier optimization to reduce delivery costs',
      'Standard support instead of priority issue resolution',
      'Standard shipping rates instead of lower rates from your current plan'
    ]);
  }

  /**
   * Get downgrade effective date
   */
  getDowngradeEffectiveDate(): Observable<string> {
    // TODO: Replace with actual API call
    // return this.http.get<string>(`${this.apiUrl}/downgrade-date`);
    return of('2026-01-05');
  }

  private getMockPlans(): PricingPlan[] {
    return [
      {
        id: 'lite',
        name: 'Lite',
        price: 0,
        priceDisplay: 'FREE',
        description: 'Ideal for shipping upto 5 orders monthly',
        avgShipmentCost: 150,
        features: [
          'Real time WA notification',
          'Parcel insurance',
          'Other VAS features'
        ],
        isCurrentPlan: false,
        isRecommended: false,
        shippingMilestone: 100,
        orderRange: { min: 0, max: 5 }
      },
      {
        id: 'business',
        name: 'Business',
        price: 199,
        priceDisplay: '₹199/month',
        description: 'Ideal for shipping upto 5-50 orders monthly',
        avgShipmentCost: 130,
        features: [
          'Dedicated account manager',
          'Onboarding support',
          'Monthly courier optimization'
        ],
        isCurrentPlan: false,
        isRecommended: false,
        shippingMilestone: 100,
        orderRange: { min: 5, max: 50 }
      },
      {
        id: 'advanced',
        name: 'Advanced',
        price: 499,
        priceDisplay: '₹499/month',
        description: 'Ideal for shipping upto 50-200 orders monthly',
        avgShipmentCost: 110,
        features: [
          'Dedicated account manager',
          'Onboarding support',
          'Monthly courier optimization',
          'Prior customer service'
        ],
        isCurrentPlan: false,
        isRecommended: true,
        shippingMilestone: 500,
        orderRange: { min: 50, max: 200 }
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 799,
        priceDisplay: '₹799/month',
        description: 'Ideal for shipping upto 3000-10,000 orders monthly',
        avgShipmentCost: 100,
        features: [
          'Dedicated account manager',
          'Onboarding support',
          'Monthly courier optimization',
          'Prior customer service'
        ],
        isCurrentPlan: true,
        isRecommended: false,
        nextRenewalDate: '5th Dec, 2025',
        shippingMilestone: 1000,
        orderRange: { min: 3000, max: 10000 }
      }
    ];
  }
}

