$(function() {
  
  // initial get
  $.get('/people', function(people) {
    if (people.length > 0) {
      people.forEach(function(person) {
        addTile(person.name, person.image, person.loc); 
      });
    }
  })
  
  
  //init drag and drop
  $( ".column" ).sortable({
      connectWith: ".column",
      handle: ".tile__header",
      placeholder: "tile__placeholder",
      start: function (event, ui) {
        ui.item.css("transform", "")
        ui.item.addClass('tilt');
      },
      stop: function (event, ui) {
        postData();
      },
      update: function (event, ui) {
        ui.item.removeClass('tilt'); 
        var rand = Math.random() * (-3 - 3) + 3;
        ui.item.css("transform", "rotate(" + rand + "deg)")
      }
  });
  
 
  //new button handler   
  $(document).on('click', '.js-new', function(e){
    e.preventDefault();
    var rand = Math.floor(Math.random() * (1 - 99) + 99);
    var name = sanitizeString($('.js-name').val()) || rand;
    var image = sanitizeString($('.js-image').val()) || "https://spaceholder.cc/100x100?a="+rand;
    addTile(name, image, 'office');
    postData();
    $('.js-name').val('');
    $('.js-image').val(''); 
  });
  
  
  //remove button handler
  $(document).on('click', '.js-remove', function(e){
    e.preventDefault();
    removeTile($(this));
    postData();
  });
  
  
  // add a new tile
  function addTile(name, image, loc ){
    var rand = Math.random() * (-3 - 3) + 3;
    var tile = 
        `<article class="tile" data-tile data-name="${name}" data-image="${image}" style="transform: rotate(${rand}deg)">
          <div class="tile__content">
            <img class="tile__image" src="${image}">
          </div>
          <header class="tile__header">${name}</header>
          <button class="tile__remove js-remove"> ╳ </button>
        </article>`;
      
      $(`[data-col="${loc}"]`).append(tile);
  }
  
  
  // add a new tile
  function removeTile(el){
      el.closest('[data-tile]').remove();
  }
  
  
  // post current state to rest api
  function postData(){
    let people = [];
    $('[data-tile]').each(function(){
      let person = {
        name: $(this).data('name'),
        image: $(this).data('image'),
        loc: $(this).closest('[data-col]').data('col')
      };
      people.push(person);
    });
    
    $.post('/people', {people: people}).done(function( resp ) {
      console.log( resp );
    });
  }
    
  function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü\/:\&\=\?_-\s\.,]/gim,"");
    return str.trim();
  }
  
})
