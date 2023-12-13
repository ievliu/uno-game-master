import { Router } from "express";

import AssetController from "@/Controllers/AssetController";
import GameController from "@/Controllers/GameController";
import CardController from "@/Controllers/CardController";
import DetailedGameController from "./Controllers/DetailedGameController";

const routes = Router();

routes.use("/assets", AssetController.getAsset);

routes.get("/games", GameController.getGameList);

routes.get("/games/:gameId", DetailedGameController.processRequest);

routes.get("/cards", CardController.processRequest);

export default routes;
