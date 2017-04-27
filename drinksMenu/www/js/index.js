var app = {

	model: {},

	order: [],

	odd: 0,

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

  	saveOrder: function(){
  		var user = document.getElementsByClassName('title-clients')[1].innerHTML.split(',')[0];
  		var client = document.getElementsByClassName('title-clients')[1].id;
  		var opts = document.getElementsByClassName('options-hot');
  		var coment = document.getElementById('hot-comment').innerHTML;
  		var drink;
  		for(var i=0; i<opts.length; i++){
  			if (opts[i].checked) {
  				drink = opts[i].id.replace(/-+/g,' ');
  			}
  		}
  		var aux = {};
  		aux[client] = {};
  		aux[client][user] = {'Bebida':drink,'Coment':coment};
  		app.order.push(aux);
  		app.refreshCart();
  		app.refreshShopping();
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
		firebase.database().ref('clients').push(app.model.clients);
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
						for(var key2 in app.order[i][key])
							codigo += '<tr>';
								codigo += '<td>'+key+'</td>'
								codigo += '<td>'+key2+'</td>';
								codigo += '<td>'+app.order[i][key][key2]['Bebida']+'</td>';
		                        codigo += '<td>'+app.order[i][key][key2]['Coment']+'</td>';
							codigo += '</tr>';
                	}
				}
				codigo += '</tbody>';
			codigo += '</table>';
        emailjs.send("gmail","template_173DO73o",{message_html: codigo});
        //app.saveFirebase();
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

