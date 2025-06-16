import { jwtDecode  } from 'jwt-decode'; // ✅ Correct


class AuthToken {
  // Set authToken in localStorage
  static setToken(token) {
    localStorage.setItem("authToken", token);
  }

  // Get authToken from localStorage
  static getToken() {
    return localStorage.getItem("authToken");
  }

  // Decode the token
  static decodeToken() {
    const token = AuthToken.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error.message);
      return null;
    }
  }

  // Validate token structure and required fields
  static isValidToken() {
    const decoded = AuthToken.decodeToken();

    if (!decoded || !decoded.userDetails) return false;

    const user = decoded.userDetails;

    return (
      user.id &&
      user.name &&
      user.email
    );
  }

  // Get user email from token
  static getEmail() {
    const decoded = AuthToken.decodeToken();
    return decoded?.userDetails?.email || null;
  }

  static getUserName() {
    const decoded = AuthToken.decodeToken();
    return decoded?.userDetails?.name || null;
  }

  // Clear token from localStorage
  static clearToken() {
    localStorage.removeItem("authToken");
  }
}

export default AuthToken;