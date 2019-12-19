"use strict";

const Helpers = use("Helpers");
const Image = use("App/Models/Image");
const Property = use("App/Models/Property");

class ImageController {
  async store({ params, request }) {
    const property = await Property.findOrFail(params.id);

    // Request.File retorna uma ou mais imagens
    // com o nome do primeiro parâmetro (opcional)
    // e o tamanho máximo do segundo parâmetro (opcional)
    const images = request.file("image", {
      types: ["image"],
      size: "2mb"
    });
    // Movendo todas as imagens para a pasta tmp/uploads
    // alterando o nome para dateNow-nomedoarquivo
    await images.moveAll(Helpers.tmpPath("upload"), file => ({
      name: `${Date.now()}-${file.clientName}`
    }));

    if (!images.movedAll()) {
      return images.errors();
    }

    // Percorremos as imagens salvas e cadastrando no imóvel
    // através do método images() na model de imóveis
    // que é o relacionamento entre as tabelas imovel e imagens
    await Promise.all(
      images
        .movedList()
        .map(image => property.images().create({ path: image.fileName }))
    );
  }

  async show({ params, response }) {
    return response.download(Helpers.tmpPath(`upload/${params.path}`));
  }
}

module.exports = ImageController;
