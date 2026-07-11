import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider  } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Home from './pages/Home.jsx'
import PokemonInfo from './pages/PokemonInfo.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: "/", 
        element: <Home />
      },
      {
        path: "/pokemon/:id", 
        element: <PokemonInfo />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)