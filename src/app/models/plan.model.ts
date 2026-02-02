export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceDisplay: string; // e.g., "FREE" or "₹199/month"
  description: string; // e.g., "Ideal for shipping upto 5 orders monthly"
  avgShipmentCost: number;
  features: string[];
  isCurrentPlan: boolean;
  isRecommended: boolean;
  nextRenewalDate?: string;
  shippingMilestone?: number; // e.g., 100, 500, 1000 for plan fee refund
  orderRange: {
    min: number;
    max: number;
  };
}

export interface ShipmentDetails {
  weight: '500g' | '1kg' | '2kg';
  mode: 'Surface' | 'Air';
  payment: 'Prepaid' | 'COD';
  pickupPincode: string;
  deliveryPincode: string;
  orderValue?: number;
}

export interface PlanActivationRequest {
  planId: string;
  shipmentDetails?: ShipmentDetails;
}

export interface PlanActivationResponse {
  success: boolean;
  message: string;
  billingCycleDate?: string;
  planName?: string;
}

export interface ContactSalesForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  websiteUrl?: string;
  monthlyShipmentVolume?: string;
  currentShippingProvider?: string;
  specificRequirements?: string;
}

export interface PlanBenefits {
  title: string;
  description: string;
}

