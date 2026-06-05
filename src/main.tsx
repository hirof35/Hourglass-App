import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RealSandHourglass from './RealSandHourglass';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RealSandHourglass />
  </StrictMode>,
)
