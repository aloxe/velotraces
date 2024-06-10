import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import './index.css'

// Configure nested routes with JSX
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path="/:first?/:second?"
        element={<App />}
        loader={({ params }) => {
          return {
            country: params.country || '',
            year: params.year || ''
          }
        }}
      />
      <Route
        path="/t/:track?"
        element={<App />}
        loader={({ params }) => {
          return {
            track: params.track
          }
        }}
      />
      <Route
        path="/u/:setting"
        element={<App />}
        loader={({ params }) => {
          return {
            setting: params.setting
          }
        }}
      />
    </Route>
  ),
  { basename: import.meta.env.VITE_BASE_URL }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
