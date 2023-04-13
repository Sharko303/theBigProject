export const Menu = () => {
    const token = localStorage.getItem('token');
    function handleLogout() {
        localStorage.removeItem('token');
        window.location.href = '/connexion'; // Redirigez l'utilisateur vers la page de connexion après la déconnexion
      }

    return (
      <nav>
        <ul>
          <li>Accueil</li>
          {token ? (
            <li>
              <button onClick={handleLogout}>Déconnexion</button>
            </li>
          ) : (
            <li>
              <a href="/connexion">Connexion</a>
            </li>
          )}
        </ul>
      </nav>
    );
}