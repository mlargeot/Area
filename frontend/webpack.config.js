const { createWebpackConfigAsync } = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createWebpackConfigAsync(env, argv);
    // Customize the config here if needed
    return config;
};