"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Env = use("Env");

class Image extends Model {
  // Criando campo virtual para retornar caminho da imagem
  static get computed() {
    return ["url"];
  }

  getUrl({ path }) {
    return `${Env.get("APP_URL")}/tmp/upload/${path}`;
  }
}

module.exports = Image;
