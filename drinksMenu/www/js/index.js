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

	inventory: {},

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
		app.inventory = snap.inventory;
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
		app.order = [];
		app.refreshCart();
		app.refreshShopping();
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
		$('#back2').attr("onclick","app.meetPage()");
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
		$('#back2').attr("onclick","app.userPage('"+prev+"')");
	},

	previousPage: function(){
		document.getElementById('menu').style.display = 'none';
		document.getElementById('menu-options').style.display = 'block';
		document.getElementById('title').style.display = 'block';
	},

	saveOrder: function(opt){
		var user = document.getElementsByClassName('title-clients')[1].innerHTML.split('>')[1].split('<')[0];
		var client = document.getElementsByClassName('title-clients')[1].id;
		var meetId = document.getElementById('meet-id').innerHTML;
		var opts;
		var coment;
		var drink;
		var alcohol = 0;
		switch(opt){
		  case 1:
		    opts = document.getElementsByClassName('options-refresh');
		    coment = document.getElementById('refresh-comment').value;
		    if (document.getElementById('ice2').checked) {
		    	coment = document.getElementById('ice2').value+'.'+coment;
		    }  
		    break;
		  case 2:
		    opts = document.getElementsByClassName('options-hot');
		    coment = document.getElementById('hot-comment').value;
		    if (document.getElementById('sugar1').checked) {
		    	coment = document.getElementById('sugar1').value+'.'+coment;
		    }
		    else if (document.getElementById('sugar2').checked) {
		    	coment = document.getElementById('sugar2').value+'.'+coment;
		    }
		    else if (document.getElementById('sugar3').checked) {
		    	coment = document.getElementById('sugar3').value+'.'+coment;
		    }
		    if (document.getElementById('sugar4').checked) {
		    	coment = coment.replace('azucar','splenda');
		    }
		    else if (document.getElementById('sugar5').checked) {
		    	coment = document.getElementById('sugar5').value+'.'+coment;
		    }
		    break;
		  case 3:
		    opts = document.getElementsByClassName('options-soda');
		    coment = document.getElementById('soda-comment').value;
		    if (document.getElementById('ice').checked) {
		    	coment = document.getElementById('ice').value+'.'+coment;
		    }        
		    break;
		  case 4:
		  	alcohol = 1;
		    opts = document.getElementsByClassName('options-alcol');
		    coment = document.getElementById('alcol-comment').value;
		    if (document.getElementById('ice3').checked) {
		    	coment = document.getElementById('ice3').value+'.'+coment;
		    }
		    if (document.getElementById('water').checked) {
		    	coment = document.getElementById('water').value+'.'+coment;
		    }
		    if (document.getElementById('soda').checked) {
		    	coment = document.getElementById('soda').value+'.'+coment;
		    }
		    if (document.getElementById('aguakina').checked) {
		    	coment = document.getElementById('aguakina').value+'.'+coment;
		    }
		    if (document.getElementById('chinott').checked) {
		    	coment = document.getElementById('chinott').value+'.'+coment;
		    }
		    if (document.getElementById('coke').checked) {
		    	coment = document.getElementById('coke').value+'.'+coment;
		    }
		    if (document.getElementById('lemon').checked) {
		    	coment = document.getElementById('lemon').value+'.'+coment;
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
				if (key === user) {
					if (app.order[i][user]['client'] === client) {
						var cant = app.order[i][user]['Cantidad'];
						aux2 = 1;
						break;
					}
				}
			}
		}
		if (!aux2) {
			var cant = 0;
		}
		cant += 1;
		var fecha = new Date();
		var h = fecha.getHours();
		var m = fecha.getMinutes();
		var hora = h+':'+m;
		if (cant <= 2) {
			if (alcohol) {
				for(var k=0; k<app.model.meetings[meetId]['users'].length; k++) {
					if (app.model.meetings[meetId]['users'][k]['Nombre']===user) {
						if (app.model.meetings[meetId]['users'][k]['Tipo']==='vip') {
							var aux = {};
							aux[user] = {};
							aux[user] = {'Bebida':drink,'Coment':coment,'Cantidad':cant,'meetId':meetId,'entregado':0,'client':client,'hora':hora};
							app.order.push(aux);
							app.refreshCart();
							app.refreshShopping();
							alert('Pedido anotado');
							break;
						}
						else{
							alert('Lo sentimos, las bebidas alcohólicas son exclusivas para clientes V.I.P.');
							break;
						}
					}
				}
			}
			else{
				var aux = {};
				aux[user] = {};
				aux[user] = {'Bebida':drink,'Coment':coment,'Cantidad':cant,'meetId':meetId,'entregado':0,'client':client,'hora':hora};
				app.order.push(aux);
				app.refreshCart();
				app.refreshShopping();
				alert('Pedido anotado');
			}
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
							codigo += '<tr onclick="app.idConfirm('+i+');" data-toggle="modal" data-target="#myModal7">';
								codigo += '<td>'+app.order[i][key]['client']+'</td>';
								codigo += '<td>'+key+'</td>'
								codigo += '<td>'+app.order[i][key]['Bebida']+'</td>';
		                        codigo += '<td>'+app.order[i][key]['Coment']+'</td>';
							codigo += '</tr>';
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
		var type;
		var user = document.getElementById('invited').value;
		var client = document.getElementsByClassName('ocult')[0].id;
		opts = document.getElementsByClassName('options');
		for(var i=0; i<opts.length; i++){
			if (opts[i].checked) {
				type = opts[i].id;
			}
		}
		if(user){
			for(var i=0; i<app.modelMeet['users'].length; i++) {
				if(app.modelMeet['users'][i]['Nombre'] === user && (app.modelMeet['users'][i]['Cliente'] === client || app.modelMeet['users'][i]['Cliente'] === client.replace(' ',''))){
					alert('Ya se agregó esta persona a la reunión');
					aux = 1;
					break;
				}
			}
			if (!aux) {
				try{
					var car = app.model['clients'][client][user]['Caract'];
				}
				catch(err){
					var car = app.model['clients'][client.replace(' ','')][user]['Caract'];
				}
				app.modelMeet['users'].push({'Nombre':user,'Cliente':client,'Caract':car,'Tipo':type});
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
		for(var i=0; i<app.modelMeet['users'].length; i++){
			codigo += '<div class="input-group" style="width:62.5%;">';
				codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
				codigo += '<input type="text" class="form-control" value="'+app.modelMeet['users'][i]['Nombre']+'" id="" disabled="">';
				codigo += '<span id="ocult" style="display: none;" class='+app.modelMeet['users'][i]['Cliente']+'></span>';
			codigo += '</div><br>';
		}
		if (app.modelMeet['users'].length > 0) {
			document.getElementById('guardar-button').disabled = false;
			document.getElementById('borrar-button').disabled = false;
		}
		codigo += '<div class="input-group" style="width:62.5%;">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" data-toggle="modal" data-target="#modalclientes" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
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
		app.modelMeet['fecha'] = month+'/'+today.getDate()+'/'+today.getFullYear()+' '+hour+':'+today.getMinutes()+' '+amopm+' - ';
		app.modelMeet['fecha'] += hour2+':'+today.getMinutes()+' '+amopm2;
		app.modelMeet['sala'] = document.getElementById('room-meet').value;
		app.modelMeet['titulo'] = document.getElementById('title-meet').value;
		app.modelMeet['tech'] = {video:0,sound:0,laser:0,comment:''};
		app.modelMeet['mat'] = {brochures:0,brochurep:0,notebook:0,pens:0,magazine:0};
		if (document.getElementById('video').checked) {
	    	app.modelMeet['tech']['video'] = 1;
	    }
	    if (document.getElementById('sound').checked) {
	    	app.modelMeet['tech']['sound'] = 1;
	    }
	    if (document.getElementById('laser').checked) {
	    	app.modelMeet['tech']['laser'] = 1;
	    }
	    app.modelMeet['mat']['brochures'] = document.getElementById('brochures').value;
	    app.modelMeet['mat']['brochurep'] = document.getElementById('brochurep').value;
	    app.modelMeet['mat']['notebook'] = document.getElementById('notebook').value;
	    app.modelMeet['mat']['pens'] = document.getElementById('pens').value;
	    app.modelMeet['mat']['magazine'] = document.getElementById('magazine').value;
	    app.modelMeet['tech']['comment'] = '';
		var users = $('#user-body3');
		users.html('');
		var codigo = '<div id="" class="confirmmeet">¿Deseas programar esta reunión?</div><br>';
			codigo += '<div>Título: '+app.modelMeet['titulo']+'</div>';
			codigo += '<div>Sala: '+app.modelMeet['sala']+'</div>';
			codigo += '<div>Fecha: '+app.modelMeet['fecha']+'</div>';
			codigo += '<div>Tecnología: </div>';
				if (app.modelMeet['tech']['video']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Video Beam</div>';
				}
				if (app.modelMeet['tech']['sound']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cornetas</div>';
				}
				if (app.modelMeet['tech']['laser']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apuntador</div>';
				}
				if (app.modelMeet['tech']['comment']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+app.modelMeet['tech']['comment']+'</div>';
				}
			codigo += '<div>Materiales POP:</div>';
				if (app.modelMeet['mat']['brochures'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brochure Soutec: '+app.modelMeet['mat']['brochures']+'</div>';
				}
				if (app.modelMeet['mat']['brochurep'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brochure Proyecto U: '+app.modelMeet['mat']['brochurep']+'</div>';
				}
				if (app.modelMeet['mat']['notebook'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cuadernos Soutec: '+app.modelMeet['mat']['notebook']+'</div>';
				}
				if (app.modelMeet['mat']['pens'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bolígrafos: '+app.modelMeet['mat']['pens']+'</div>';
				}
				if (app.modelMeet['mat']['magazine'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Revistas: '+app.modelMeet['mat']['magazine']+'</div>';
				}
			codigo += '<div>Invitados:</div>';
			codigo += '<table class="table table-bordered" id="guests">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Empresa</th>';
						codigo += '<th>Nombre</th>';
					codigo += '</tr>';
				for (var i=0; i<app.modelMeet['users'].length; i++) {
					codigo += '<tr onclick="app.idConfirm(this)" id="'+app.modelMeet['users'][i]['Cliente'].replace(' ','-')+'_'+app.modelMeet['users'][i]['Nombre'].replace(' ','-')+'" data-toggle="modal" data-target="#myModal16">';
						codigo += '<td>'+app.modelMeet['users'][i]['Cliente']+'</td>';
						codigo += '<td>'+app.modelMeet['users'][i]['Nombre']+'</td>';
					codigo += '</tr>';
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
		if (!app.modelMeet['users'][0]) {
			app.delMeet();
		}
	},

	sendMeet: function(){
  		var h2 = app.modelMeet['fecha'].split(' ');
  		var tit = app.modelMeet['titulo'];
  		var fec = app.modelMeet['fecha'].split(' ')[0];
		for(var key in app.model.meetings){
  			if (app.model.meetings[key]['titulo']===tit) {
  				if (app.model.meetings[key]['fecha'].split(' ')[0]===fec) {
  					var h1 = app.model.meetings[key]['fecha'].split(' ');
  					var hora1 = h1[1]+' '+h1[2];
  					var hora2 = h2[1]+' '+h2[2];
  					if (hora1 === hora2) {
  						firebase.database().ref('meetings').child(key).remove();
  						break;
  					}
  				}
  			}
  		}
		firebase.database().ref('meetings').push(app.modelMeet);
		var color = 0;
		var codigo = '<div>Título: '+app.modelMeet['titulo']+'</div>';
			codigo += '<div>Sala: '+app.modelMeet['sala']+'</div>';
			codigo += '<div>Fecha: '+app.modelMeet['fecha']+'</div>';
			codigo += '<div>Tecnología: </div>';
				if (app.modelMeet['tech']['video']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Video Beam</div>';
				}
				if (app.modelMeet['tech']['sound']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cornetas</div>';
				}
				if (app.modelMeet['tech']['laser']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apuntador</div>';
				}
				if (app.modelMeet['tech']['comment']) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+app.modelMeet['tech']['comment']+'</div>';
				}
			codigo += '<div>Materiales POP:</div>';
				if (app.modelMeet['mat']['brochures'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brochure Soutec: '+app.modelMeet['mat']['brochures']+'</div>';
				}
				if (app.modelMeet['mat']['brochurep'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brochure Proyecto U: '+app.modelMeet['mat']['brochurep']+'</div>';
				}
				if (app.modelMeet['mat']['notebook'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cuadernos Soutec: '+app.modelMeet['mat']['notebook']+'</div>';
				}
				if (app.modelMeet['mat']['pens'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bolígrafos: '+app.modelMeet['mat']['pens']+'</div>';
				}
				if (app.modelMeet['mat']['magazine'] != 0) {
					codigo += '<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Revistas: '+app.modelMeet['mat']['magazine']+'</div>';
				}
			codigo += '<div>Invitados:</div>';
			codigo += '<table style="color:#383838;">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th style="background:#395062;color:#fff;">Empresa</th>';
						codigo += '<th style="background:#395062;color:#fff;">Nombre</th>';
					codigo += '</tr>';
				for (var i=0; i<app.modelMeet['users'].length; i++) {
					if (color) {
					codigo += '<tr style="background:#eaeaea;">';
						color = 0;	
					}
					else{
					codigo += '<tr>';
						color = 1;
					}
						codigo += '<td>'+app.modelMeet['users'][i]['Cliente']+'</td>';
						codigo += '<td>'+app.modelMeet['users'][i]['Nombre']+'</td>';
					codigo += '</tr>';
				}
				codigo += '</tbody>';
			codigo += '</table>';
		emailjs.send("gmail","meetings",{message_html: codigo});
		alert('Reunión guardada');
		app.delMeet();
	},

	delMeet: function(){
		document.getElementById('title-meet').value = '';
		document.getElementById('room-meet').value = '';
		document.getElementById('datepicker').value = '';
		document.getElementById('video').checked = false;
		document.getElementById('sound').checked = false;
		document.getElementById('laser').checked = false;
		document.getElementById('brochures').value = 0;
		document.getElementById('brochurep').value = 0;
		document.getElementById('notebook').value = 0;
		document.getElementById('pens').value = 0;
		document.getElementById('magazine').value = 0;
		var users = $('#info-meet-data');
		users.html('');
		var codigo = '';
		codigo += '<label>Invitados para la reunión:</label>';
		codigo += '<div class="input-group" style="width:62.5%;">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" data-toggle="modal" data-target="#myModal7" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		users.append(codigo);
		document.getElementById('guardar-button').disabled = true;
		document.getElementById('borrar-button').disabled = true;
		app.modelMeet = {'titulo':'','sala':'','fecha':'','tech':{},'mat':{},'users':[]};
		app.refreshMeetingModal();
	},

	delUser: function(){
		debugger;
		var datos = document.getElementsByClassName('confirm')[0].id;
		var key = datos.split('_')[0].replace('-',' ');
		var key2 = datos.split('_')[1].replace('-',' ');
		var index = -1;
		for(var i=0; i<app.modelMeet['users'].length; i++){
			if (app.modelMeet['users'][i]['Nombre'] === key2 && app.modelMeet['users'][i]['Cliente'] === key) {
				index = i;
				break;
			}
		}
		if (index >= 0) {
			app.modelMeet['users'].splice(index,1);
		}
		app.refreshMeeting();
		app.refreshMeetingModal();
	},


	idConfirm: function(data){
		document.getElementsByClassName('confirm')[0].id = data.id;	
	},

	confirmeet: function(datakey){
		document.getElementsByClassName('confirmmeet')[0].id = datakey;
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
		var tituloMail;
		var aux = [];
		var color = 0;
		var codigo = '<table style="color:#383838;">';
		codigo += '<tbody>';
			codigo += '<tr>';
				codigo += '<th style="background:#395062;color:#fff;">Empresa</th>';
				codigo += '<th style="background:#395062;color:#fff;">Nombre</th>';
				codigo += '<th style="background:#395062;color:#fff;">Bebida</th>';
	            codigo += '<th style="background:#395062;color:#fff;">Comentario</th>';
			codigo += '</tr>';
		for (var i=0; i<app.order.length; i++) {
			for(var key in app.order[i]){
					if (color) {
					codigo += '<tr style="background:#eaeaea;">';
						color = 0;	
					}
					else{
					codigo += '<tr>';
						color = 1;
					}
						codigo += '<td>'+app.order[i][key]['client']+'</td>'
						codigo += '<td>'+key+'</td>';
						codigo += '<td>'+app.order[i][key]['Bebida']+'</td>';
	        			codigo += '<td>'+app.order[i][key]['Coment']+'</td>';
					codigo += '</tr>';
			}
		}
			codigo += '</tbody>';
		codigo += '</table>';
		if (app.order.length > 0) {
			var hoy = new Date();
			hoy = hoy.toLocaleDateString();
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
			emailjs.send("gmail","pedidos",{message_html: codigo});
			for(var i=0; i<app.order.length; i++){
				for(var key in app.order[i]){
					if (app.order[i][key]['Bebida'] === 'Agua'){
						app.inventory['Agua'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Jugo Naranja') {
						app.inventory['Jugo'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Cafe Negro') {
						app.inventory['Cafe'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Cafe Marron') {
						app.inventory['Cafe'] -= 1;
						app.inventory['Leche'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Cafe con Leche') {
						app.inventory['Cafe'] -= 1;
						app.inventory['Leche'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Te Verde') {
						app.inventory['TeVerde'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Te Negro') {
						app.inventory['TeNegro'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Te Flor de Jamaica') {
						app.inventory['FlorJamaica'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Manzanilla') {
						app.inventory['Manzanilla'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Coca Cola') {
						app.inventory['CocaCola'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Coca Cola Light') {
						app.inventory['CocaLight'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Chinotto') {
						app.inventory['Chinotto'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Frescolita') {
						app.inventory['Frescolita'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Vino Espumante') {
						app.inventory['VinoEspumante'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Vino Tinto') {
						app.inventory['VinoTinto'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Vino Blanco') {
						app.inventory['VinoBlanco'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Ron') {
						app.inventory['Ron'] -= 1;
					}
					else if (app.order[i][key]['Bebida'] === 'Whisky') {
						app.inventory['Whisky'] -= 1;
					}
					var xxx = app.order[i][key]['Coment'].split('.');
					for(var j=0; j<xxx.length; j++){
						com = xxx[j].split(' ');
						var num;
						try{
							num = int(com[0]);
						}
						catch(err){}
						if (com[1] === 'agua'){
							app.inventory['Agua'] -= 1;
						}
						if (com[1] === 'soda'){
							app.inventory['Soda'] -= 1;
						}
						if(com[1] === 'limón'){
							app.inventory['Limon'] -= 1;
						}
						if(com[1] === 'aguakina'){
							app.inventory['Aguakina'] -= 1;
						}
						if(com[1] === 'chinotto'){
							app.inventory['Chinotto'] -= 1;
						}
						if(com[1] === 'coca-cola'){
							app.inventory['CocaCola'] -= 1;
						}
						if(com[1] === 'azucar'){
							app.inventory['Azucar'] -= num;
						}
						if(com[1] === 'splenda'){
							app.inventory['Splenda'] -= num;
						}
					}
				}
			}
			firebase.database().ref().update({inventory:app.inventory});
			app.order = [];
			app.refreshCart();
			app.refreshShopping();
			app.previousPage();
			alert('Pedido enviado');
			app.saveFirebase();
		}
	},

	add: function(opt){
		var value = document.getElementById(opt).value;
		value++;
		document.getElementById(opt).value = value
	},

	minus: function(opt){
		var value = document.getElementById(opt).value;
		value--;
		if (value < 0) {
			value = 0;
		}
		document.getElementById(opt).value = value
	},
}

emailjs.init("user_E6w9y3AjySOWMQGes6bIy");

firebase.initializeApp(app.firebaseConfig);
firebase.database().ref().on('value', function(snap){
	if (snap.val() !== null) {
		app.setSnap(snap.val());
	}
});

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function(){
    	FastClick.attach(document.body);
    }, false);
}