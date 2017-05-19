var app = {

	model: {},

	modelMeet: {
		'titulo': '',
		'fecha': '',
		'users':[]
	},

	auxModelMeet: {
		'titulo': '',
		'fecha': '',
		'users':[]
	},

	order: [],

	meets: [],

	weekday: ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'],

	monthyear: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],

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
		app.refreshData();
		app.refreshMeets();
	},

	refreshName: function(data){
		var users = $('#menu-options');
		users.html('');
		var codigo = '';
		for(var i=0; i<app.model.meetings[data]['users'].length; i++){
			if (app.odd) {
				codigo += '<div class="name-odd" id="'+app.model.meetings[data]['users'][i]['Cliente']+'_'+data+'" onclick="app.nextPage(this);">'+app.model.meetings[data]['users'][i]['Nombre']+'</div>';
				app.odd = 0;
			}
			else{
				codigo += '<div class="name-even" id="'+app.model.meetings[data]['users'][i]['Cliente']+'_'+data+'" onclick="app.nextPage(this);">'+app.model.meetings[data]['users'][i]['Nombre']+'</div>';
				app.odd = 1;
			}
		}
		codigo += '<div data-toggle="modal" data-target="#myModal12" style="padding:5%;padding-bottom:20%;font-size:20px;border-color:#004f64;text-align:center;">Agregar Persona <b>+</b></div>';
		app.odd = 0;
		codigo += '<div id="meet-id" style="display:none;">'+data+'</div>';
		users.append(codigo);
		app.modelMeet = app.model.meetings[data];
	},

	refreshMeets: function(){
		var users = $('#meets');
		var today = new Date();
		users.html('');
		var codigo = '';
		var codigo = '<table class="table table-bordered" id="guests3">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Fecha</th>';
						codigo += '<th>Hora</th>';
						codigo += '<th>Título</th>';
					codigo += '</tr>';
				for (var key in app.model.meetings) {
					codigo += '<tr onclick="app.userPage('+"'"+key+"'"+');" data-dismiss="modal">';
						var dd = app.model.meetings[key]['fecha'].split(' ');
						var datee = dd[0].split('/');
						var dait = new Date(datee[2],datee[0]-1,datee[1]);
						var today = new Date();
						if (dait.toDateString() === today.toDateString()) {
							codigo += '<td>Hoy</td>';
						}
						else{
							codigo += '<td>'+app.weekday[dait.getDay()]+' '+dait.getDate()+' '+app.monthyear[dait.getMonth()]+'</td>';
						}
						codigo += '<td>'+dd[1]+' '+dd[2]+' - '+dd[4]+' '+dd[5]+'</td>';
						codigo += '<td>'+app.model.meetings[key]['titulo']+'</td>';
					codigo += '</tr>';
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
	},

	meetPage: function(){
		app.refreshMeets();
		document.getElementById('back').style.display = 'none';
		document.getElementById('back2').style.display = 'none';
		document.getElementById('menu-options').style.display = 'none';
		document.getElementById('title').style.display = 'block';
		document.getElementById('title').innerHTML = 'Vive la experiencia Soutec';
		document.getElementById('menu-meetings').style.display = 'block';
	},

	userPage: function(data){
		app.refreshName(data);
		document.getElementById('back').style.display = 'inline';
		document.getElementById('back2').style.display = 'inline';
		$('#back').attr("onclick","app.meetPage()");
		document.getElementById('menu-options').style.display = 'block';
		document.getElementById('title').style.display = 'block';
		document.getElementById('title').innerHTML = '¡Bienvenido! Por favor seleccione su nombre';
		document.getElementById('menu-meetings').style.display = 'none';
		document.getElementById('menu').style.display = 'none'
	},

	nextPage: function(data){
		var next = data.id.split(/_(.+)/)[0];
		var prev = data.id.split(/_(.+)/)[1];
		document.getElementsByClassName('title-clients')[1].innerHTML = '<span style="font-style:italic;color:#00a5ba;font-size:24px;">' + data.innerHTML + '</span>, escoge aquí tu bebida';
		document.getElementsByClassName('title-clients')[1].id = next;
		document.getElementById('title').style.display = 'none';
		document.getElementById('menu-options').style.display = 'none';
		document.getElementById('menu').style.display = 'block';
		document.getElementById('back').style.display = 'inline';
		document.getElementById('back2').style.display = 'inline';
		$('#back').attr("onclick","app.userPage('"+prev+"')");
	},

	previousPage: function(){
		document.getElementById('menu').style.display = 'none';
		document.getElementById('menu-options').style.display = 'block';
		document.getElementById('title').style.display = 'block';
	},

	saveOrder: function(opt){
		var user = document.getElementsByClassName('title-clients')[1].innerHTML.split('>')[1].split('<')[0];
		var client = document.getElementsByClassName('title-clients')[1].id;
		var opts;
		var coment;
		var drink;
		switch(opt){
		  case 1:
		    opts = document.getElementsByClassName('options-refresh');
		    coment = document.getElementById('refresh-comment').value;
		    if (document.getElementById('ice2').checked) {
		    	coment = document.getElementById('ice2').value+'. '+coment;
		    }  
		    break;
		  case 2:
		    opts = document.getElementsByClassName('options-hot');
		    coment = document.getElementById('hot-comment').value;
		    if (document.getElementById('sugar1').checked) {
		    	coment = document.getElementById('sugar1').value+'. '+coment;
		    }
		    else if (document.getElementById('sugar2').checked) {
		    	coment = document.getElementById('sugar2').value+'. '+coment;
		    }
		    else if (document.getElementById('sugar3').checked) {
		    	coment = document.getElementById('sugar3').value+'. '+coment;
		    }
		    if (document.getElementById('sugar4').checked) {
		    	coment = coment.replace('azucar','splenda');
		    }
		    else if (document.getElementById('sugar5').checked) {
		    	coment = document.getElementById('sugar3').value+'. '+coment;
		    }
		    break;
		  case 3:
		    opts = document.getElementsByClassName('options-soda');
		    coment = document.getElementById('soda-comment').value;
		    if (document.getElementById('ice').checked) {
		    	coment = document.getElementById('ice').value+'. '+coment;
		    }        
		    break;
		  case 4:
		    opts = document.getElementsByClassName('options-alcol');
		    coment = document.getElementById('alcol-comment').value;
		    if (document.getElementById('ice3').checked) {
		    	coment = document.getElementById('ice3').value+'. '+coment;
		    }
		    if (document.getElementById('water').checked) {
		    	coment = document.getElementById('water').value+'. '+coment;
		    }
		    if (document.getElementById('soda').checked) {
		    	coment = document.getElementById('soda').value+'. '+coment;
		    }
		    if (document.getElementById('aguakina').checked) {
		    	coment = document.getElementById('aguakina').value+'. '+coment;
		    }
		    if (document.getElementById('chinott').checked) {
		    	coment = document.getElementById('chinott').value+'. '+coment;
		    }
		    if (document.getElementById('coke').checked) {
		    	coment = document.getElementById('coke').value+'. '+coment;
		    }
		    if (document.getElementById('lemon').checked) {
		    	coment = document.getElementById('lemon').value+'. '+coment;
		    }
		    break;
		}	
		for(var i=0; i<opts.length; i++){
			if (opts[i].checked) {
				drink = opts[i].id.replace(/-+/g,' ');
			}
		}
		var aux2 = 0;
		for(var i=0; i<app.order.length; i++){
			for(var key in app.order[i]){
				if (key === client) {
					for(var key2 in app.order[i][client]){
						if (key2 === user) {
							var cant = app.order[i][client][user]['Cantidad'];
							aux2 = 1;
							break;
						}
					}
				}
			}
		}
		if (!aux2) {
			var cant = 0;
		}
		cant += 1;
		if (cant <= 2) {
		  var aux = {};
		  aux[client] = {};
		  aux[client][user] = {'Bebida':drink,'Coment':coment,'Cantidad':cant};
		  app.order.push(aux);
		  app.refreshCart();
		  app.refreshShopping();
		  alert('Pedido anotado');
		}
		else{
		  alert('Sólo se permiten máximo dos bebidas por persona');
		}
	},

	refreshShopping: function(){
		document.getElementById('number-order').innerHTML = app.order.length;
		if (app.order.length) {
			document.getElementsByClassName('badge-pill')[0].style.display = 'block';
			document.getElementsByClassName('badge-pill')[0].style.backgroundColor = '#e80303';
		}
		else{
			document.getElementsByClassName('badge-pill')[0].style.display = 'none';
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
						for(var key2 in app.order[i][key]){
							codigo += '<tr onclick="app.idConfirm('+i+');" data-toggle="modal" data-target="#myModal7">';
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
		users.append(codigo);
	},

	refreshData: function(){
		var clients = $('#clients-modal');
		var clients2 = $('#clients-modal2');
		clients.html('');
		clients2.html('');
		var codigo = '';
		var codigo2 = '';
		codigo += '<ul class="nav nav-list">';
		codigo2 += '<ul class="nav nav-list">';
		for(var key in app.model.clients){
			codigo += '<li>';
			codigo2 += '<li>';
				codigo += '<label class="tree-toggle nav-header">'+key+'</label>';
				codigo2 += '<label class="tree-toggle nav-header">'+key+'</label>';
				codigo += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
				codigo2 += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
				codigo += '<ul class="nav nav-list tree">';
				codigo2 += '<ul class="nav nav-list tree">';
				for(var key2 in app.model.clients[key]){
					codigo += '<li id="'+key+'_'+key2+'" data-dismiss="modal" onclick="app.addUser(this);">&nbsp;&nbsp;&nbsp;<i class="fa fa-circle-o"></i>&nbsp;'+key2+'</li>';
					codigo2 += '<li id="'+key+'_'+key2+'" data-dismiss="modal" onclick="app.addUserMeet(this);">&nbsp;&nbsp;&nbsp;<i class="fa fa-circle-o"></i>&nbsp;'+key2+'</li>';
				}
				codigo += '</ul>';
				codigo2 += '</ul>';
			codigo += '</li>';
			codigo2 += '</li>';
		}
		codigo += '</ul>';
		codigo2 += '</ul>';
		clients.append(codigo);
		clients2.append(codigo2);
		$('.tree-toggle').click(function () {
			$(this).parent().children('ul.tree').toggle(200);
		});
		$('.tree-toggle').parent().children('ul.tree').toggle(200);
	},

	addUser: function(data){
		var dato = data.id
		var args = dato.split("_");
		$('#invited').attr('value',args[1]);
		$('.ocult').attr('id',args[0]);
	},

	addUserMeet: function(data){
		var dato = data.id
		var args = dato.split("_");
    	document.getElementById('name-clients2').value = args[0];
        document.getElementById('name-client2').value = args[1];
        document.getElementById('email-client2').value = app.model.clients[args[0]][args[1]]['Email'];
	},

	addClient: function(){
		var aux = 0;
		var user = document.getElementById('invited').value;
		var client = document.getElementsByClassName('ocult')[0].id;
		if(user){
			for(var i=0; i<app.auxModelMeet['users'].length; i++) {
				if(app.auxModelMeet['users'][i]['Nombre'] === user && app.auxModelMeet['users'][i]['Cliente'] === client){
					alert('Ya se agregó esta persona a la reunión');
					aux = 1;
					break;
				}
			}
			if (!aux) {
				app.auxModelMeet['users'].push({'Nombre':user,'Cliente':client});
			}
			app.refreshMeeting();
			app.refreshMeetingModal();
		}
	},

	refreshMeeting: function(){;
		var users = $('#info-meet');
		users.html('');
		var codigo = '';
		codigo += '<label>Invitados para la reunión:</label>';
		for(var i=0; i<app.auxModelMeet['users'].length; i++){
			codigo += '<div class="input-group">';
				codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
				codigo += '<input type="text" class="form-control" value="'+app.auxModelMeet['users'][i]['Nombre']+'" style="width:100%;" id="" disabled="">';
				codigo += '<span id="ocult" style="display: none;" class='+app.auxModelMeet['users'][i]['Cliente']+'></span>';
			codigo += '</div><br>';
		}
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" style="width:100%;" data-toggle="modal" data-target="#modalclientes" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		if (app.auxModelMeet['users'].length > 0) {
			document.getElementById('borrar-button').disabled = false;
			document.getElementById('guardar-button').disabled = false;
		}
		users.append(codigo);	
	},

    saveName: function(){
    	var client = document.getElementById('name-clients').value;
        var name = document.getElementById('name-client').value;
        var email = document.getElementById('email-client').value;
        var aux = 0;
        for(var key in app.model.clients){
            if (key === client) {
                for(var key2 in app.model.clients[client]){
                	if (key2 === name){
                		alert('Esta persona ya está registrada');
                		aux = 1;
                	}
                }
            }
        }
        if (!aux) {
        	app.saveFirebase2(client,name,email);
	        app.modelMeet['users'].push({'Nombre':name,'Cliente':client});
			$('#invited').attr('value',name);
			$('.ocult').attr('id',client);
			app.refreshMeeting();
			app.refreshMeetingModal();
        }
        document.getElementById('name-clients').value = '';
        document.getElementById('name-client').value = '';
        document.getElementById('email-client').value = '';
    },

    saveNameMeet: function(){
    	var client = document.getElementById('name-clients2').value;
        var name = document.getElementById('name-client2').value;
        var email = document.getElementById('email-client2').value;
        var id = document.getElementById('meet-id').innerHTML;
        var aux = 0;
        for(var key in app.model.clients){
            if (key === client) {
                for(var key2 in app.model.clients[client]){
                	if (key2 === name){
                		aux = 1;
                		break;
                	}
                }
            }
        }
        if (!aux) {
        	app.saveFirebase2(client,name,email);
        }
        app.modelMeet['users'].push({'Nombre':name,'Cliente':client});
        app.model.meetings[id] = app.modelMeet;
        app.saveFirebase3(id);
        app.refreshName(id);
        document.getElementById('name-clients').value = '';
        document.getElementById('name-client').value = '';
        document.getElementById('email-client').value = '';
    },

	saveFirebase2: function(client,name,email){
		firebase.database().ref('clients').child(client).child(name).update({Bebida:[''],Coment:[''],Email:email});
	},

	saveFirebase3: function(id){
		firebase.database().ref('meetings').child(id).child('users').set(app.modelMeet['users']);
	},

	refreshMeetingModal: function(){
		var users = $('#user-body3');
		users.html('');
		var codigo = '<table class="table table-bordered" id="guests">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Empresa</th>';
						codigo += '<th>Nombre</th>';
					codigo += '</tr>';
				for (var i=0; i<app.auxModelMeet['users'].length; i++) {
					codigo += '<tr onclick="app.idConfirm('+app.auxModelMeet['users'][i]['Cliente']+'_'+app.auxModelMeet['users'][i]['Nombre']+');" data-toggle="modal" data-target="#myModal3">';
						codigo += '<td>'+app.auxModelMeet['users'][i]['Cliente']+'</td>';
						codigo += '<td>'+app.auxModelMeet['users'][i]['Nombre']+'</td>';
					codigo += '</tr>';
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
		if (!app.auxModelMeet['users'][0]) {
			app.delMeet();
		}
	},

	sendMeet: function(){
		$('#myModal9').modal('hide');
		app.auxModelMeet['titulo'] = document.getElementById('title-meet').value;
		var today = new Date();
		var month = today.getMonth()+1;
		var hour = today.getHours();
		var hour2 = hour+1;
		var amopm = 'AM';
		var amopm2 = 'AM';
		if (month < 10) {
			month = '0'+month;
		}
		if (hour >= 12) {
			amopm = 'PM';
			if (hour > 12) {
				hour -= 12;
			}
		}
		if (hour2 >= 12) {
			amopm2 = 'PM';
			if (hour2 > 12) {
				hour2 -= 12;
			}
		}
		app.auxModelMeet['fecha'] = month+'/'+today.getDate()+'/'+today.getFullYear()+' '+hour+':'+today.getMinutes()+' '+amopm+' - ';
		app.auxModelMeet['fecha'] += hour2+':'+today.getMinutes()+' '+amopm2;
		firebase.database().ref('meetings').push(app.auxModelMeet);
		for(var key in app.model.meetings){
			if (app.model.meetings[key]['titulo'] === document.getElementById('title-meet').value && app.model.meetings[key]['fecha'] === '') {
				app.userPage(key);
			}
		}
	},

	delMeet: function(){
		var users = $('#info-meet');
		users.html('');
		var codigo = '';
		codigo += '<label>Invitados para la reunión:</label>';
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" style="width:100%;" data-toggle="modal" data-target="#modalclientes" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		users.append(codigo);
		document.getElementById('borrar-button').disabled = true;
		document.getElementById('guardar-button').disabled = true;
		app.auxModelMeet['users'] = [];
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
	    for(var i=0; i<app.order.length; i++){
	      for(var key in app.order[i]){
	        for(var key2 in app.order[i][key]){
	        	if (app.model.clients[key][key2]['Bebida'][0] === '') {
	        		app.model.clients[key][key2]['Bebida'] = [app.order[i][key][key2]['Bebida']];
	        		app.model.clients[key][key2]['Coment'] = [app.order[i][key][key2]['Coment']];
	        	}
	        	else{
			        app.model.clients[key][key2]['Bebida'].push(app.order[i][key][key2]['Bebida']);
			        app.model.clients[key][key2]['Coment'].push(app.order[i][key][key2]['Coment']);
	        	}
	        }
	      }
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
		if (app.order.length > 0) {
			var hoy = new Date();
			hoy = hoy.toDateString();
			if (app.model.order['fecha'] === hoy) {
				var aux = app.model.order['orders'];
				for (var i=0; i<app.order.length; i++) {
				aux.push(app.order[i]);
				}
				firebase.database().ref().update({order:{'fecha':hoy,'orders':aux}});
			}
			else{
				firebase.database().ref().update({order:{'fecha':hoy,'orders':app.order}});
			}
			//emailjs.send("gmail","template_173DO73o",{message_html: codigo});
			alert('Pedido enviado');
			app.saveFirebase();
		}
		app.order = [];
		app.refreshCart();
		app.refreshShopping();
		app.previousPage();
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
    	FastClick.attach(document.body);
        app.initFirebase();
    }, false);
}

