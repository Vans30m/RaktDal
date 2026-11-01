/**
 * RaktDal Main Homepage Script
 */
import { updateNavAuth } from "./api.js";

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Check and display user session in navbar
updateNavAuth();
