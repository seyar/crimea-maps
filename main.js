ymaps.ready(function () {
    new App();
});

var DEFAULT_PARAMS = {lat: 44.68831017, lon: 34.4029205, zoom: 10};

/**
 *
 * @constructor
 */
function App() {
    this._map = this._initMap();
    this._map.events.add('boundschange', this._saveLocation.bind(this));

    var typeSelector = this._map.controls.get('typeSelector');
    typeSelector.addMapType(this._addLayer('east-crimea/%z/tile-%x-%y.jpg', 'atlas'), 26);
    typeSelector.addMapType(this._addMercatorLayer('http://95.110.199.154/tilesterra/%z/%x/%y.png', 'terramap'), 27);
};

/**
 * @returns {ymaps.Map}
 * @private
 */
App.prototype._initMap = function () {
    var params = this._parseUrl();
    var map = new ymaps.Map('map', {
        center: [params.lon, params.lat],
        zoom: params.zoom
    });

    if (params.type) {
        map.setType(params.type);
    }

    return map;
};

/**
 * adds layer
 *
 * @param {String} tileUrlTemplate
 * @param {String} key
 * @returns {String}
 */
App.prototype._addLayer = function (tileUrlTemplate, key) {
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
};

/**
 * adds mercator layer
 *
 * @param {String} tileUrlTemplate
 * @param {String} key
 * @returns {String}
 */
App.prototype._addMercatorLayer = function (tileUrlTemplate, key) {
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
};

/**
 * @returns {Object}
 */
App.prototype._parseUrl = function () {
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
};

/**
 * @param {ymaps.Event} event
 */
App.prototype._saveLocation = function (event) {
    // Будем отслеживать изменение уровня масштабирования карты
    var z = 'oldZoom';
    if (event.get('newZoom') != event.get('oldZoom')) {
        z = 'newZoom';
    }

    var c = 'oldCenter';
    if (event.get('newCenter') != event.get('oldCenter')) {
        c = 'newCenter';
    }

    document.location.hash = '#!zoom=%z&lat=%lat&lon=%lon&type=%type'
        .replace('%z', event.get(z))
        .replace('%lat', event.get(c)[1])
        .replace('%lon', event.get(c)[0])
        .replace('%type', this._map.getType());
};