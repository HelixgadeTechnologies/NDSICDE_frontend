module.exports = {

"[project]/components/tab-component.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TabComponent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
function TabComponent({ data, renderContent }) {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const handleTabChange = (index)=>{
        setActiveTab(index);
    // onTabChange?.(index);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg overflow-x-auto",
                children: data.map((d)=>{
                    const isActive = activeTab === d.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>handleTabChange(d.id),
                        className: "relative z-10",
                        children: [
                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                layoutId: "tab",
                                className: "absolute inset-0 z-0 bg-white rounded-lg",
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/tab-component.tsx",
                                lineNumber: 38,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `relative z-10 px-6 h-10 flex items-center justify-center font-bold text-sm cursor-pointer ${isActive ? "text-[#242424]" : "text-[#7A7A7A]"}`,
                                children: d.tabName
                            }, void 0, false, {
                                fileName: "[project]/components/tab-component.tsx",
                                lineNumber: 44,
                                columnNumber: 15
                            }, this)
                        ]
                    }, d.id, true, {
                        fileName: "[project]/components/tab-component.tsx",
                        lineNumber: 36,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/tab-component.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "wait",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    },
                    transition: {
                        duration: 0.25
                    },
                    children: renderContent?.(activeTab)
                }, activeTab, false, {
                    fileName: "[project]/components/tab-component.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/tab-component.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/tab-component.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}}),
"[project]/ui/button.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Button)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@iconify/react/dist/iconify.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function Button({ content, href, onClick, isSecondary, icon }) {
    const classes = `${isSecondary ? 'bg-white text-[#D2091E] border border-[#D2091E] hover:bg-gray-100' : 'bg-[#D2091E] text-white hover:bg-[#C2071A] '} rounded-[8px] h-[50px] w-full px-5 md:px-6 leading-6 font-medium hover:cursor-pointer text-sm md:text-base block transition-colors duration-300 ${icon && 'gap-2 flex items-center justify-center'}`;
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            children: [
                icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: icon,
                    width: 20,
                    height: 20
                }, void 0, false, {
                    fileName: "[project]/ui/button.tsx",
                    lineNumber: 26,
                    columnNumber: 19
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: classes,
                    children: content
                }, void 0, false, {
                    fileName: "[project]/ui/button.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/ui/button.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: classes,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                icon: icon,
                width: 20,
                height: 20
            }, void 0, false, {
                fileName: "[project]/ui/button.tsx",
                lineNumber: 34,
                columnNumber: 17
            }, this),
            content
        ]
    }, void 0, true, {
        fileName: "[project]/ui/button.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}}),
"[project]/ui/table.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Table)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function Table({ tableData, tableHead }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {}, void 0, false, {
                fileName: "[project]/ui/table.tsx",
                lineNumber: 17,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/ui/table.tsx",
            lineNumber: 16,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/ui/table.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
}}),
"[project]/components/settings/access-control.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AccessControl)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ui/table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$elements$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__MotionHead__as__head$3e$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/elements.mjs [app-ssr] (ecmascript) <export MotionHead as head>");
"use client";
;
;
;
;
function AccessControl() {
    const headers = [
        "Role Name",
        "Permission Level",
        "Users",
        "Status",
        "Actions"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-[340px] w-full rounded-lg bg-white px-6 py-[35px] shadow-md border border-gray-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-gray-800 leading-6 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold",
                                    children: "User Roles & Permissions"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/access-control.tsx",
                                    lineNumber: 21,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-normal",
                                    children: "Manage user roles and their associated permissions"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/access-control.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/access-control.tsx",
                            lineNumber: 20,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-[228px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                content: "Add New Role",
                                icon: "cil:plus"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/access-control.tsx",
                                lineNumber: 25,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/access-control.tsx",
                            lineNumber: 24,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/access-control.tsx",
                    lineNumber: 19,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    tableHead: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$elements$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__MotionHead__as__head$3e$__["head"]
                }, void 0, false, {
                    fileName: "[project]/components/settings/access-control.tsx",
                    lineNumber: 28,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/access-control.tsx",
            lineNumber: 17,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/settings/access-control.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, this);
}
}}),
"[project]/components/settings/general-settings.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>GeneralSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function GeneralSettings() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: "general settings"
    }, void 0, false, {
        fileName: "[project]/components/settings/general-settings.tsx",
        lineNumber: 3,
        columnNumber: 9
    }, this);
}
}}),
"[project]/components/settings/settings-component.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SettingsComponent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$tab$2d$component$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/tab-component.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$access$2d$control$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/access-control.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$general$2d$settings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/general-settings.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function SettingsComponent() {
    const tabs = [
        {
            tabName: "General Settings",
            id: 1
        },
        {
            tabName: "Access Control",
            id: 2
        }
    ];
    // for changing data through the parent or fetching data in children component
    // const handleTabChange = (tabId: number) => {
    //     console.log("Active tab is:", tabId);
    // };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$tab$2d$component$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            data: tabs,
            // onTabChange={handleTabChange}
            renderContent: (tabId)=>{
                if (tabId === 1) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$general$2d$settings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/settings/settings-component.tsx",
                        lineNumber: 26,
                        columnNumber: 20
                    }, void 0);
                } else {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$access$2d$control$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/settings/settings-component.tsx",
                        lineNumber: 28,
                        columnNumber: 20
                    }, void 0);
                }
            }
        }, void 0, false, {
            fileName: "[project]/components/settings/settings-component.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/settings/settings-component.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}}),
"[project]/node_modules/framer-motion/dist/es/render/components/motion/elements.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "MotionA": (()=>MotionA),
    "MotionAbbr": (()=>MotionAbbr),
    "MotionAddress": (()=>MotionAddress),
    "MotionAnimate": (()=>MotionAnimate),
    "MotionArea": (()=>MotionArea),
    "MotionArticle": (()=>MotionArticle),
    "MotionAside": (()=>MotionAside),
    "MotionAudio": (()=>MotionAudio),
    "MotionB": (()=>MotionB),
    "MotionBase": (()=>MotionBase),
    "MotionBdi": (()=>MotionBdi),
    "MotionBdo": (()=>MotionBdo),
    "MotionBig": (()=>MotionBig),
    "MotionBlockquote": (()=>MotionBlockquote),
    "MotionBody": (()=>MotionBody),
    "MotionButton": (()=>MotionButton),
    "MotionCanvas": (()=>MotionCanvas),
    "MotionCaption": (()=>MotionCaption),
    "MotionCircle": (()=>MotionCircle),
    "MotionCite": (()=>MotionCite),
    "MotionClipPath": (()=>MotionClipPath),
    "MotionCode": (()=>MotionCode),
    "MotionCol": (()=>MotionCol),
    "MotionColgroup": (()=>MotionColgroup),
    "MotionData": (()=>MotionData),
    "MotionDatalist": (()=>MotionDatalist),
    "MotionDd": (()=>MotionDd),
    "MotionDefs": (()=>MotionDefs),
    "MotionDel": (()=>MotionDel),
    "MotionDesc": (()=>MotionDesc),
    "MotionDetails": (()=>MotionDetails),
    "MotionDfn": (()=>MotionDfn),
    "MotionDialog": (()=>MotionDialog),
    "MotionDiv": (()=>MotionDiv),
    "MotionDl": (()=>MotionDl),
    "MotionDt": (()=>MotionDt),
    "MotionEllipse": (()=>MotionEllipse),
    "MotionEm": (()=>MotionEm),
    "MotionEmbed": (()=>MotionEmbed),
    "MotionFeBlend": (()=>MotionFeBlend),
    "MotionFeColorMatrix": (()=>MotionFeColorMatrix),
    "MotionFeComponentTransfer": (()=>MotionFeComponentTransfer),
    "MotionFeComposite": (()=>MotionFeComposite),
    "MotionFeConvolveMatrix": (()=>MotionFeConvolveMatrix),
    "MotionFeDiffuseLighting": (()=>MotionFeDiffuseLighting),
    "MotionFeDisplacementMap": (()=>MotionFeDisplacementMap),
    "MotionFeDistantLight": (()=>MotionFeDistantLight),
    "MotionFeDropShadow": (()=>MotionFeDropShadow),
    "MotionFeFlood": (()=>MotionFeFlood),
    "MotionFeFuncA": (()=>MotionFeFuncA),
    "MotionFeFuncB": (()=>MotionFeFuncB),
    "MotionFeFuncG": (()=>MotionFeFuncG),
    "MotionFeFuncR": (()=>MotionFeFuncR),
    "MotionFeGaussianBlur": (()=>MotionFeGaussianBlur),
    "MotionFeImage": (()=>MotionFeImage),
    "MotionFeMerge": (()=>MotionFeMerge),
    "MotionFeMergeNode": (()=>MotionFeMergeNode),
    "MotionFeMorphology": (()=>MotionFeMorphology),
    "MotionFeOffset": (()=>MotionFeOffset),
    "MotionFePointLight": (()=>MotionFePointLight),
    "MotionFeSpecularLighting": (()=>MotionFeSpecularLighting),
    "MotionFeSpotLight": (()=>MotionFeSpotLight),
    "MotionFeTile": (()=>MotionFeTile),
    "MotionFeTurbulence": (()=>MotionFeTurbulence),
    "MotionFieldset": (()=>MotionFieldset),
    "MotionFigcaption": (()=>MotionFigcaption),
    "MotionFigure": (()=>MotionFigure),
    "MotionFilter": (()=>MotionFilter),
    "MotionFooter": (()=>MotionFooter),
    "MotionForeignObject": (()=>MotionForeignObject),
    "MotionForm": (()=>MotionForm),
    "MotionG": (()=>MotionG),
    "MotionH1": (()=>MotionH1),
    "MotionH2": (()=>MotionH2),
    "MotionH3": (()=>MotionH3),
    "MotionH4": (()=>MotionH4),
    "MotionH5": (()=>MotionH5),
    "MotionH6": (()=>MotionH6),
    "MotionHead": (()=>MotionHead),
    "MotionHeader": (()=>MotionHeader),
    "MotionHgroup": (()=>MotionHgroup),
    "MotionHr": (()=>MotionHr),
    "MotionHtml": (()=>MotionHtml),
    "MotionI": (()=>MotionI),
    "MotionIframe": (()=>MotionIframe),
    "MotionImage": (()=>MotionImage),
    "MotionImg": (()=>MotionImg),
    "MotionInput": (()=>MotionInput),
    "MotionIns": (()=>MotionIns),
    "MotionKbd": (()=>MotionKbd),
    "MotionKeygen": (()=>MotionKeygen),
    "MotionLabel": (()=>MotionLabel),
    "MotionLegend": (()=>MotionLegend),
    "MotionLi": (()=>MotionLi),
    "MotionLine": (()=>MotionLine),
    "MotionLinearGradient": (()=>MotionLinearGradient),
    "MotionLink": (()=>MotionLink),
    "MotionMain": (()=>MotionMain),
    "MotionMap": (()=>MotionMap),
    "MotionMark": (()=>MotionMark),
    "MotionMarker": (()=>MotionMarker),
    "MotionMask": (()=>MotionMask),
    "MotionMenu": (()=>MotionMenu),
    "MotionMenuitem": (()=>MotionMenuitem),
    "MotionMetadata": (()=>MotionMetadata),
    "MotionMeter": (()=>MotionMeter),
    "MotionNav": (()=>MotionNav),
    "MotionObject": (()=>MotionObject),
    "MotionOl": (()=>MotionOl),
    "MotionOptgroup": (()=>MotionOptgroup),
    "MotionOption": (()=>MotionOption),
    "MotionOutput": (()=>MotionOutput),
    "MotionP": (()=>MotionP),
    "MotionParam": (()=>MotionParam),
    "MotionPath": (()=>MotionPath),
    "MotionPattern": (()=>MotionPattern),
    "MotionPicture": (()=>MotionPicture),
    "MotionPolygon": (()=>MotionPolygon),
    "MotionPolyline": (()=>MotionPolyline),
    "MotionPre": (()=>MotionPre),
    "MotionProgress": (()=>MotionProgress),
    "MotionQ": (()=>MotionQ),
    "MotionRadialGradient": (()=>MotionRadialGradient),
    "MotionRect": (()=>MotionRect),
    "MotionRp": (()=>MotionRp),
    "MotionRt": (()=>MotionRt),
    "MotionRuby": (()=>MotionRuby),
    "MotionS": (()=>MotionS),
    "MotionSamp": (()=>MotionSamp),
    "MotionScript": (()=>MotionScript),
    "MotionSection": (()=>MotionSection),
    "MotionSelect": (()=>MotionSelect),
    "MotionSmall": (()=>MotionSmall),
    "MotionSource": (()=>MotionSource),
    "MotionSpan": (()=>MotionSpan),
    "MotionStop": (()=>MotionStop),
    "MotionStrong": (()=>MotionStrong),
    "MotionStyle": (()=>MotionStyle),
    "MotionSub": (()=>MotionSub),
    "MotionSummary": (()=>MotionSummary),
    "MotionSup": (()=>MotionSup),
    "MotionSvg": (()=>MotionSvg),
    "MotionSymbol": (()=>MotionSymbol),
    "MotionTable": (()=>MotionTable),
    "MotionTbody": (()=>MotionTbody),
    "MotionTd": (()=>MotionTd),
    "MotionText": (()=>MotionText),
    "MotionTextPath": (()=>MotionTextPath),
    "MotionTextarea": (()=>MotionTextarea),
    "MotionTfoot": (()=>MotionTfoot),
    "MotionTh": (()=>MotionTh),
    "MotionThead": (()=>MotionThead),
    "MotionTime": (()=>MotionTime),
    "MotionTitle": (()=>MotionTitle),
    "MotionTr": (()=>MotionTr),
    "MotionTrack": (()=>MotionTrack),
    "MotionTspan": (()=>MotionTspan),
    "MotionU": (()=>MotionU),
    "MotionUl": (()=>MotionUl),
    "MotionUse": (()=>MotionUse),
    "MotionVideo": (()=>MotionVideo),
    "MotionView": (()=>MotionView),
    "MotionWbr": (()=>MotionWbr),
    "MotionWebview": (()=>MotionWebview)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/create.mjs [app-ssr] (ecmascript)");
"use client";
;
/**
 * HTML components
 */ const MotionA = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("a");
const MotionAbbr = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("abbr");
const MotionAddress = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("address");
const MotionArea = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("area");
const MotionArticle = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("article");
const MotionAside = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("aside");
const MotionAudio = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("audio");
const MotionB = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("b");
const MotionBase = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("base");
const MotionBdi = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("bdi");
const MotionBdo = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("bdo");
const MotionBig = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("big");
const MotionBlockquote = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("blockquote");
const MotionBody = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("body");
const MotionButton = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("button");
const MotionCanvas = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("canvas");
const MotionCaption = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("caption");
const MotionCite = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("cite");
const MotionCode = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("code");
const MotionCol = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("col");
const MotionColgroup = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("colgroup");
const MotionData = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("data");
const MotionDatalist = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("datalist");
const MotionDd = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("dd");
const MotionDel = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("del");
const MotionDetails = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("details");
const MotionDfn = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("dfn");
const MotionDialog = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("dialog");
const MotionDiv = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("div");
const MotionDl = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("dl");
const MotionDt = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("dt");
const MotionEm = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("em");
const MotionEmbed = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("embed");
const MotionFieldset = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("fieldset");
const MotionFigcaption = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("figcaption");
const MotionFigure = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("figure");
const MotionFooter = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("footer");
const MotionForm = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("form");
const MotionH1 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("h1");
const MotionH2 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("h2");
const MotionH3 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("h3");
const MotionH4 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("h4");
const MotionH5 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("h5");
const MotionH6 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("h6");
const MotionHead = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("head");
const MotionHeader = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("header");
const MotionHgroup = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("hgroup");
const MotionHr = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("hr");
const MotionHtml = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("html");
const MotionI = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("i");
const MotionIframe = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("iframe");
const MotionImg = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("img");
const MotionInput = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("input");
const MotionIns = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("ins");
const MotionKbd = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("kbd");
const MotionKeygen = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("keygen");
const MotionLabel = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("label");
const MotionLegend = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("legend");
const MotionLi = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("li");
const MotionLink = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("link");
const MotionMain = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("main");
const MotionMap = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("map");
const MotionMark = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("mark");
const MotionMenu = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("menu");
const MotionMenuitem = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("menuitem");
const MotionMeter = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("meter");
const MotionNav = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("nav");
const MotionObject = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("object");
const MotionOl = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("ol");
const MotionOptgroup = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("optgroup");
const MotionOption = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("option");
const MotionOutput = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("output");
const MotionP = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("p");
const MotionParam = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("param");
const MotionPicture = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("picture");
const MotionPre = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("pre");
const MotionProgress = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("progress");
const MotionQ = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("q");
const MotionRp = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("rp");
const MotionRt = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("rt");
const MotionRuby = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("ruby");
const MotionS = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("s");
const MotionSamp = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("samp");
const MotionScript = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("script");
const MotionSection = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("section");
const MotionSelect = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("select");
const MotionSmall = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("small");
const MotionSource = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("source");
const MotionSpan = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("span");
const MotionStrong = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("strong");
const MotionStyle = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("style");
const MotionSub = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("sub");
const MotionSummary = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("summary");
const MotionSup = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("sup");
const MotionTable = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("table");
const MotionTbody = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("tbody");
const MotionTd = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("td");
const MotionTextarea = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("textarea");
const MotionTfoot = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("tfoot");
const MotionTh = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("th");
const MotionThead = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("thead");
const MotionTime = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("time");
const MotionTitle = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("title");
const MotionTr = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("tr");
const MotionTrack = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("track");
const MotionU = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("u");
const MotionUl = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("ul");
const MotionVideo = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("video");
const MotionWbr = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("wbr");
const MotionWebview = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("webview");
/**
 * SVG components
 */ const MotionAnimate = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("animate");
const MotionCircle = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("circle");
const MotionDefs = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("defs");
const MotionDesc = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("desc");
const MotionEllipse = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("ellipse");
const MotionG = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("g");
const MotionImage = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("image");
const MotionLine = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("line");
const MotionFilter = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("filter");
const MotionMarker = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("marker");
const MotionMask = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("mask");
const MotionMetadata = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("metadata");
const MotionPath = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("path");
const MotionPattern = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("pattern");
const MotionPolygon = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("polygon");
const MotionPolyline = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("polyline");
const MotionRect = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("rect");
const MotionStop = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("stop");
const MotionSvg = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("svg");
const MotionSymbol = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("symbol");
const MotionText = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("text");
const MotionTspan = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("tspan");
const MotionUse = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("use");
const MotionView = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("view");
const MotionClipPath = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("clipPath");
const MotionFeBlend = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feBlend");
const MotionFeColorMatrix = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feColorMatrix");
const MotionFeComponentTransfer = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feComponentTransfer");
const MotionFeComposite = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feComposite");
const MotionFeConvolveMatrix = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feConvolveMatrix");
const MotionFeDiffuseLighting = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feDiffuseLighting");
const MotionFeDisplacementMap = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feDisplacementMap");
const MotionFeDistantLight = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feDistantLight");
const MotionFeDropShadow = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feDropShadow");
const MotionFeFlood = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feFlood");
const MotionFeFuncA = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feFuncA");
const MotionFeFuncB = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feFuncB");
const MotionFeFuncG = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feFuncG");
const MotionFeFuncR = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feFuncR");
const MotionFeGaussianBlur = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feGaussianBlur");
const MotionFeImage = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feImage");
const MotionFeMerge = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feMerge");
const MotionFeMergeNode = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feMergeNode");
const MotionFeMorphology = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feMorphology");
const MotionFeOffset = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feOffset");
const MotionFePointLight = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("fePointLight");
const MotionFeSpecularLighting = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feSpecularLighting");
const MotionFeSpotLight = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feSpotLight");
const MotionFeTile = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feTile");
const MotionFeTurbulence = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("feTurbulence");
const MotionForeignObject = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("foreignObject");
const MotionLinearGradient = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("linearGradient");
const MotionRadialGradient = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("radialGradient");
const MotionTextPath = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$create$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMotionComponent"])("textPath");
;
}}),
"[project]/node_modules/framer-motion/dist/es/render/components/motion/elements.mjs [app-ssr] (ecmascript) <export MotionHead as head>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "head": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$elements$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MotionHead"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$elements$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/elements.mjs [app-ssr] (ecmascript)");
}}),

};

//# sourceMappingURL=_4db4184a._.js.map