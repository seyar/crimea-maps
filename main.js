ymaps.ready(function () {
    new App();
});

var DEFAULT_PARAMS = {ll: [34.4029205, 44.68831017], zoom: 10, type: 'yandex#map'};

/**
 *
 * @constructor
 */
function App() {
    var params = this._getState();
    var map = this._initMap(params);

    map.events.add('boundschange', this._onBoundsChange.bind(this, map));
    map.events.add('typechange', this._onBoundsChange.bind(this, map));

    var typeSelector = map.controls.get('typeSelector');
    typeSelector.addMapType(this._addLayer('east-crimea/%z/tile-%x-%y.jpg', 'Атлас1'), 25);
    typeSelector.addMapType(this._addLayer('kartatlas/%z/tile-%x-%y.png', 'Атлас2'), 26);
    typeSelector.addMapType(this._addMercatorLayer('http://95.110.199.154/tilesterra/%z/%x/%y.png', 'Terra Map'), 27);
    typeSelector.addMapType(this._wikimapia('http://%host%.wikimapia.org/?x=%x&y=%y&zoom=%z&r=0&type=hybrid&lng=1'), 28);

    if (params.type) {
        map.setType(params.type);
    }
};

/**
 *
 */
App.prototype = {
    /**
     * @param {Object} params
     * @param {Number} params.zoom
     * @param {Number} params.ll
     * @returns {ymaps.Map}
     * @private
     */
    _initMap: function (params) {
        var map = new ymaps.Map('map', {
            center: params.ll.split(','),
            zoom: params.zoom
        });

        return map;
    },

    /**
     *
     * @private
     */
    _onBoundsChange: function (map) {
        var options = {
            zoom: map.getZoom(),
            ll: map.getCenter(),
            type: map.getType()
        };
        this._saveState(options);
    },

    /**
     * adds layer
     *
     * @param {String} tileUrlTemplate
     * @param {String} key
     * @returns {String}
     */
    _addLayer: function (tileUrlTemplate, key) {
        var Layer = function () {
            var layer = new ymaps.Layer(tileUrlTemplate, {tileTransparent: true});
            return layer;
        };
        // Добавим слой в сторадж слоев
        var mapName = key + '#hybrid';
        ymaps.layer.storage.add(mapName, Layer);
        // Создадим тип карты, состоящий из других слоёв
        var Type = new ymaps.MapType(key.toUpperCase(), ['yandex#satellite', mapName]);
        // Добавим в хранилище типов карты
        ymaps.mapType.storage.add(mapName, Type);

        return mapName;
    },

    /**
     * adds mercator layer
     *
     * @param {String} tileUrlTemplate
     * @param {String} key
     * @returns {String}
     */
    _addMercatorLayer: function (tileUrlTemplate, key) {
        var Layer = function () {
            var layer = new ymaps.Layer(tileUrlTemplate, {
                tileTransparent: true,
                projection: ymaps.projection.sphericalMercator
            });
            return layer;
        };
        // Добавим слой в сторадж слоев
        var mapName = key + '#hybrid';
        ymaps.layer.storage.add(mapName, Layer);
        // Создадим тип карты, состоящий из других слоёв
        var Type = new ymaps.MapType(key.toUpperCase(), ['yandex#satellite', mapName]);
        // Добавим в хранилище типов карты
        ymaps.mapType.storage.add(mapName, Type);

        return mapName;
    }
    ,

    /**
     *
     * @param {String} tileUrlTemplate
     * @returns {String}
     */
    _wikimapia: function (tileUrlTemplate) {
        var WikimapiaLayer = function () {
            var layer = new ymaps.Layer('', {
                tileTransparent: true,
                projection: ymaps.projection.sphericalMercator
            });

            layer.getTileUrl = function (tileNumber, tileZoom) {
                var host = (tileNumber[0] % 4) + (tileNumber[1] % 4) * 4;
                return tileUrlTemplate
                    .replace('%host%', 'i' + host)
                    .replace('%x', tileNumber[0])
                    .replace('%y', tileNumber[1])
                    .replace('%z', tileZoom);
            };
            return layer;
        };

        // Добавим слой под ключом
        ymaps.layer.storage.add('wiki#aerial', WikimapiaLayer);
        // Создадим тип карты, состоящий из слоёв 'mq#aerial' и 'yandex#skeleton'
        var wikimapiaType = new ymaps.MapType('Wikimapia', ['yandex#satellite', 'wiki#aerial']);
        // Добавим в хранилище типов карты
        ymaps.mapType.storage.add('wi_ya#hybrid', wikimapiaType);

        return 'wi_ya#hybrid';
    },

    /**
     * @returns {Object}
     */
    _getState: function () {
        var query = document.location.hash.replace(/^\#!/, '');
        var args = query.split('&');
        if (!args) {
            return DEFAULT_PARAMS
        }
        var urlParams = {};
        args.forEach(function (arg) {
            var param = arg.split('=');
            if (param[0] && param[1]) {
                urlParams[param[0]] = param[1];
            }
        });

        return Object.keys(urlParams).length ? urlParams : DEFAULT_PARAMS;
    },

    /**
     * @param {Object} options
     * @param {Number} options.zoom
     * @param {Number} options.ll
     * @param {String} options.type
     */
    _saveState: function (options) {
        document.location.hash = '#!zoom=%z&ll=%ll&type=%type'
            .replace('%z', options.zoom)
            .replace('%ll', options.ll)
            .replace('%type', options.type);
    }
};
