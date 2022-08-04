import { View } from "./view.js";
import { Model } from "./model.js";
import { Controller } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new View(), new Model());
});