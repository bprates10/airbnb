"use strict";

const Property = use("App/Models/Property");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PropertyController {
  /**
   * Recebe a latitude e longitude do front-end para executar a busca
   * Retorna apenas os imóveis em acordo com a scope query (geolocalização)
   * GET properties
   */
  async index({ request }) {
    const { latitude, longitude } = request.all();

    const properties = Property.query()
      .nearBy(latitude, longitude, 10)
      .fetch();
    return properties;
  }

  /**
   * Create/save a new property.
   * POST properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Exibe o imóvel de acordo com o ID
   * GET properties/:id
   */
  async show({ params }) {
    const property = await Property.findOrFail(params.id);
    // Carrega o relacionamento do model (no caso, com images)
    await property.load("images");
    return property;
  }

  /**
   * Update property details.
   * PUT or PATCH properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Exclui um imóvel de acordo com o ID
   * DELETE properties/:id
   */
  async destroy({ params, auth, response }) {
    const property = await Property.findOrFail(params.id);

    // Verifica se o ID do usuário é o mesmo ID do dono do imóvel
    if (property.user_id != auth.user.id) {
      return response.status(401).send({ eerror: "Not Authorized !" });
    }

    await property.delete();
  }
}

module.exports = PropertyController;
