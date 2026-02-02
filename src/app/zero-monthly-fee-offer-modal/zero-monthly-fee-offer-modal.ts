import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-zero-monthly-fee-offer-modal',
  imports: [], // No imports needed - using built-in control flow
  templateUrl: './zero-monthly-fee-offer-modal.html',
  styleUrl: './zero-monthly-fee-offer-modal.scss',
})
export class ZeroMonthlyFeeOfferModal implements OnInit {
  private modalService = inject(ModalService);

  milestone?: number;

  ngOnInit(): void {
    // Get data from injected properties
    if ((this as any).milestone) {
      this.milestone = (this as any).milestone;
    }
  }

  onClose(): void {
    this.modalService.close();
  }
}
