var express = require('express');
var router = express.Router();

var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware  = multipart();
var path = require('path');
var url = require('url');
var async = require('async');

var esid = require('randomid');



var bodyParser = require('body-parser');

router.get('/', function(req, res, next){
	res.render('panel', {
		title: 'Panel de administración',
		nombre: req.user.nombre,
		empresa: req.user.empresa
	});
	console.log(req.user)

});

router.get('/edit', function(req, res, next){
	
	function sendData(data) {
		if(data == 'empresa') {
			return req.user.empresa;
		}
		else if(data == 'email') {
			return req.user.email;
		}
		else if(data == 'apellidos') { 
			return req.user.apellidos;
		}
		else if(data= 'dni') {
			return req.user.dni;
		}
	}

	res.render('edit', {
		title: 'Panel de administración',
		nombre: req.user.nombre,
		apellidos: sendData('apellidos'),
		empresa: sendData('empresa'),
		email: sendData('email'),
		dni: sendData('dni')
	});
	console.log('editando user');
});


router.post('/save', function(req, res, next) {
	console.log(req.body);

	function search(s) {
		if(s == 'dni') {
			return req.body.dni;
		}
		else if(s == 'nombre') {
			return req.body.name;
		}
		else if(s == 'apellidos') {
			return req.body.apellidos;
		}
		else if(s == 'email') {
			return req.body.email;
		}
		else if(s == 'dni') {
			return req.body.dni;
		}
	}

	var db = req.db;
	var users = db.get('usuarios');

	users.update({'_id': req.user._id}, {
		$set:  {
			'nombre': search('nombre'),
			'apellidos': search('apellidos'),
			'email': search('email'),
			'dni': search('dni')
		}
	}).success(function(result){
		res.redirect('/panel/edit')
	});

});

router.get('/propiedades', function(req, res, next) {
	var reverseProp = req.user.propiedades;
	var reverse = reverseProp.reverse()
	res.render('propiedades', {
		title: 'Panel de administración',
		nombre: req.user.nombre,
		empresa: req.user.empresa,
		propiedades: reverse
	});
});


router.get('/propiedades/add', function(req, res, next) {

	res.render('add', {
		title: 'Nueva propiedad',
		nombre: req.user.nombre,
		empresa: req.user.empresa
	});

});


router.post('/addcreate', multipartMiddleware , function(req, res, next) {
	var db = req.db;
	var usuarios = db.get('usuarios');
	
	//var imgPath = req.files.img.path;
	var garantePath = req.files.garanteFile.path;
	var contratoPath = req.files.contrato.path;

	var namesArr = [garantePath, contratoPath];
	var namesFiles = [req.files.garanteFile.name, req.files.contrato.name];

	function idUser() {
		return req.user._id;
	}


	async.map(namesArr, getInfo, function(fileurl, data, arr){

		/*fs.readFile(fileurl, function(err, escritura){
			if(err) {
				return err;
			}
			else {
				

				for(var i = 0; i < namesFiles.length; i++) {

					var saveFile = path.join(__dirname, '..', 'public', 'files/' + namesFiles[i]);
					
					fs.writeFile(saveFile, escritura, function(err){
						if(err){
							console.log(err);
						}
						else {

					
						}
					})
				}



				


			}
		});*/

	});


	function getInfo(name, callback) {
		fs.readFile(name, function(err, escritura){
			if(err) {
				return err;
			}
			else {
				
				for(var i = 0; i < namesFiles.length; i++) {

					var saveFile = path.join(__dirname, '..', 'public', 'files/' + namesFiles[i]);
					
					fs.writeFile(saveFile, escritura, function(err){
						if(err){
							console.log(err);
						}
						else {

					
						}
					})
				}

			}
		});
	}



	usuarios.findAndModify({
								query: {
									'_id': req.user._id
								},
								update: {
									$push: {
										'propiedades': {
											'nombrePropiedad': req.body.nombrepropiedad,
											'desPropiedad': req.body.despropiedad,
											'precioPropiedad': req.body.pricepropiedad,
											'barrio': req.body.barriopropiedad,
											'fechaIngresada': req.body.ingresoinquilino,

											'nombreInquilino': req.body.nameinquilino,
											'telInquilino': req.body.telinquilino,
											'dniInquilino': req.body.dniinquilino,
											'emailInquilino': req.body.emailinquilino,
											
											'garanteNombre': req.body.garanteNombre,
											'garanteTel': req.body.garanteTel,
											'garanteDni': req.body.garanteDni,
											'garanteEmail': req.body.garanteEmail,
											'garanteFile': namesFiles[0],

											'contrato': namesFiles[1]
										}
									}
								},

								new: true

	}).success(function(done){
								//res.redirect('/panel/propiedades');
	});


	/*fs.readFile(namePath, function(err, data) {
		
		if(err) {
			return err;
		}
		else {
			var nameFile = esid(6) + req.files.img.name;
			var saveFile = path.join(__dirname, '..', 'public', 'files/' + nameFile);

			
			fs.writeFile(saveFile, data, function(err){
				if(err) {
					return err;
				}
				else {

					usuarios.findAndModify({
						query: {
							'_id': req.user._id
						},
						update: {
							$push: {
								'propiedades': {
									'imagenPropiedad': nameFile,
									'nombrePropiedad': req.body.nombrepropiedad,
									'desPropiedad': req.body.despropiedad,
									'precioPropiedad': req.body.pricepropiedad,
									'barrio': req.body.barriopropiedad,
									'fechaIngresada': req.body.ingresoinquilino,

									'nombreInquilino': req.body.nameinquilino,
									'telInquilino': req.body.telinquilino,
									'dniInquilino': req.body.dniinquilino,
									'emailInquilino': req.body.emailinquilino,
									
									'garanteNombre': req.body.garanteNombre,
									'garanteTel': req.body.garanteTel,
									'garanteDni': req.body.garanteDni,
									'garanteEmail': req.body.garanteEmail
								}
							}
						},
						new: true
					}).success(function(done){
						res.redirect('/panel/propiedades');
					});


				}
			})


			

		}


	});*/


});

module.exports = router;