(function () {
    'use strict';

    let app = {
        person: localStorage.person || document.querySelector('input').value || 'Burns'
    };

    document.querySelector('input').value = app.person;
    document.querySelector('header span').innerText = app.person;

    const initPromise = new Promise(function (resolve) {

        let http = new XMLHttpRequest();
        const url = "/person/" + app.person;
        http.open("GET", url, true);
        http.setRequestHeader('content-type', 'application/json; charset=utf-8');

        http.onreadystatechange = function () {
            if (http.status == 200) {
                const person = JSON.parse(http.response);
                resolve(person.loc)
            }
        };
        http.send();
    });

    initPromise.then(function (loc) {
        document.querySelector('[data-loc=' + loc + ']').classList.add('btn--active');
    });


    document.querySelectorAll('main button').forEach(function (el) {
        el.addEventListener("click", function (e) {

            const btn = e.currentTarget;
            const loc = btn.getAttribute('data-loc');

            const requestPromise = new Promise(function (resolve) {

                let http = new XMLHttpRequest();
                const url = "/person/" + app.person + "/loc/" + loc;
                http.open("PUT", url, true);
                http.setRequestHeader('content-type', 'application/json; charset=utf-8');

                http.onreadystatechange = function () {
                    if (http.status == 200) {
                        console.log(http.responseText);
                        resolve(http.status)
                    }
                };
                http.send();

            });

            requestPromise.then(function () {
                document.querySelectorAll('button').forEach(function (el) {
                    el.classList.remove('btn--active')
                });

                btn.classList.add('btn--active');
            });

        });
    });


    document.querySelector('.js-settings').addEventListener("click", function () {

        if (document.querySelector('aside').classList.contains('-show')) {
            document.querySelector('aside').classList.remove('-show');
        } else {
            document.querySelector('aside').classList.add('-show');
        }
    });

    document.querySelector('input').addEventListener("change", function () {
        app.person = localStorage.person = document.querySelector('input').value;
        document.querySelector('header span').innerText = app.person;
    });
})();
