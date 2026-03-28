import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Rediriger vers la page de connexion, mais enregistrer l'emplacement actuel
        return <Navigate to="/connexion" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Rediriger vers le dashboard approprié si le rôle n'est pas autorisé
        const redirectPath = role === 'admin' ? '/admin' :
            role === 'artisan' ? '/dashboard/artisan' :
                role === 'particulier' ? '/dashboard/particulier' :
                    '/dashboard/particulier';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
