"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Database = use("Database");

class Property extends Model {
  static scopeNearBy(query, latitude, longitude, distance) {
    // Haversine - cálculo naval de distância através de long. e lat. Valor multiplicado por 6371 para parsear em KM
    const haversine = `(6371 * acos(cos(radians(${latitude}))
    * cos(radians(latitude))
    * cos(radians(longitude)
    - radians(${longitude}))
    + sin(radians(${latitude}))
    * sin(radians(latitude))))`;
    return query
      .select("*", Database.raw(`${haversine} as distance`))
      .whereRaw(`${haversine} < ${distance}`);
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  images() {
    return this.hasMany("App/Models/Image");
  }
}

module.exports = Property;
