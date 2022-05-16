const proPlugins = []
if (process.env.NODE_ENV === 'production') {
    //去除console.log
    proPlugins.push('transform-remove-console')

}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        //去除console.log
        ...proPlugins
    ]
}