# Plans Microfrontend (plans-mfe)

Angular 21 microfrontend for pricing plans management.

## Project Structure

```
src/app/
├── models/
│   └── plan.model.ts              # Interfaces for plans, shipment details, etc.
├── services/
│   ├── plans.service.ts           # Plans API service
│   └── contact-sales.service.ts   # Contact sales form service
├── pricing-plans/                 # Main pricing plans component
├── edit-sample-shipment-modal/    # Edit shipment details modal
├── plan-activation-success-modal/  # Success modal after plan activation
├── downgrade-confirmation-modal/   # Confirmation modal for downgrades
├── contact-sales-form-modal/       # Contact sales form modal
└── zero-monthly-fee-offer-modal/  # Zero fee offer details modal
```

## Features

### Main Pricing Plans Page
- Display all available pricing plans (Lite, Business, Advanced, Pro)
- Show current plan and recommended plan badges
- Sample shipment details section with edit functionality
- Plan activation with downgrade confirmation
- Contact sales for large businesses

### Modals
1. **Edit Sample Shipment Modal**: Edit shipment details (weight, mode, payment, pincodes)
2. **Plan Activation Success Modal**: Success message after plan activation
3. **Downgrade Confirmation Modal**: Warning when downgrading plans
4. **Contact Sales Form Modal**: Enterprise lead form
5. **Zero Monthly Fee Offer Modal**: Details about shipping milestone offers

## Key Implementation Notes

### Backend Integration Points
- Plan prices should come from BE (not hardcoded)
- Plan features should be driven by BE
- Shipping milestones (100, 500, 1000) should be variables from BE
- Recommended plan based on past 3 months average order count
- Average shipment cost based on courier rate card (Delhivery Surface)

### Frontend Hardcoded
- Zero Monthly Fee Offer modal content (as per requirements)
- Downgrade confirmation modal text (hardcoded in FE)

### Temporary State
- Edit Sample Shipment modal values are temporary and not stored
- Values reset to defaults on refresh or new session

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Angular Version
- Angular 21.1.0
- Standalone components
- No ESLint/Prettier (removed for performance)
