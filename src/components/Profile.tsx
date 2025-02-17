import React from 'react';
import { useAuth } from './AuthContext';

const Profile: React.FC = () => {
  const { username, logout } = useAuth();

  return (
    <div>
      <h2>Perfil</h2>
      {username ? (
        <>
          <p>Bienvenido, {username}!</p>
          <button onClick={logout} className="btn btn-primary">Cerrar Sesión</button>
        </>
      ) : (
        <p>No estás autenticado.</p>
      )}
    </div>
  );
};

export default Profile;