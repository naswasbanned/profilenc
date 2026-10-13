import { lazy, Suspense } from 'react';

// The only editor module upload sites import: react-easy-crop, the editor CSS
// and the canvas export code all stay in the lazy ImageEditor chunk.
const ImageEditor = lazy(() => import('./ImageEditor'));

export default function LazyImageEditor(props) {
  return (
    <Suspense fallback={null}>
      <ImageEditor {...props} />
    </Suspense>
  );
}
