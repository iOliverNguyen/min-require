module.exports = function(grunt) {

    var src = ['min-require.js'],
        specs = ['specs/**/*.js'],
        all = src.concat(specs);

    grunt.initConfig(
        {
            jasmine: {
                default: {
                    src: src,
                    options: {
                        specs: specs,
                        junit: {
                            path: 'reports',
                            consolidate: true
                        },
                        keepRunner: true
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['jasmine']);
};