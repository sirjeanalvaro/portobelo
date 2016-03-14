document.write('<script type="text/javascript" src="js/cidades-estados-v0.2.js"></script>');
document.write('<script type="text/javascript" src="js/jquery.maskedinput.min.js"></script>');
document.write('<script type="text/javascript" src="js/jquery.validate.min.js"></script>');

jQuery(function($){

	var formulario 	= $("form#formSend");

	// validate formulario
	var boxValidate = $("#validate-form"),
		textError 	= "<p><strong>Error.</strong> Por Favor, Tente Novamente!</p>",
		textLoading = "<p><strong>Aguarde...</strong></p>",
		textSuccess = "<p><strong>Enviado com Sucesso!</strong></p>";
		
	var fnEnviar = function(){
		var btSubmit = formulario.find("input[type='submit']");

		$.ajax({
			type 	: "POST",
			url 	: "form.php",
			dataType: "JSON",
			data 	: formulario.serialize(),
			beforeSend: function(){
				boxValidate.addClass("enviando").show().html(textLoading);
				btSubmit.prop("disabled", true);
			},
			error: function(xhr, ajaxOptions, thrownError){

				boxValidate.attr("class", "error").show().html("<p><strong>Erro.</strong> " + thrownError + "!</p>");
				alert(thrownError);
				btSubmit.prop("disabled", false);

			},
			success: function(data){
				
				btSubmit.attr('disabled', false);


				try {

					if ( data.status ){

						formulario.find("input[type=text], textarea").val("");
						formulario.find("select").find("option").eq(0).prop("selected", true);

						// mensagem sucesso
						boxValidate.attr("class", "sucesso").show().html( data.message || textSuccess );

						setTimeout(function(){
							boxValidate.removeClass( "sucesso" ).slideUp( "fast" );
						}, 5500);

					} else {

						throw new UserException( data.message || textError );
						console.log(data);

					};

				} catch ( err ) {

					console.log( err );

					// mensagem error
					boxValidate.attr("class", "error").show().html( err || textError );

				};
			}
		});
	};
	
	formulario.validate({
		errorContainer: '',
		errorLabelContainer: '',
		wrapper: 'p',
		meta: "validate",
		submitHandler: fnEnviar,
		rules:{
			assunto : 	{ required:true, minlength:5 },
			nome : 		{ required:true, minlength:3 },
			email : 	{ required:true, email:true },
			telefone : 	{ required:true, minlength:10 },
			estado : 	{ required:true },
			cidade : 	{ required:true },
			texto : 	{ required:true, minlength:10 }
		},
		messages: {
			assunto : 	"Insira o Assunto.",
			nome : 		"Insira seu Nome.",
			email : 	{ required:"Insira seu E-mail.", email:"E-mail Inválido!" },
			telefone : 	"Ex.: (xx) xxxx-xxxx.",
			estado : 	"Selecione um Estado.",
			cidade : 	"Selecione uma Cidade.",
			texto : 	"Insira suas Observações."
		}
	});

	// Lista os estados e cidades
	if($("select#estado").length && $("select#cidade").length){
		new dgCidadesEstados(document.getElementById('estado'), document.getElementById('cidade'), true);
	};

	// auto-size-textarea
	if($(".formulario").find("textarea").length > 0){
		$(".formulario").find("textarea").autosize();
	};
	
	// Máscaras dos campos
	formulario.find("input[name='telefone']").mask("(99) 9999-9999");

	$("input[type='file']").change(function(){
		var $obj = $(this).prev();
		$obj.empty();
		$obj.html($(this).val());
	});
	$("input[type=file]").css("opacity", 0);
});