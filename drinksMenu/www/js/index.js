var app = {

	model: {},

	order: [],

	odd: 0,

  quant: 0,

	firebaseConfig: {
    apiKey: "AIzaSyC50skbZWPdmbhMgSz9ulM8pBJ8r8F8lag",
    authDomain: "drinksmenu-ab56b.firebaseapp.com",
    databaseURL: "https://drinksmenu-ab56b.firebaseio.com",
    projectId: "drinksmenu-ab56b",
    storageBucket: "drinksmenu-ab56b.appspot.com",
    messagingSenderId: "495209622347"
  },

	initFirebase: function(){
      emailjs.init("user_E6w9y3AjySOWMQGes6bIy");
	},

	setSnap: function(snap){
		app.model = snap;
		app.refreshName();
	},

	refreshName: function(){
	var users = $('#menu-options');
	users.html('');
	var codigo = '';
		for(var key in app.model.hoy){
			for(var key2 in app.model.hoy[key]){
				if (app.odd) {
					codigo += '<div class="name-odd" id="'+key+'" onclick="app.nextPage(this);">'+key2+'</div>';
					app.odd = 0;
				}
				else{
					codigo += '<div class="name-even" id="'+key+'" onclick="app.nextPage(this);">'+key2+'</div>';
					app.odd = 1;
				}
			}
		}
		users.append(codigo);
	},

	nextPage: function(data){
		document.getElementsByClassName('title-clients')[1].innerHTML = data.innerHTML + ', escoge aquí tu bebida';
		document.getElementsByClassName('title-clients')[1].id = data.id;
		document.getElementById('title').style.display = 'none';
		document.getElementById('menu-options').style.display = 'none';
		document.getElementById('menu').style.display = 'block';
		document.getElementsByClassName('glyphicon glyphicon-triangle-left')[0].style.display = 'inline';;
	},

	previousPage: function(){
		document.getElementById('menu').style.display = 'none';
		document.getElementsByClassName('glyphicon glyphicon-triangle-left')[0].style.display = 'none';
		document.getElementById('menu-options').style.display = 'block';
		document.getElementById('title').style.display = 'block';
	},

	saveOrder: function(opt){
		var user = document.getElementsByClassName('title-clients')[1].innerHTML.split(',')[0];
		var client = document.getElementsByClassName('title-clients')[1].id;
		console.log(user);
		var opts;
		var coment;
		var drink;
    switch(opt){
      case 1:
        opts = document.getElementsByClassName('options-refresh');
        coment = document.getElementById('refresh-comment').innerHTML;
        break;
      case 2:
        opts = document.getElementsByClassName('options-hot');
        coment = document.getElementById('hot-comment').innerHTML;
        break;
      case 3:
        opts = document.getElementsByClassName('options-soda');
        coment = document.getElementById('soda-comment').innerHTML;          
        break;
      case 4:
        opts = document.getElementsByClassName('options-alcol');
        coment = document.getElementById('alcol-comment').innerHTML;
        break;
    }
		for(var i=0; i<opts.length; i++){
			if (opts[i].checked) {
				drink = opts[i].id.replace(/-+/g,' ');
			}
		}
    app.quant += 1;
    if (app.quant <= 2) {
      var aux = {};
      aux[client] = {};
      aux[client][user] = {'Bebida':drink,'Coment':coment,'Cantidad':app.quant};
      app.order.push(aux);
      app.refreshCart();
      app.refreshShopping();
    }
  	else{
      alert('Sólo se permiten máximo dos bebidas por persona');
      app.quant = 0;
    }	
	},

	refreshShopping: function(){
		document.getElementById('number-order').innerHTML = app.order.length;
		if (app.order.length) {
			document.getElementById('number-order').className = 'label label-danger';
		}
		else{
			document.getElementById('number-order').className = 'label label-default';
		}
	},

	refreshCart: function(){
		var users = $('#user-body2');
		users.html('');
		var codigo = '<table class="table table-bordered"';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Empresa</th>';
						codigo += '<th>Nombre</th>';
						codigo += '<th>Bebida</th>';
                        codigo += '<th>Comentario</th>';
					codigo += '</tr>';
				for (var i=0; i<app.order.length; i++) {
					for(var key in app.order[i]){
						for(var key2 in app.order[i][key])
							codigo += '<tr onclick="app.idConfirm('+i+');" data-toggle="modal" data-target="#myModal7">';
								codigo += '<td>'+key+'</td>'
								codigo += '<td>'+key2+'</td>';
								codigo += '<td>'+app.order[i][key][key2]['Bebida']+'</td>';
		                        codigo += '<td>'+app.order[i][key][key2]['Coment']+'</td>';
							codigo += '</tr>';
                	}
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
	},

	idConfirm: function(data){
		document.getElementsByClassName('confirm')[0].id = data;
	},

	delOrder: function(){
		app.order.splice(document.getElementsByClassName('confirm')[0].id,1);
		app.refreshCart();
		app.refreshShopping();
	},

  saveComments: function(){
	  var cc = document.getElementById('client').innerHTML;
    var comment = document.getElementById('client-comment').value;
    var client = document.getElementById('client-name').innerHTML;
    for(var key in app.model.clients[cc]){
        if (key === client) {
            app.model.clients[cc][key]['Coment'] = comment;
            break;
        }
    }
    app.save();
    document.getElementById('client-comment').value = '';
    document.getElementById('client-name').innerHTML = 'Nombre';
    document.getElementById('client-drink').innerHTML = "Bebida";
    document.getElementById('client').innerHTML = "Empresa";
  },

	saveFirebase: function(){
    var aux = 1;
    for(var i=0; i<app.order.length; i++){
      for(var key in app.order[i]){
        for(var key2 in app.order[i][key]){
          if (aux) {
            app.model.clients[key][key2]['Bebida'] = [app.model.clients[key][key2]['Bebida']];
            app.model.clients[key][key2]['Coment'] = [app.model.clients[key][key2]['Coment']];
          }
          app.model.clients[key][key2]['Bebida'].push(app.order[i][key][key2]['Bebida']);
          app.model.clients[key][key2]['Coment'].push(app.order[i][key][key2]['Coment']);
        }
      }
      aux = 0;
    }
    firebase.database().ref('clients').update(app.model.clients);
	},

  sendMail: function(){
    var codigo = '<table class="table table-bordered"';
		codigo += '<tbody>';
			codigo += '<tr>';
				codigo += '<th>Empresa</th>';
				codigo += '<th>Nombre</th>';
				codigo += '<th>Bebida</th>';
                    codigo += '<th>Comentario</th>';
			codigo += '</tr>';
		for (var i=0; i<app.order.length; i++) {
			for(var key in app.order[i]){
				for(var key2 in app.order[i][key]){
					codigo += '<tr>';
						codigo += '<td>'+key+'</td>'
						codigo += '<td>'+key2+'</td>';
						codigo += '<td>'+app.order[i][key][key2]['Bebida']+'</td>';
            codigo += '<td>'+app.order[i][key][key2]['Coment']+'</td>';
					codigo += '</tr>';
        }
		  }
    }
			codigo += '</tbody>';
		codigo += '</table>';
      //emailjs.send("gmail","template_173DO73o",{message_html: codigo});
      app.saveFirebase();
  },
}

firebase.initializeApp(app.firebaseConfig);
firebase.database().ref().on('value', function(snap){
	if (snap.val() !== null) {
		app.setSnap(snap.val());
	}
});

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function(){
        app.initFirebase();
    }, false);
}

