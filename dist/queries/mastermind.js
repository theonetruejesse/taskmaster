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
exports.addToMM = exports.getMMPage = exports.getUpdatedMMState = void 0;
const constants_1 = require("../constants");
const Status_1 = require("../properties/Status");
const Generated_1 = require("../properties/Generated");
const dates_1 = require("../utils/dates");
const getUpdatedMMState = (genesis, cloneState) => {
    const props = genesis.properties;
    let title = "ERROR";
    if (props.Name.type == "title" && props.Name.title) {
        title = props.Name.title[0]["plain_text"];
    }
    return {
        Name: `${cloneState.Streak} - ${title}`,
        Date: (0, dates_1.getNewDays)(constants_1.week, cloneState.DayNames),
        Generated: Generated_1.IS_GENERATED,
        Status: Status_1.SOON_STATUS,
        OtherProps: props,
    };
};
exports.getUpdatedMMState = getUpdatedMMState;
const getMMPage = (pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield constants_1.notion.pages
        .retrieve({ page_id: pageId })
        .catch((err) => {
        throw err;
    });
    return response;
});
exports.getMMPage = getMMPage;
const addToMM = (mmState) => __awaiter(void 0, void 0, void 0, function* () {
    const newDates = mmState.Date.End
        ? {
            start: mmState.Date.Start,
            end: mmState.Date.End,
        }
        : {
            start: mmState.Date.Start,
        };
    const response = yield constants_1.notion.pages
        .create({
        parent: {
            type: "database_id",
            database_id: process.env.DATABASE_ID_MM,
        },
        properties: Object.assign(Object.assign({}, mmState.OtherProps), { Name: {
                title: [
                    {
                        text: {
                            content: mmState.Name,
                        },
                    },
                ],
            }, Generated: mmState.Generated, Status: mmState.Status, Date: {
                date: newDates,
            } }),
    })
        .catch((err) => {
        throw err;
    });
    return response;
});
exports.addToMM = addToMM;
