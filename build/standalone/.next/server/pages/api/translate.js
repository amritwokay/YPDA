"use strict";
(() => {
var exports = {};
exports.id = 95;
exports.ids = [95];
exports.modules = {

/***/ 2134:
/***/ ((module) => {

module.exports = import("isomorphic-unfetch");;

/***/ }),

/***/ 1241:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _src_translateToSQL__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3354);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_src_translateToSQL__WEBPACK_IMPORTED_MODULE_0__]);
_src_translateToSQL__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined in .env file. Please add it there (see README.md for more details).");
}
async function handler(req, res) {
    const { inputText, tableSchema } = req.body;
    try {
        const result = await (0,_src_translateToSQL__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(inputText, process.env.OPENAI_API_KEY, tableSchema);
        // console.log(res);
        res.status(200).json({
            outputText: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error translating to SQL"
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3354:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var isomorphic_unfetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2134);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([isomorphic_unfetch__WEBPACK_IMPORTED_MODULE_0__]);
isomorphic_unfetch__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

const translateToSQL = async (query, apiKey, tableSchema = "")=>{
    const prompt = `Translate this natural language query into SQL without changing the case of the entries given by me:\n\n"${query}"\n\n${tableSchema ? `Use this table schema:\n\n${tableSchema}\n\n` : ""}SQL Query:`;
    console.log(prompt);
    const response = await (0,isomorphic_unfetch__WEBPACK_IMPORTED_MODULE_0__["default"])("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt,
            temperature: 0.5,
            max_tokens: 2048,
            n: 1,
            stop: "\\n",
            model: "text-davinci-003",
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            logprobs: 10
        })
    });
    const data = await response.json();
    if (!response.ok) {
        console.log(response);
        throw new Error(data.error || "Error translating to SQL.");
    }
    return data.choices[0].text.trim();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (translateToSQL);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(1241));
module.exports = __webpack_exports__;

})();