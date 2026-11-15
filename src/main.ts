import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Registrar componentes de Chart.js (bar, pie, title, tooltip, etc.)
import './app/utils/chart-config';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
