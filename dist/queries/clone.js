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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClone = exports.getActiveClones = exports.getUpdatedCloneState = void 0;
const constants_1 = require("../constants");
const getUpdatedCloneState = (page) => {
    const props = page.properties;
    const isActive = props.Active.type == "checkbox" && props.Active.checkbox;
    let state = -1;
    if (props.State.type == "number") {
        state = props.State.number ? props.State.number : 0;
    }
    // todo -> add in date logic for determining streak
    let streak = -1;
    if (props.Streak.type == "number") {
        streak = props.Streak.number ? props.Streak.number : 0;
    }
    let genesisId = null;
    if (props.Genesis.type == "relation") {
        genesisId =
            props.Genesis.relation.length == 1 ? props.Genesis.relation[0].id : null;
    }
    return {
        Active: isActive,
        State: state + 1,
        Streak: streak + 1,
        PageId: page.id,
        GenesisId: genesisId,
    };
};
exports.getUpdatedCloneState = getUpdatedCloneState;
const getActiveClones = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.NOTION_TOKEN);
    const response = yield constants_1.notion.databases.query({
        database_id: process.env.DATABASE_ID_CLONE,
        filter: {
            property: "Active",
            checkbox: {
                equals: true,
            },
        },
    });
    return response;
});
exports.getActiveClones = getActiveClones;
// enum DayOfWeek {
//   Monday = "monday",
//   Monday = "monday",
//   Monday = "monday",
//   kDouble,
//   kInt,
// }
const updateClone = (newState) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield constants_1.notion.pages
        .update({
        page_id: newState.PageId,
        properties: {
            Streak: {
                number: newState.Streak,
            },
            State: {
                number: newState.State,
            },
        },
    })
        .catch((err) => {
        throw err;
    });
    return response;
});
exports.updateClone = updateClone;
