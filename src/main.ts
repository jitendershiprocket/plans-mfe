import { bootstrapApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Router } from '@angular/router';

console.log('🚀 plans-mfe: Starting bootstrap...');

bootstrapApplication(App, appConfig)
  .then(async (appRef) => {
    console.log('✅ plans-mfe: Application bootstrapped, initializing router...');
    
    try {
      // Wait for router to initialize and navigate to default route
      const router = appRef.injector.get(Router);
      // For microfrontend, navigate to empty path (default route) without changing browser URL
      await router.navigate([''], { 
        skipLocationChange: true,
        replaceUrl: true 
      });
      console.log('✅ plans-mfe: Router initialized and navigated to default route');
    } catch (routerError) {
      console.warn('⚠️ plans-mfe: Router initialization warning:', routerError);
      // Try to navigate anyway
      try {
        const router = appRef.injector.get(Router);
        await router.navigate([''], { skipLocationChange: true });
      } catch (e) {
        console.warn('⚠️ plans-mfe: Could not navigate to default route:', e);
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
