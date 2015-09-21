ymaps.ready(init);

function init() {

    var myMap = new ymaps.Map('map', {
        center: [44.68831017, 34.4029205],
        zoom: 10
    });

    var WikimapiaLayer = function () {
        var layer = new ymaps.Layer('%z\\tile-%x-%y.jpg', {tileTransparent: true});
        // layer.getZoomRange = function (point) {
        //     return [10, 14];
        // };
        return layer;
    };
    ymaps.layer.storage.add('vc#aerial', WikimapiaLayer);

    // Добавим слой под ключом
    //ymaps.layer.storage.add('wiki#aerial', WikimapiaLayer);
    // Создадим тип карты, состоящий из слоёв 'mq#aerial' и 'yandex#skeleton'
    var wikimapiaType = new ymaps.MapType('Wi + Ya', ['yandex#satellite', 'wiki#aerial']);
    // Добавим в хранилище типов карты
    ymaps.mapType.storage.add('wi_ya#hybrid', wikimapiaType);
    // Теперь мы можем задавать наш тип карты любой карте
    //myMap.setType('wi_ya#hybrid');

    var typeSelector = myMap.controls.get('typeSelector');
    typeSelector.addMapType('wi_ya#hybrid', 26);

    //var geolocation = ymaps.geolocation;
    // Сравним положение, вычисленное по ip пользователя и
    // положение, вычисленное средствами браузера.
    // geolocation.get({
    //     provider: 'yandex',
    //     mapStateAutoApply: true
    // }).then(function (result) {
    //     // Красным цветом пометим положение, вычисленное через ip.
    //     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
    //     result.geoObjects.get(0).properties.set({
    //         balloonContentBody: 'Мое местоположение'
    //     });
    //     myMap.geoObjects.add(result.geoObjects);
    // });

    // geolocation.get({
    //     provider: 'browser',
    //     mapStateAutoApply: true
    // }).then(function (result) {
    //     // Синим цветом пометим положение, полученное через браузер.
    //     // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
    //     result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
    //     myMap.geoObjects.add(result.geoObjects);
    // });
}