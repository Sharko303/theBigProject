export function checkCookieAndRedirect() {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].trim().split('=');
    if (name === "Authentification") {
      // Cookie trouvé, autorise la connexion
        return;
      }
    }

    // Cookie non trouvé, redirige vers la page /login
  window.location.href = '/connexion';
}

export function delCookie() {
  // Récupérer tous les cookies
  let cookies = document.cookie.split(";");

  // Parcourir tous les cookies et les supprimer un par un
  for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  // Rediriger l'utilisateur vers la page de connexion
  window.location.href = '/connexion';
}