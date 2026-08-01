// src/utils/navigation.js
let navigator;

export function setNavigator(navigateFn) {
  navigator = navigateFn;
}

export function navigate(path, options = {}) {
  if (navigator) {
    navigator(path, options);
  } else {
    console.error("Navigator is not set");
  }
}
