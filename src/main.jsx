import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'

import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

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
    </Route>
  )
);


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter basename="/app">
//      <Routes>
//       <Route
//           path="/:first?/:second?"
//           element={<App />}
//           loader={({ params }) => {
//             return {
//               country: params.country || '',
//               year: params.year || ''
//             }
//           }}
//         />
//         <Route
//             path="/t/:track?"
//             element={<App />}
//             loader={({ params }) => {
//               return {
//                 track: params.track
//               }
//             }}
//         />
//         <Route path="/" element={<App />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>,
// )

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
