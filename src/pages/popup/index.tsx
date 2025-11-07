import { createRoot } from 'react-dom/client';
import { PopupPage } from './PopupPage';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Popup root element not found');
}

const root = createRoot(container);

root.render(<PopupPage />);

