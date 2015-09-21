ymaps.ready(function () {
    new App();
});

/**
 *
 * @constructor
 */
function App() {
    var map = new ymaps.Map('map', {
        center: [44.68831017, 34.4029205],
        zoom: 10
    });
    var typeSelector = map.controls.get('typeSelector');
    typeSelector.addMapType(this._addLayer('east-crimea/%z/tile-%x-%y.jpg', 'atlas'), 26);
    typeSelector.addMapType(this._addMercatorLayer('http://95.110.199.154/tilesterra/%z/%x/%y.png', 'terramap'), 27);
};

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