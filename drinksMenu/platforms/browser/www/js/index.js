var app = {

	model: {
		"clients": []
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
  		firebase.initializeApp(firebaseConfig);
  	},

	addUser: function(){
		var data = document.getElementById('name-user').value;
		if (data) {
			app.model.clients.push({'Nombre':data,'Bebida':''});
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
		for (var i = 0; i < app.model.clients.length; i++) {
			var codigo = '';
			codigo += '<div class="input-group">';
				codigo += '<span class="input-group-addon"><i class="fa fa-user"></i></span>';
				codigo += '<input type="text" class="form-control" placeholder="'+app.model.clients[i].Nombre+'" disabled="">';
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
				for (var i = 0; i < app.model.clients.length; i++) {
					codigo += '<tr>';
						codigo += '<td>'+app.model.clients[i].Nombre+'</td>';
						codigo += '<td></td>';
					codigo += '</tr>';
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
	},

	saveFirebase: function(){
		var ref = firebase.storage().ref('clients.json');
		ref.putString(JSON.stringify(app.model));
	}

}

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function(){
        app.initFirebase();
    }, false);
}
