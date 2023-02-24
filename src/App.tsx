import { Suspense } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { CanvasProvider } from './stores/canvas';
import routes from '~react-pages';

function App() {
  return (
    <>
      <CanvasProvider>
        <Suspense>{useRoutes(routes)}</Suspense>
      </CanvasProvider>
    </>
  );
}

export default App;
