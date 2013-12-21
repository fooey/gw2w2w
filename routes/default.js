"use strict"

module.exports = function (req, res) {
    const renderStart = Date.now();
    const urlLang = req.params.lang || 'en';
    const urlSlug = req.params.slug;

    res.render('default', {
        title: 'GuildWars2 WvW Objectives Tracker',
        renderStart: renderStart,

        urlLang: urlLang,
        urlSlug: urlSlug,
    });
};