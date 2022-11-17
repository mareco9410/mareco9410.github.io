//  IMPORTS LIBs
importScripts('js/sw-utils.js');

    const STATIC_CACHE      = 'static-v2';
    const DYNAMIC_CACHE     = 'dynamic-v1';
    const INMUTABLE_CACHE   = 'inmutable-v1';

    const APP_SHELL = [
        // '/',
        'index.html',
        'css/style.css',
        'img/favicon.ico',
        'img/avatars/spiderman.jpg',
        'img/avatars/hulk.jpg',
        'img/avatars/ironman.jpg',
        'img/avatars/thor.jpg',
        'img/avatars/wolverine.jpg',
        'js/app.js'
    ];

    const APP_SHELL_INMUTABLE = [
        'https://fonts.googleapis.com/css?family=Quicksand:300,400',
        'https://fonts.googleapis.com/css?family=Lato:400,300',
        'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
        'css/animate.css',
        'js/libs/jquery.js'
    ];

    //EVENTS
    /*---------------- INSTALL ----------------*/
    self.addEventListener('install', evt => {

        const cacheStatic = caches.open( STATIC_CACHE ).then(cache =>
            cache.addAll( APP_SHELL ));

        const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache =>
            cache.addAll( APP_SHELL_INMUTABLE ));

        evt.waitUntil(Promise.all( [cacheStatic,cacheInmutable] ));

    });

    /*---------------- ACTIVATE ----------------*/
    self.addEventListener('activate', evt => {

        const respuesta = caches.keys().then(keys => {
            keys.forEach( key => {
                if ( key != STATIC_CACHE && key.includes('static') ){
                    return caches.delete(key);
                }
            });
        });

        evt.waitUntil(respuesta);

    });

    /*---------------- FETCH ----------------*/
    //CACHE WITH NETWORK FALLBACK
    self.addEventListener('fecth', evt => {

        const respuesta = caches.match(evt.request ).then(res => {

            if (res) {
                return res;
            } else {
                return fetch( evt.request ).then( newRes => {
                    //ésta función no funciona, no la puedo llamar desde éste script
                    return actualizaCacheDinamico( DYNAMIC_CACHE, evt.request, newRes );

                });
            }
        });

        evt.respondWith(respuesta);

    });


