/*
 * random-string
 * https://github.com/valiton/node-random-string
 *
 * Copyright (c) 2013 Valiton GmbH, Bastian 'hereandnow' Behrens
 * Licensed under the MIT license.
 */

'use strict';

var numbers = '0123456789',
    // letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    specials = '!$%^&*()_+|~-=`{}[]:;<>?,./';


function _defaults(opts) {
    opts || (opts = {});
    return {
        length: opts.length || 8,
        numeric: typeof opts.numeric === 'boolean' ? opts.numeric : true,
        letters: typeof opts.letters === 'boolean' ? opts.letters : true,
        special: typeof opts.special === 'boolean' ? opts.special : false,
        exclude: Array.isArray(opts.exclude) ? opts.exclude : []
    };
}

function _buildChars(opts) {
    var chars = '';
    if (opts.numeric) {
        chars += numbers;
    }
    if (opts.letters) {
        chars += letters;
    }
    if (opts.special) {
        chars += specials;
    }
    for (var i = 0; i <= opts.exclude.length; i++) {
        chars = chars.replace(opts.exclude[i], "");
    }
    return chars;
}

module.exports = function randomString(opts) {
    opts = _defaults(opts);
    var i, rn,
        rnd = '',
        len = opts.length,
        exclude = opts.exclude,
        randomChars = _buildChars(opts);
    for (i = 1; i <= len; i++) {
        rnd += randomChars.substring(rn = Math.floor(Math.random() * randomChars.length), rn + 1);
    }
    return rnd;
};