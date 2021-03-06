"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("/users", "UserController.create");
Route.get("/users/:id", "UserController.index");
Route.get("/find", "UserController.show");
Route.post("/sessions", "SessionController.create");
// Cria todas as rotas de properties
Route.resource("properties", "PropertyController")
  // Ignora as rotas de create e edit
  .apiOnly()
  // Garante que apenas usuários autenticados acessarão a rota
  .middleware("auth");
Route.post("properties/:id/images", "ImageController.store").middleware("auth");
Route.get("images/:path", "ImageController.show");
