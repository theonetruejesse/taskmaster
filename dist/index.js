"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const clone_1 = require("./queries/clone");
require("dotenv-safe/config");
const client_1 = require("@notionhq/client");
const mastermind_1 = require("./queries/mastermind");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.set("proxy", 1);
        app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        }));
        app.get("/clone", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, clone_1.getActiveClones)();
            for (const page of response.results) {
                if ((0, client_1.isFullPage)(page)) {
                    const cloneState = (0, clone_1.getUpdatedCloneState)(page);
                    // updateClone(cloneState);
                    if (!cloneState.GenesisId)
                        throw "no genesis id found";
                    const genesis = yield (0, mastermind_1.getMMPage)(cloneState.GenesisId);
                    if (!(0, client_1.isFullPage)(genesis))
                        throw "genesis is not a full page";
                    // const mmState = getUpdatedMMState(genesis, cloneState);
                    // addToMM(mmState);
                }
            }
            console.log(process.env.NOTION_TOKEN);
            res.send(response);
        }));
        app.listen(parseInt(process.env.PORT), () => {
            console.log("\nlistening to port:", process.env.PORT);
        });
    });
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
