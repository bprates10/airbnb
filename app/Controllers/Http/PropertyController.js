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
      .with("images")
      .nearBy(latitude, longitude, 10)
      .fetch();
    return properties;
  }

  /**
   * Create/save a new property.
   * POST properties
   */
  async store({ auth, request, response }) {
    // Get ID usuário logado
    const { id } = auth.user;

    // Campos do imóvel
    const data = request.only([
      "title",
      "address",
      "latitude",
      "longitude",
      "price"
    ]);

    const property = await Property.create({ ...data, user_id: id });

    return property;
  }

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
   */
  async update({ params, request, response }) {
    // return "1";
    const property = await Property.findOrFail(params.id);

    const data = request.only([
      "title",
      "address",
      "latitude",
      "longitude",
      "price"
    ]);

    property.merge(data);

    await property.save();

    return property;
  }

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
