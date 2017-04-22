var app = {

	model: {
		"clients": {},
	},

	firebaseConfig: {
	    apiKey: "AIzaSyC50skbZWPdmbhMgSz9ulM8pBJ8r8F8lag",
	    authDomain: "drinksmenu-ab56b.firebaseapp.com",
	    databaseURL: "https://drinksmenu-ab56b.firebaseio.com",
	    projectId: "drinksmenu-ab56b",
	    storageBucket: "drinksmenu-ab56b.appspot.com",
	    messagingSenderId: "495209622347"
  	},

  	initFirebase: function(){
  		firebase.initializeApp(app.firebaseConfig);
        emailjs.init("user_E6w9y3AjySOWMQGes6bIy");

        //firebase.database().ref('clients').set({Avior:{Fabio:{Bebida:"Te"},Ronel:{Bebida:"Coca-Cola"}}});
        firebase.database().ref('clients').child("Avior").child("Ronel").remove();
  	},

    gotData: function(data){
        console.log(data.val());
    },

    errData: function(err){
        console.log(err);
    },

	addUser: function(){
		var data = document.getElementById('name-user').value;
		if (data) {
			app.model.clients[data] = {};
            app.model.clients[data]['Bebida'] = '';
			app.refreshModal();
		}
	},

	delUser: function(){
		app.model.pop();
		app.refreshModal();
	},

	refreshModal: function(){
		var users = $('#user-body');
		users.html('');
		for (var key in app.model.clients) {
			var codigo = '';
			codigo += '<div class="input-group">';
				codigo += '<span class="input-group-addon"><i class="fa fa-user"></i></span>';
				codigo += '<input type="text" class="form-control" placeholder="'+key+'" disabled="">';
			codigo += '</div>';
			codigo += '<br>';
			users.append(codigo);
		}
		var codigo = '';
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><i class="fa fa-user"></i></span>';
			codigo += '<input type="text" class="form-control" placeholder="Nombre" id="name-user">'
		codigo += '</div>';
		users.append(codigo);
	},

	save: function(){
		var users = $('#user-body2');
		users.html('');
		var codigo = '<table class="table table-bordered"';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Nombre</th>';
						codigo += '<th>Bebida</th>';
					codigo += '</tr>';
				for (var key in app.model.clients) {
					codigo += '<tr>';
						codigo += '<td>'+key+'</td>';
						codigo += '<td>'+app.model.clients[key]['Bebida']+'</td>';
					codigo += '</tr>';
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
	},

	saveFirebase: function(){
		firebase.database().ref('clients').push(app.model.clients);
	},

	selectDrink: function(dat){
		var client = document.getElementById('client-name').innerHTML;
		for (var key in app.model.clients) {
			if (key === client){
				app.model.clients[key]['Bebida'] = dat.id;
				break;
			} 
		}
		app.refreshDrink(client);
        app.save();
	},

	loadClients: function(){
		var users = $('#menu-clients');
		users.html('');
		for (var key in app.model.clients) {
			var codigo = '';
			codigo += '<div class="radio" onclick="app.refreshClient(this);" id="'+key+'" data-dismiss="modal">';
				codigo += '<label>';
					codigo += '<input type="radio" value="'+key+'">';
					codigo += key;
				codigo += '</label>';
			codigo += '</div>';
			codigo += '<br>';
			users.append(codigo);
		}
	},

	refreshClient: function(dat){
		document.getElementById('client-name').innerHTML = dat.id;
		app.refreshDrink(dat.id);
	},

	refreshDrink: function(client){
		var aux = 0;
		for (var key in app.model.clients) {
			if (key === client){
				if (app.model.clients[key]['Bebida']) {
					document.getElementById('client-drink').innerHTML = app.model.clients[key]['Bebida'];
					aux = 1;
				}
				break;
			} 
		}
		if (!aux) {
			document.getElementById('client-drink').innerHTML = "No ha seleccionado bebida";
		}
	},

    sendMail: function(){
        var codigo = '<table class="table table-bordered"';
                codigo += '<tbody>';
                    codigo += '<tr>';
                        codigo += '<th>Nombre</th>';
                        codigo += '<th>Bebida</th>';
                    codigo += '</tr>';
                for (var key in app.model.clients) {
                    codigo += '<tr>';
                        codigo += '<td>'+key+'</td>';
                        codigo += '<td>'+app.model.clients[key]['Bebida']+'</td>';
                    codigo += '</tr>';
                }
                codigo += '</tbody>';
            codigo += '</table>';
        //emailjs.send("gmail","template_173DO73o",{message_html: codigo});
        app.saveFirebase();
    },

}

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function(){
        app.initFirebase();
    }, false);
}

