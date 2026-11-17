import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default defineConfig(
    { ignores: ["dist", ".yarn"] },

    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    reactHooks.configs.flat.recommended,
    jsxA11y.flatConfigs.strict,
    prettier,

    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        plugins: {
            "simple-import-sort": simpleImportSort
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            "arrow-body-style": ["error", "always"],
            curly: ["error", "all"],
            eqeqeq: ["error", "always"],
            "no-nested-ternary": "error",
            "prefer-const": "error",
            "no-restricted-syntax": [
                "error",
                {
                    selector: "ExportDefaultDeclaration",
                    message: "Use named exports only: export const MyThing = ..."
                },
                {
                    selector: "FunctionDeclaration",
                    message: "Use arrow functions: const myFunction = (): ReturnType => { ... }"
                },
                {
                    selector: "FunctionExpression",
                    message: "Use arrow functions: const myFunction = (): ReturnType => { ... }"
                },

                // -------------------------------------------------------------
                // Every variable needs a type annotation
                // -------------------------------------------------------------
                {
                    selector:
                        "VariableDeclarator[id.type='Identifier']:not([id.typeAnnotation]):not([init.type='ArrowFunctionExpression']):not([id.name=/^(is|has|should|can|was)_/i]):not(ForOfStatement > VariableDeclaration > VariableDeclarator):not(ForInStatement > VariableDeclaration > VariableDeclarator)",
                    message: "Add a type annotation: const my_value: MyType = ..."
                },
                {
                    selector:
                        "ArrowFunctionExpression > :matches(Identifier, ObjectPattern, ArrayPattern).params:not([typeAnnotation])",
                    message: "Add a type annotation to this parameter: (my_value: MyType) => ..."
                },
                {
                    selector: "CallExpression[callee.name='useState']:not([typeArguments])",
                    message: "Give useState its type: useState<MyType>(initial_value)"
                },

                // -------------------------------------------------------------
                // return only returns a named variable
                // -------------------------------------------------------------
                {
                    selector: "ReturnStatement[argument]:not([argument.type='Identifier'])",
                    message: "Store the value in a named variable first, then return that variable"
                },

                // -------------------------------------------------------------
                // No chained calls
                // -------------------------------------------------------------
                {
                    selector: "MemberExpression[object.type=/^(CallExpression|NewExpression)$/]",
                    message: "Do not chain calls. Store each step in its own named variable"
                },

                // -------------------------------------------------------------
                // No implicit conditions
                // -------------------------------------------------------------
                {
                    selector:
                        ":matches(IfStatement, ConditionalExpression, WhileStatement, DoWhileStatement):not([test.type='BinaryExpression'][test.operator='==='][test.left.type='Identifier'][test.right.raw=/^(true|false)$/])",
                    message: "Compare a named boolean explicitly: if (is_ready === true) or if (is_ready === false)"
                },
                {
                    selector: "UnaryExpression[operator='!']",
                    message: "Do not use !. Compare explicitly: is_ready === false"
                },
                {
                    selector: "LogicalExpression[operator='&&'] > :not(BinaryExpression, LogicalExpression)",
                    message: "Compare each side explicitly: is_loaded === true && has_data === true"
                },
                {
                    selector: "LogicalExpression[operator='||'] > :not(BinaryExpression, LogicalExpression)",
                    message: "Compare each side explicitly: is_loaded === true || has_data === true"
                }
            ],
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",

            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: false,
                    allowTypedFunctionExpressions: false,
                    allowHigherOrderFunctions: false
                }
            ],
            "@typescript-eslint/naming-convention": [
                "error",
                { selector: "default", format: ["snake_case"] },
                { selector: "import", format: null },
                { selector: "variable", format: ["snake_case", "UPPER_CASE"] },
                {
                    selector: "variable",
                    types: ["boolean"],
                    format: ["snake_case", "UPPER_CASE"],
                    prefix: ["is_", "has_", "should_", "can_", "was_", "IS_", "HAS_", "SHOULD_", "CAN_", "WAS_"]
                },
                { selector: "variable", types: ["function"], format: ["camelCase", "PascalCase"] },
                { selector: "parameter", format: ["snake_case"], leadingUnderscore: "allow" },
                { selector: ["classMethod", "objectLiteralMethod", "typeMethod"], format: ["camelCase"] },
                { selector: "objectLiteralProperty", format: null },
                { selector: "typeLike", format: ["PascalCase"] },
                { selector: "typeParameter", format: ["PascalCase"], prefix: ["T"] },
                { selector: "enumMember", format: ["UPPER_CASE"] }
            ]
        }
    },

    {
        files: ["**/*.js"],
        extends: [tseslint.configs.disableTypeChecked]
    },

    {
        files: ["*.config.js", "*.config.ts"],
        rules: {
            "no-restricted-syntax": "off"
        }
    }
);
