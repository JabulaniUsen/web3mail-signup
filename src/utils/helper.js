class BaseHelper {
  addToLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  deleteFromLocalStorage(key) {
    window.localStorage.removeItem(key);
  }
}

const baseHelper = new BaseHelper();
export default baseHelper;
