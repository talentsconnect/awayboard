$(function () {

    const RELOAD_AFTER = 30;
    let reloadStorage = localStorage;
    let reloadInterval;

    // auto reloading of page
    if (reloadStorage.autoreload === "true") {
        $('.js-autoreload').attr('checked', true);
        reloadInterval = reloadPage();
    }

    $(document).on('click', '.js-autoreload', function () {
        if ($(this).is(':checked')) {
            reloadStorage.setItem('autoreload', true);
            reloadInterval = reloadPage();
        } else {
            reloadStorage.setItem('autoreload', false);
            window.clearInterval(reloadInterval);
        }
    });

    function reloadPage() {
        return setInterval(function () {
            window.location.reload();
        }, RELOAD_AFTER * 1000);
    }


    // initial get
    $.get('/people', function (people) {
        if (people.length > 0) {
            people.forEach(function (person) {
                addTile(person.name, person.image, person.loc);
            });
        }
    });


    // init drag and drop
    $(".column").sortable({
        connectWith: ".column",
        handle: "[data-draggable]",
        placeholder: "tile__placeholder",
        start: function (event, ui) {
            ui.item.css("transform", "");
            ui.item.addClass('-dragged');
        },
        stop: function (event, ui) {
            ui.item.removeClass('-dragged');

            let person = {
                'name': ui.item.data('name'),
                'image': ui.item.data('image'),
                'loc': ui.item.closest('[data-col]').data('col')
            };

            sendPerson(person);
        },
        update: function (event, ui) {
            ui.item.removeClass('-dragged');
            let rand = Math.random() * (-3 - 3) + 3;
            ui.item.css("transform", "rotate(" + rand + "deg)");
        }
    });


    // add new tile
    $(document).on('click', '.js-new', function (e) {
        e.preventDefault();
        const rand = Math.floor(Math.random() * (1 - 99) + 99);
        let person = {};
        person.name = sanitizeString($('.js-name').val()) || rand;
        person.image = sanitizeString($('.js-image').val()) || "https://spaceholder.cc/100x100?a=" + rand;
        person.loc = $('[data-col]').first().data('col');

        sendPerson(person);
    });

    function sendPerson(person) {
        $.ajax({
            type: 'POST',
            url: '/person',
            data: JSON.stringify(person),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).then(function (resp, status, xhr) {
            sendCallback(resp, xhr);
        });
    }

    function sendCallback(person, xhr) {
        if (xhr.status === 201) {
            addTile(person.name, person.image, person.loc);
            $('.js-name').val('');
            $('.js-image').val('');
        }
    }

    function addTile(name, image, loc) {
        const rand = Math.random() * (-3 - 3) + 3;
        const tile =
            `<article class="tile" data-tile data-name="${name}" data-image="${image}" style="transform: rotate(${rand}deg)">
                  <div class="tile__content" data-draggable>
                        <img class="tile__image" src="${image}">
                  </div>
                  <header class="tile__header" data-draggable>${name}</header>
                  <button class="tile__remove js-remove"> ╳ </button>
            </article>`;

        $(`[data-col="${loc}"]`).append(tile);
    }


    // remove tile
    $(document).on('click', '.js-remove', function (e) {
        e.preventDefault();
        deletePerson({'name': $(this).closest('[data-tile]').data('name')});
    });

    function deletePerson(person) {
        $.ajax({
            type: 'DELETE',
            url: '/person',
            data: JSON.stringify(person),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).then(function (resp, status, xhr) {
            deleteCallback(person, xhr);
        });
    }

    function deleteCallback(person, xhr) {
        if (xhr.status === 204) {
            removeTile(person);
        }
    }

    function removeTile(person) {
        $(`[data-name="${person.name}"]`).remove();
    }


    function sanitizeString(str) {
        str = str.replace(/[^a-z0-9áéíóúñü\/:&=\?_-\s\.,~]/gim, "");
        return str.trim();
    }

});
