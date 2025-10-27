module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Disable the problematic rules temporarily
        'subject-case': [0],
        'header-max-length': [2, 'always', 120],
        'type-enum': [0],
    },
};
