module.exports = {
    extends: ['react-app', 'plugin:prettier/recommended', 'plugin:cypress/recommended', 'eslint:recommended'],
    globals: {
        _: true,
        less: true,
        moment: true,
        'cypress/globals': true
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
            impliedStrict: true,
            classes: true
        }
    },
    env: {
        browser: true,
        node: true,
        jest: true
    },
    rules: {
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'array-callback-return': 'error',
        'no-unused-vars': 'warn',
        eqeqeq: 'error',
        'no-eq-null': 'error',
        'no-lone-blocks': 'error',
        'no-magic-numbers': 'warn',
        'no-shadow': 'warn',
        'max-depth': ['error', 3]
    },
    settings: {
        'import/resolver': {
            node: {
                moduleDirectory: ['node_modules', 'src/']
            }
        }
    }
};
