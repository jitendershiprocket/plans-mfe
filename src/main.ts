import { bootstrapApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Router } from '@angular/router';

console.log('🚀 plans-mfe: Starting bootstrap...');

bootstrapApplication(App, appConfig)
  .then(async (appRef) => {
    console.log('✅ plans-mfe: Application bootstrapped, initializing router...');
    
    const router = appRef.injector.get(Router);
    
    // Force navigation to empty path before creating custom element
    // This ensures router-outlet resolves correctly when the element renders
    try {
      console.log('🔄 plans-mfe: Navigating to default route...');
      const navigationResult = await router.navigate([''], { 
        skipLocationChange: true,
        replaceUrl: false
      });
      
      if (navigationResult === true) {
        console.log('✅ plans-mfe: Router navigated to default route successfully');
      } else {
        console.warn('⚠️ plans-mfe: Router navigation returned false');
      }
      
      // Wait a tick to ensure router state is fully updated
      await new Promise(resolve => setTimeout(resolve, 0));
      
    } catch (routerError: any) {
      console.error('❌ plans-mfe: Router navigation error:', routerError);
      // If navigation fails, try to reset router state
      try {
        await router.navigateByUrl('/', { skipLocationChange: true, replaceUrl: false });
        console.log('✅ plans-mfe: Router reset to root');
      } catch (e) {
        console.error('❌ plans-mfe: Could not reset router:', e);
      }
    }
    
    console.log('✅ plans-mfe: Creating custom element...');
    const PlansElement = createCustomElement(App, { injector: appRef.injector });

    if (!customElements.get('plans-mfe-root')) {
      customElements.define('plans-mfe-root', PlansElement);
      console.log('✅ plans-mfe: <plans-mfe-root> custom element registered successfully');
      
      // Dispatch custom event to notify shell that element is ready
      window.dispatchEvent(new CustomEvent('plans-mfe-ready'));
    } else {
      console.log('ℹ️ plans-mfe: <plans-mfe-root> already registered');
      window.dispatchEvent(new CustomEvent('plans-mfe-ready'));
    }
  })
  .catch((err) => {
    console.error('❌ plans-mfe: Error bootstrapping custom element:', err);
    if (err.stack) {
      console.error('Stack trace:', err.stack);
    }
    window.dispatchEvent(new CustomEvent('plans-mfe-error', { detail: err }));
  });
