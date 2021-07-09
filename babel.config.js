// separate babel config for jest because jest can't find the normal one ???
// this is overwritten by CRA when actually serving the app, it just applies to jest
module.exports = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
        "@babel/preset-react",
    ]
}
