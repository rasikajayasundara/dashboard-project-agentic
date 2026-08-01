import CryptoJS from "crypto-js";

const SECRET_KEY = "process.env.REACT_APP_SESSION_KEY";

export const secureStorage = () => {
  const setItem = (key, value) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      SECRET_KEY
    ).toString();

    localStorage.setItem(key, encrypted);
  };

  const getItem = (key) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};
