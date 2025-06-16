export const validateEmail = (email) => {
    email = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
};

/*

The password must:
Be at least 8 characters long.
Contain at least one lowercase letter.
Contain at least one uppercase letter.
Contain at least one digit (0-9).
Contain at least one special character (@$!%*?&# or similar).

*/