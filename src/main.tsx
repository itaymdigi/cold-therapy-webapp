import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { ConvexProvider } from './providers/ConvexProvider'

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <React.StrictMode>
      <ConvexProvider>
        <App />
      </ConvexProvider>
    </React.StrictMode>
   </ErrorBoundary>
)
