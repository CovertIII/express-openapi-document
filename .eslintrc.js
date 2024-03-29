module.exports = {
  "env": {
    "node": true
  },
  "extends": [
    "eslint:recommended",
  ],
  "globals": {
    "Promise": 1
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-console":[ 0 ],
    "indent": [
      1,
      2,
      {"SwitchCase": 1}
    ],
    "quotes": [
      1,
      "single"
    ],
    "semi": [
      2,
      "always"
    ],
    "no-var": ["error"],
    "prefer-arrow-callback": ["error"],
    "object-shorthand": ["error"],
    "no-duplicate-imports": ["error"],
    "no-iterator": ["error"],
    "dot-notation": ["error"],
    "no-plusplus": ["error"],
    "eqeqeq": ["error"],
    "no-nested-ternary": ["error"],
    "no-unneeded-ternary": ["error"],
    "brace-style": ["error"],
    "space-infix-ops": ["error"],
    "no-trailing-spaces": ["error"],
    "no-trailing-spaces": [ 2 ],
    "prefer-const": ["error", {
      "destructuring": "any",
      "ignoreReadBeforeAssign": false
    }],
  }
};
