import { createRoot } from 'react-dom/client';

import './globals.css';

import Home from './pages';

const root = createRoot(document.querySelector('#app')!);

root.render(<Home />);
