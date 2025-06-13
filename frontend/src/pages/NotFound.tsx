import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold">Página no encontrada</h2>
        <p className="text-muted-foreground">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
