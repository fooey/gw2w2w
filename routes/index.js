"use strict"


module.exports = function(app, express){
    var routes = this;

    

    app.get('/:lang([a-z]{2})?/:slug([a-z\-]+)?', require('./default.js'));

    return routes;
};