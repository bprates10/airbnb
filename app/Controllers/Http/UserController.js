"use strict";

const User = use("App/Models/User");

class UserController {
  async create({ request }) {
    const data = request.only(["username", "email", "password"]);
    const user = await User.create(data);
    return user;
  }

  async index({ params }) {
    const user = await User.findOrFail(params.id);
    return user;
  }

  async show() {
    const user = User.all();

    return user;
  }
}

module.exports = UserController;
