module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "commonjs": true
    },
    "globals": {
      "THREE": false
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
    			"error", "tab"
    		],
        "space-in-parens": [
          "error",
          "never"
        ],
        "comma-spacing": [
        	"error",
        	{ "before": false, "after": true }
        ],
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
