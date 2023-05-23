export function getCookieValue(cookieName) {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }

  return null;
}