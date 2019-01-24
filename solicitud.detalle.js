(function () {
    'use strict';
    angular
        .module("garantiasapp")
        .controller("LeasingSolicitudDetalleController", LeasingSolicitudDetalleController);

    LeasingSolicitudDetalleController.$inject = ["$scope", "$filter", "$interval", "garantiasService", "$uibModal", "solicitudModalService", "utilsService", "FileUploader","Carousel"];
 
    function LeasingSolicitudDetalleController($scope, $filter, $interval, garantiasService, $uibModal, solicitudModalService, utilsService, FileUploader, Carousel) {
       
        var scope = this;

        scope.id_e = angular.element("#id_e").val();
        scope.tg_e = angular.element("#tg_e").val();
        scope.mv_e = angular.element("#mv_e").val();

        scope.TipoGarantias = TipoGarantias;

        scope.usuario = 4;
        scope.codCliEnable = true;
        scope.tieneMancomunos = true;
        scope.tiposGarantia = [];
        scope.tiposDocumento = [];
        scope.comentarios = [];
        scope.checkListDocumentario = [];
        scope.notificaciones = [];
        scope.entidad = {};
        scope.solicitudDPCB = {};
        scope.Warrant = {};
        scope.SeguroExportacion = {};
        scope.tamanioCliente = [];

        scope.almaceneras = [];
        scope.tipoSolicitudWarrant = [];
        scope.numerosWarrant = [];
        scope.MancomunosView = [];
        scope.mancomuno = [];
        scope.EstadoSolicitudEdicion = [];
        scope.TipoMotivoEnviarSolicitu = [];
        scope.inicio = inicio;
        //scope.cargarDocumentos = cargarDocumentos;
        scope.cargarCheckListDocumentario = cargarCheckListDocumentario;
        scope.cargarLog = cargarLog;
        scope.buscarCliente = buscarCliente;
        scope.limpiarCliente = limpiarCliente;
        scope.salir = salir;
        scope.detectaTipoGarantia = detectaTipoGarantia;
        scope.guardarBorrador = guardarBorrador;
        scope.enviarMensajeAvisoPrevio = enviarMensajeAvisoPrevio;
        scope.procesaEnviar = procesaEnviar;
        scope.buscarClientePorCodigo = buscarClientePorCodigo;
        scope.buscarClientePorDescripcion = buscarClientePorDescripcion;
        scope.setearCliente = setearCliente;
        scope.abreBuscarCliente = abreBuscarCliente;
        scope.obtenerNumerosWarrantPorCliente = obtenerNumerosWarrantPorCliente;
        scope.cargarSaldos = cargarSaldos;
        scope.cargarPoliza = cargarPoliza;
        scope.CargarDepositoPlazoFijo = CargarDepositoPlazoFijo;
        scope.EnvioCorreo = EnvioCorreo;
        scope.mancomunos = mancomunos;
        scope.verMancomunos = verMancomunos;
        scope.verMancomunosCB = verMancomunosCB;
        scope.buscaCB = buscaCB;
        scope.buscaDP = buscaDP;
        scope.procesar = procesar;
        scope.setearModo = setearModo;
        scope.modoConsulta = false;
        scope.MostrarEnvioCorreo = true;
        scope.CoberturaValida = true;
        scope.buscarDocumentoChk = buscarDocumentoChk;
        scope.codigoRenovacionEncriptado = 'b7LR4eCfDrnSm906zVsbFg==';
        scope.codigoNuevoEncriptado = 'OZtaPvMcxxNZ0kKpn8E8Kw==';
        scope.lectura = false;
        scope.existeNumeroWarrant = false;
        scope.images = [];
        //scope.images = [{ "TasacionId_e": "", "TipoMime": "", "Tamanio": 0, "FechaRegistra": "", "TipoMime": "jpg", "Tamanio": 0.01, "FechaRegistra": "", "ValUrlAvatar": "", "ValUrlAvatar_Image": "", "ValUrlAvatar_ImageMin": "#", "item": "" }];
        scope.inicio();
        scope.listadocumentoChk = [];
        scope.buscarDocumentos = buscarDocumentos;
        scope.verificaExisteNumerosWarrantPorCliente = verificaExisteNumerosWarrantPorCliente;
        scope.ValidacionPorLimiteDeCobertura = ValidacionPorLimiteDeCobertura;
        scope.ValidacionPorLimiteDeCoberturaYEnvioCorreo = ValidacionPorLimiteDeCoberturaYEnvioCorreo;

        scope.CodigoSIEncriptado = '3iP0grohxQyRbMLkdy4r0A==';
        scope.actualizaBotonEnvioCorreo = actualizaBotonEnvioCorreo;
        scope.DeshabilitarEnvioCorreo = true;
        scope.selectedFiltroTipoCobertura = "";
        scope.selectedFiltroTipoEnvioCorreo = "";
        scope.selectedFiltroTipoFinanciamiento = "";

        //tasaciones
        scope.tasacionesE = [];
        scope.agregarTasacion = agregarTasacion;
        scope.eliminarTasacion = eliminarTasacion;
        scope.buscarTasaciones = buscarTasaciones;
        scope.proyectos = [];
        scope.productos = [];

        //agregar imagen carrusel
        scope.imagen = {};
       
        scope.mostrarCarrusel = false;
        scope.estaCargandoImagen = false;
        scope.agregarImagen = agregarImagen;
        scope.tamMaximo = 20000000;
        //scope.eliminarImagen = eliminarImagen;
        this.eliminar = function () { console.log("sadads!"); }
        /* BEGIN MODALES COMUNES */
        var nombreForm = 'formSolicitudDetalle';
        var estadoSolicitudObservada = '0044101';
        var detectaTipoGarantiaMensaje = '';

        scope.cargarComentarios = function () {
            solicitudModalService.cargarComentariosSolicitud(nombreForm)
        };

        scope.cargarCorreosNotificacion = function () {
            solicitudModalService.cargarCorreosNotificacionSolicitud(nombreForm)
        };

        scope.cargarDocumentos = function () {
            solicitudModalService.cargarDocumentosSolicitud(nombreForm)
        };

        /* END MODALES COMUNES */

        function inicio() {
            garantiasService.post("Leasing/SolicitudDetalle/Editor", { id_e: scope.id_e, tg_e: scope.tg_e, mv_e: scope.mv_e },
                function (data, status, headers, config) {
                    //console.log(data);
                    //debugger;
                    scope.entidad = data.d.Solicitud;
                    scope.solicitudDPCB = data.d.SolicitudDPBC;
                    if (scope.solicitudDPCB != null) {
                        if (scope.solicitudDPCB.ContadorMancomunos > 0) scope.tieneMancomunos = false;
                    }
                    scope.Warrant = data.d.Warrant;
                    scope.SeguroExportacion = data.d.SeguroExportacion;
                    if (scope.SeguroExportacion != null) {
                        scope.selectedFiltroTipoCobertura = scope.SeguroExportacion.cobertura;
                        scope.selectedFiltroTipoEnvioCorreo = scope.SeguroExportacion.enviacorreo;
                        scope.selectedFiltroTipoFinanciamiento = scope.SeguroExportacion.financiamiento;
                        if (scope.SeguroExportacion.enviacorreo == scope.CodigoSIEncriptado) scope.MostrarEnvioCorreo = true;
                        else scope.MostrarEnvioCorreo = false;
                    }
                    scope.tiposDocumento = data.d.TiposDocumento;
                    scope.tiposGarantia = data.d.TiposGarantia;
                    scope.tamanioCliente = data.d.TamanioCliente;
                    scope.comentarios = data.d.Comentarios;
                    //debugger;
                    scope.notificaciones = data.d.Notificaciones;
                    scope.CorreosNotificacionConcat = formatearCorreosNotificacion(data.d.Notificaciones);
                    scope.documentos = data.d.Documentos;

                    if (data.d.Comentarios != null && data.d.Comentarios != undefined) solicitudModalService.comentarios = data.d.Comentarios;
                    scope.EstadoSolicitudEdicion = data.d.EstadoSolicitudEdicion;
                    scope.TipoMotivoEnviarSolicitud = data.d.TipoMotivoEnviarSolicitud;
                    if (scope.comentarios != null) {
                        scope.entidad.ComentarioSolicitud = scope.comentarios.length > 0 ? scope.comentarios[scope.comentarios.length - 1].DESCRIPCION : null;
                    }
                    detectaTipoGarantia();
                    CargaInicialPorTipoGarantia();

                    //modo
                    scope.setearModo(data.d);

                    scope.obtenerNumerosWarrantPorCliente();

                    //actualizar codCliEnable
                    if (scope.entidad.CODCLIENTE) {
                        scope.codCliEnable = false;
                    }

                    if (scope.entidad.MTESTADOSOLICITUD != estadoSolicitudObservada) {
                        $('#cbotipoGarantia').on('change', detectaTipoGarantia);
                    }

                    //tasaciones
                    scope.agregarTasacion();

                }, function (data, status, headers, config) {
                    bootbox.alert(scope.MsjError);
                });

            Carousel.setOptions({
                //arrows: true,
                //autoplay: false,
                //autoplaySpeed: 3000,
                //cssEase: 'ease',
                //dots: false,

                //easing: 'linear',
                //fade: false,
                //infinite: true,
                //initialSlide: 0,

                //slidesToShow: 1,
                //slidesToScroll: 1,
                //speed: 500,
            });
            this.autoplay = {
                slides: [...Array(6).keys()],
                source: ''
            };
            scope.images.push(
                { "TasacionId_e": "21ec5464-733f-49f9-966b-dea17c11f36a", "TipoMime": "jpg", "Tamanio": 0.01, "FechaRegistra": "23/01/2019 23:22:46", "ValUrlAvatar": "C:\\repoGarantias\\temp\\21ec5464-733f-49f9-966b-dea17c11f36a.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/21ec5464-733f-49f9-966b-dea17c11f36a.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/21ec5464-733f-49f9-966b-dea17c11f36a_min.jpg", "item": "/F2/Resources/Temp/21ec5464-733f-49f9-966b-dea17c11f36a_min.jpg" }, { "TasacionId_e": "6726dbea-243c-493b-ad79-30c507c67aaa", "TipoMime": "jpg", "Tamanio": 0.02, "FechaRegistra": "23/01/2019 23:22:53", "ValUrlAvatar": "C:\\repoGarantias\\temp\\6726dbea-243c-493b-ad79-30c507c67aaa.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/6726dbea-243c-493b-ad79-30c507c67aaa.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/6726dbea-243c-493b-ad79-30c507c67aaa_min.jpg", "item": "/F2/Resources/Temp/6726dbea-243c-493b-ad79-30c507c67aaa_min.jpg" }, { "TasacionId_e": "62b76a5d-5edf-495d-9b01-30b21a987f6d", "TipoMime": "jpg", "Tamanio": 0.01, "FechaRegistra": "23/01/2019 23:22:59", "ValUrlAvatar": "C:\\repoGarantias\\temp\\62b76a5d-5edf-495d-9b01-30b21a987f6d.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/62b76a5d-5edf-495d-9b01-30b21a987f6d.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/62b76a5d-5edf-495d-9b01-30b21a987f6d_min.jpg", "item": "/F2/Resources/Temp/62b76a5d-5edf-495d-9b01-30b21a987f6d_min.jpg" }, { "TasacionId_e": "ab1bd9a2-7d78-4bde-bb0e-410a8d37d10a", "TipoMime": "jpg", "Tamanio": 0.02, "FechaRegistra": "23/01/2019 23:23:04", "ValUrlAvatar": "C:\\repoGarantias\\temp\\ab1bd9a2-7d78-4bde-bb0e-410a8d37d10a.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/ab1bd9a2-7d78-4bde-bb0e-410a8d37d10a.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/ab1bd9a2-7d78-4bde-bb0e-410a8d37d10a_min.jpg", "item": "/F2/Resources/Temp/ab1bd9a2-7d78-4bde-bb0e-410a8d37d10a_min.jpg" }, { "TasacionId_e": "9d33b5c5-cbe8-4bfe-8f4a-11eb3ba979cb", "TipoMime": "jpg", "Tamanio": 0.02, "FechaRegistra": "23/01/2019 23:23:07", "ValUrlAvatar": "C:\\repoGarantias\\temp\\9d33b5c5-cbe8-4bfe-8f4a-11eb3ba979cb.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/9d33b5c5-cbe8-4bfe-8f4a-11eb3ba979cb.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/9d33b5c5-cbe8-4bfe-8f4a-11eb3ba979cb_min.jpg", "item": "/F2/Resources/Temp/9d33b5c5-cbe8-4bfe-8f4a-11eb3ba979cb_min.jpg" }, { "TasacionId_e": "828aa652-8881-4140-ada1-50b5fb0fa91e", "TipoMime": "jpg", "Tamanio": 0.02, "FechaRegistra": "23/01/2019 23:23:15", "ValUrlAvatar": "C:\\repoGarantias\\temp\\828aa652-8881-4140-ada1-50b5fb0fa91e.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/828aa652-8881-4140-ada1-50b5fb0fa91e.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/828aa652-8881-4140-ada1-50b5fb0fa91e_min.jpg", "item": "/F2/Resources/Temp/828aa652-8881-4140-ada1-50b5fb0fa91e_min.jpg" }, { "TasacionId_e": "77535f1b-fd95-44ef-8845-2954c262cd97", "TipoMime": "jpg", "Tamanio": 0.04, "FechaRegistra": "23/01/2019 23:23:28", "ValUrlAvatar": "C:\\repoGarantias\\temp\\77535f1b-fd95-44ef-8845-2954c262cd97.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/77535f1b-fd95-44ef-8845-2954c262cd97.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/77535f1b-fd95-44ef-8845-2954c262cd97_min.jpg", "item": "/F2/Resources/Temp/77535f1b-fd95-44ef-8845-2954c262cd97_min.jpg" }, { "TasacionId_e": "d859bd1d-6ec6-4297-a836-f0e485702924", "TipoMime": "jpg", "Tamanio": 0.19, "FechaRegistra": "23/01/2019 23:23:35", "ValUrlAvatar": "C:\\repoGarantias\\temp\\d859bd1d-6ec6-4297-a836-f0e485702924.jpg", "ValUrlAvatar_Image": "/F2/Resources/Temp/d859bd1d-6ec6-4297-a836-f0e485702924.jpg", "ValUrlAvatar_ImageMin": "/F2/Resources/Temp/d859bd1d-6ec6-4297-a836-f0e485702924_min.jpg", "item": "/F2/Resources/Temp/d859bd1d-6ec6-4297-a836-f0e485702924_min.jpg" }
            );
            scope.eliminarImagen = eliminarImagen;
        };

      
       

        function formatearCorreosNotificacion(listaCorreos) {

            var result = "";
            if (listaCorreos != undefined && listaCorreos.length !== undefined) {
                for (var i = 0; i < listaCorreos.length; i++) {
                    result += listaCorreos[i].CORREO.toString().toLowerCase() + " ";

                }

            }
            return result;
        };

        function setearModo(resp) {
            //Modos
            if (resp.ModoConsulta) {
                scope.modoConsulta = resp.ModoConsulta;
                scope.lectura = scope.modoConsulta;
                $('#divDatosClienteSolicitud').find('input, textarea, button, select, a').attr('disabled', 'disabled');
                $('#divDatosGarantiaSolicitud').find('input, textarea, button, select, a').attr('disabled', 'disabled');
                $('#divCertificadoBancario').find('input, textarea, button, select, a').attr('disabled', 'disabled');
                $('#idDocumentos').text("Ver Documentos");
                $('#idComentario').text("Ver comentarios");
                $('#btnGuardarBorradorSolicitud').hide();
                $('#btnEnviarSolicitud').hide();
                $('#idNotificaciones').text("Ver Correos");
            }

            else if (resp.ModoSolicitudIncompleta) // modo solicitud incompleta
            {
                $('#cbotipoGarantia').removeAttr('disabled');
                $('#CODCLIENTE').removeAttr('disabled');
                $('#divCliente').removeAttr('disabled');

            }
            else {
                $('#cbotipoGarantia').attr('disabled', 'disabled');
                $('#CODCLIENTE').attr('disabled', 'disabled');
                $('#divCliente').find('input, textarea, button, select, a').attr('disabled', 'disabled');
            }
        };

        function salir() {
            var msj = "Se perderán los datos no guardados ¿está seguro de continuar?";
            bootbox.confirm(msj, function (r) {
                if (r === true) {
                    window.location = garantiasService.prefix() + "GestionSolicitud/Index";
                }
            });
        };

        function buscaCB(nroCB) {

            var dataObj = { NUMERO: nroCB, MTTIPOGARANTIA_e: scope.entidad.MTTIPOGARANTIA_e };
            garantiasService.post("SolicitudDetalle/BuscarPlazoFijo", dataObj,
                function (data, status, headers, config) {
                    if (data.d != null && data.d.length != 0 && data.d[0].CODCLIENTE != null) {
                        if (scope.solicitudDPCB == null) scope.solicitudDPCB = {};

                        scope.entidad.CODCLIENTEP = data.d[0].CODCLIENTE;
                        scope.entidad.CODTIPODOCUMENTO = data.d[0].CODTIPODOCUMENTO;
                        scope.entidad.DESDOCUMENTO = data.d[0].DESDOCUMENTO;
                        scope.entidad.NRODOCUMENTOP = data.d[0].NRODOCUMENTO;
                        scope.entidad.TIPO = data.d[0].TIPO;
                        scope.entidad.APPATERNO = data.d[0].APPATERNO;
                        scope.entidad.APMATERNO = data.d[0].APMATERNO;
                        scope.entidad.NOMBRES = data.d[0].NOMBRES;
                        scope.solicitudDPCB.PROPIETARIO = data.d[0].NOMBRES + " " + data.d[0].APPATERNO + " " + data.d[0].APMATERNO;
                        scope.entidad.CODMONEDA = data.d[0].CodMUlti;
                        scope.solicitudDPCB.MONEDA_e = data.d[0].CodMUlti;
                        scope.solicitudDPCB.IMPORTE = data.d[0].IMPORTE;
                        scope.solicitudDPCB.CODPROPIETARIO = data.d[0].CODCLIENTE;
                        scope.solicitudDPCB.FecEmision = utilsService.JsonToDate(data.d[0].FecEmision);
                        scope.solicitudDPCB.FecVencimiento = utilsService.JsonToDate(data.d[0].FecVencimiento);
                        scope.entidad.MancomunoL = data.d[0].MancomunoL;
                        scope.MancomunosView = data.d[0].MancomunoL;
                        if (data.tt > 0) scope.tieneMancomunos = false;
                        else scope.tieneMancomunos = true;
                    }
                    else {
                        if (data.m != null && data.m != "") {
                            bootbox.alert(data.m, function (r) {
                                limpiarDepositoPlazo();
                            });
                        }
                        else if (data.ms != undefined && data.ms != null && data.ms.length == 1) {
                            bootbox.alert(data.ms[0], function (r) {
                                limpiarDepositoPlazo();
                            });
                        }
                        else {
                            var msj = "El número de certificado no existe.";
                            bootbox.alert(msj, function (r) {
                                limpiarDepositoPlazo();
                            });
                        }
                    }
                }, function (data, status, headers, config) {
                    bootbox.alert(scope.MsjError);
                });

        }

        function buscaDP(nroDP) {

            var dataObj = { NUMERO: nroDP, MTTIPOGARANTIA_e: scope.entidad.MTTIPOGARANTIA_e };
            garantiasService.post("SolicitudDetalle/BuscarPlazoFijo", dataObj,
                function (data, status, headers, config) {
                    if (data.d != null && data.d.length != 0 && data.d[0].CODCLIENTE != null) {
                        if (scope.solicitudDPCB == null) scope.solicitudDPCB = {};
                        scope.entidad.CODCLIENTEP = data.d[0].CODCLIENTE;
                        scope.entidad.CODTIPODOCUMENTO = data.d[0].CODTIPODOCUMENTO;
                        scope.entidad.DESDOCUMENTO = data.d[0].DESDOCUMENTO;
                        scope.entidad.NRODOCUMENTOP = data.d[0].NRODOCUMENTO;
                        scope.entidad.TIPO = data.d[0].TIPO;
                        scope.entidad.APPATERNO = data.d[0].APPATERNO;
                        scope.entidad.APMATERNO = data.d[0].APMATERNO;
                        scope.entidad.NOMBRES = data.d[0].NOMBRES;
                        scope.solicitudDPCB.PROPIETARIO = data.d[0].NOMBRES + " " + data.d[0].APPATERNO + " " + data.d[0].APMATERNO;
                        scope.entidad.CODMONEDA = data.d[0].CodMUlti;
                        scope.solicitudDPCB.MONEDA_e = data.d[0].CodMUlti;
                        scope.solicitudDPCB.IMPORTE = data.d[0].IMPORTE;
                        scope.solicitudDPCB.CODPROPIETARIO = data.d[0].CODCLIENTE;
                        scope.solicitudDPCB.FecEmision = utilsService.JsonToDate(data.d[0].FecEmision);
                        scope.solicitudDPCB.FecVencimiento = utilsService.JsonToDate(data.d[0].FecVencimiento);
                        scope.entidad.MancomunoL = data.d[0].MancomunoL;
                        scope.MancomunosView = data.d[0].MancomunoL;
                        if (data.tt > 0) scope.tieneMancomunos = false;
                    }
                    else {
                        if (data.m != null && data.m != "") {
                            bootbox.alert(data.m, function (r) {
                                limpiarDepositoPlazo();
                            });
                        }
                        else if (data.ms != undefined && data.ms != null && data.ms.length == 1) {
                            bootbox.alert(data.ms[0], function (r) {
                                limpiarDepositoPlazo();
                            });
                        }
                        else {
                            var msj = "¡El depósito N°   " + nroDP + "   no existe!";
                            bootbox.alert(msj, function (r) {
                                limpiarDepositoPlazo();
                            });
                        }
                    }
                }, function (data, status, headers, config) {
                    bootbox.alert(scope.MsjError);
                });

        }

        function verMancomunosCB() {

            //scope.entidad.CODCLIENTEP = "301210";
            var modalInstance = $uibModal.open({
                templateUrl: 'mdMancomunos',
                controller: 'solicitudDetalleBuscarMancomunoIndexController as ctr',
                size: 'lg',
                resolve: {
                    args: function () {
                        return { NUMERO: scope.solicitudDPCB.NUMERO, CODPERSONA: scope.entidad.CODCLIENTEP };
                    }
                }
            });

            modalInstance.result.then(function (resp) {
                if (resp.cerrar === true) {
                }
            }, function () {
                //
            });
        };
        //se llama al enviar Enviar nuevo o incompleto
        //se debe llamar al seleccionar tipo de garantia como alerta en nuevo o incompleto
        function detectaTipoGarantia(e) {
            detectaTipoGarantiaMensaje = '';
            scope.CoberturaValida = true;
            //debugger;
            scope.checkListDocumentario = [];
            var _seleccionado = scope.entidad.MTTIPOGARANTIA;
            var garantias = scope.TipoGarantias;
            garantiasService.post("Leasing/SolicitudDetalle/ObtieneSolicitudEnProceso", {
                clienteId: scope.entidad.CLIENTEID, tipoGarantia: scope.entidad.MTTIPOGARANTIA_e
            },
                function (data, status, headers, config) {
                    //IMPORTANTE!!!!! Agregar validacion por solicitud en proceso exitosa
                    CargaInicialPorTipoGarantia();
                    //console.log(data.ms);
                    if (data.ms[0]) {
                        //bootbox.alert(data.ms[0]);
                        console.log('ms[0]', e);
                        if (scope.entidad.MTESTADOSOLICITUD != estadoSolicitudObservada) {

                            detectaTipoGarantiaMensaje = data.ms[0];
                        }
                        if (e) {
                            bootbox.alert(data.ms[0]);
                        }

                    }
                }, function (data, status, headers, config) {
                    bootbox.alert(scope.MsjError);
                },
                false);

        };

        function CargaInicialPorTipoGarantia() {
            //debugger;

            garantiasService.post("Leasing/SolicitudDetalle/ObtenerCargaInicialPorTipoGarantia", {
                tipoGarantia: scope.entidad.MTTIPOGARANTIA_e,
                id_e: scope.entidad.SOLICITUDID_e
            },
                function (data, status, headers, config) {
                    cargarTipoGarantiaFormulario(data);

                }, function (data, status, headers, config) {
                    bootbox.alert(scope.MsjError);
                },
                false);
        };

        function cargarPoliza(id) {

            garantiasService.post("SolicitudDetalle/ObtenerPolizaPorCodEmidor", { codEmisor: id },
                function (data, status, headers, config) {
                    if (data.d !== null) {
                        if (data.d.POLIZA !== null)
                            scope.SeguroExportacion.poliza = data.d.POLIZA;
                        if (data.d.MONEDA_e !== null) {
                            scope.entidad.MONEDA_e = data.d.MONEDA_e;
                        }
                    }

                }, function (data, status, headers, config) {
                    //console.log(data);
                    bootbox.alert(scope.MsjError);
                },
                false);

            ValidacionPorLimiteDeCobertura();
        }

        function cargarTipoGarantiaFormulario(data) {
            var _seleccionado = scope.entidad.MTTIPOGARANTIA_e;
            var garantias = scope.TipoGarantias;
            scope.MostrarEnvioCorreo = false;

            if (scope.entidad !== null &&
                scope.entidad.MTTIPOGARANTIA_e !== null &&
                scope.entidad.MTTIPOGARANTIA_e !== "") {

                switch (scope.entidad.MTTIPOGARANTIA_e) {
                    case TipoGarantias.WARRANT:
                        scope.tipoSolicitudWarrant = data.d.TipoSolicitudWarrant;
                        scope.almaceneras = data.d.Almacenera;
                        break;
                    case TipoGarantias.DEPOSITO_A_PLAZO:
                        scope.FiltroTipoMoneda = data.d.MonedaOpciones;
                        //var flagf = false;
                        scope.formVisibilityPlazo = true;
                        break;
                    case TipoGarantias.CERTIFICADO_BANCARIO:
                        scope.FiltroTipoMoneda = data.d.MonedaOpciones;
                        break;
                    case TipoGarantias.SEGURO_DE_EXPORTACION:

                        //scope.MostrarEnvioCorreo = true;
                        scope.FiltroTipoMoneda = data.d.MonedaOpciones;
                        scope.FiltroTipoCobertura = data.d.CoberturaOpciones;
                        if (scope.entidad.SOLICITUDID_e == null) {
                            scope.SeguroExportacion.cobertura = scope.FiltroTipoCobertura[0].Valor;
                        }
                        else { scope.SeguroExportacion.cobertura = scope.selectedFiltroTipoCobertura; }
                        scope.FiltroTipoEnvioCorreo = data.d.EnvioDeCorreoOpciones;
                        if (scope.entidad.SOLICITUDID_e == null) {
                            scope.SeguroExportacion.enviacorreo = scope.FiltroTipoEnvioCorreo[0].Valor;
                        } else { scope.SeguroExportacion.enviacorreo = scope.selectedFiltroTipoEnvioCorreo; }
                        //mostrar boton                        
                        scope.actualizaBotonEnvioCorreo(scope.SeguroExportacion.enviacorreo);
                        scope.FiltroTipoFinanciamiento = data.d.FinanciamientoOpciones;
                        if (scope.entidad.SOLICITUDID_e == null) {
                            scope.SeguroExportacion.financiamiento = scope.FiltroTipoFinanciamiento[0].Valor;
                        } else { scope.SeguroExportacion.financiamiento = scope.selectedFiltroTipoFinanciamiento; }
                        scope.FiltroCodigoEmisor = data.d.CodigoEmisorOpciones;

                        break;
                }
            }
        }

        function ValidacionPorLimiteDeCobertura() {
            
            if (scope.SeguroExportacion != null && scope.SeguroExportacion != undefined) {
                if (isNaN(scope.SeguroExportacion.montoasegurado)) {
                    console.log(scope.SeguroExportacion.montoasegurado)
                    return false;
                }
                if (scope.SeguroExportacion.montoasegurado <= 0) {
                    console.log('debe ser mayor que 0');
                    return false;
                }
                if (!scope.SeguroExportacion.codigo_emisor_e) {
                    console.log('No seleccionó codigo de emisor');
                    return false;
                }                
                garantiasService.post("SolicitudDetalle/ValidacionPorLimiteDeCobertura", {
                    id_e: scope.SeguroExportacion.codigo_emisor_e, montoasegurado: scope.SeguroExportacion.montoasegurado
                },
                    function (data, status, headers, config) {                        
                        scope.CoberturaValida = data.d;
                        if (data.e != undefined && data.e != null && data.e != '') {
                            scope.MensajeCoberturaNoValida = data.e;
                            bootbox.alert(scope.MensajeCoberturaNoValida);
                        }
                    }, function (data, status, headers, config) {
                        bootbox.alert(scope.MsjError);
                    },
                    false);
            }
        };

        function ValidacionPorLimiteDeCoberturaYEnvioCorreo() {

            if (scope.SeguroExportacion != null && scope.SeguroExportacion != undefined) {
                garantiasService.post("SolicitudDetalle/ValidacionPorLimiteDeCoberturaYEnvioCorreo", {
                    Solicitud: scope.entidad, SolicitudDPCB: scope.solicitudDPCB, Comentarios: solicitudModalService.comentarios, Notificaciones: solicitudModalService.notificaciones,
                    Warrant: scope.Warrant, SeguroExportacion: scope.SeguroExportacion
                },
                    function (data, status, headers, config) {
                        scope.CoberturaValida = data.d;
                        scope.MensajeCoberturaNoValida = data.e;
                        bootbox.alert(scope.MensajeCoberturaNoValida);
                    }, function (data, status, headers, config) {
                        bootbox.alert(scope.MsjError);
                    },
                    false);
            }
        };


        function verificaExisteNumerosWarrantPorCliente(callback) {
            //alert(nroWarrant);
            if (scope.Warrant != null && scope.Warrant != undefined && scope.Warrant.REFWARRANT) {

                garantiasService.post("SolicitudDetalle/VerificaExitenciaWarrantsPorCliente", {
                    solicitudId: scope.Warrant.SOLICITUDID, codigoCliente: scope.entidad.CODCLIENTE, tipoSolicitudWarrant: scope.Warrant.MTTIPOSOLICITUD_e, numeroWarrant: scope.Warrant.REFWARRANT
                },
                    function (data, status, headers, config) {
                        scope.existeNumeroWarrant = data.d;
                        console.log('Validando existencia de numero de warrant , existe', scope.existeNumeroWarrant);
                        if (typeof callback === "function") {
                            if (scope.existeNumeroWarrant) {
                                bootbox.alert("El número Warrant ya existe, por favor ingrese un nuevo número.");
                            } else {
                                callback();
                            }
                        }
                        //if (scope.existeNumeroWarrant) { bootbox.alert("El número Warrant ya existe, por favor ingrese un nuevo número."); }
                    }, function (data, status, headers, config) {
                        bootbox.alert(scope.MsjError);
                        scope.existeNumeroWarrant = true;//Si no hay verificacion no dejamos pasar
                    },
                    false);
            }

        };

        function obtenerNumerosWarrantPorCliente() {
            if (!scope.entidad.CODCLIENTE) {
                return false;
            }            
            if (scope.Warrant != null && scope.Warrant != undefined) {
                garantiasService.post("SolicitudDetalle/ObtenerWarrantsPorCliente", {
                    codigoCliente: scope.entidad.CODCLIENTE, tipoSolicitudWarrant: scope.Warrant.MTTIPOSOLICITUD_e
                },
                    function (data, status, headers, config) {
                        scope.numerosWarrant = data.d;
                    }, function (data, status, headers, config) {
                        bootbox.alert(scope.MsjError);
                    },
                    false);
            }

        };

        function limpiarGarantias() {
            switch (scope.entidad.MTTIPOGARANTIA_e) {
                case TipoGarantias.WARRANT:
                    limpiarWarrant();
                    break;
            }

        }

        function limpiarWarrant() {
            scope.numerosWarrant = [];//Limpieza
            if (scope.Warrant != null || scope.Warrant != undefined) {
                scope.Warrant.REFWARRANT = '';
                scope.Warrant.ALMACENERAID_e = '';
                scope.Warrant.MTTIPOSOLICITUD_e = '';
            }
        }

        function guardarBorrador() {

            var accion = 'GuardarBorrador';

            if (!scope.CoberturaValida) { bootbox.alert(scope.MensajeCoberturaNoValida); }

            if (scope.existeNumeroWarrant && scope.TipoGarantias.WARRANT == scope.entidad.MTTIPOGARANTIA_e) {
                var Warrantstatic = angular.copy(scope.Warrant);
                verificaExisteNumerosWarrantPorCliente(function () {

                    garantiasService.post("SolicitudDetalle/GuardarBorrador", {
                        //Comentarios: scope.comentarios
                        request: { Solicitud: scope.entidad, SolicitudDPCB: scope.solicitudDPCB, Comentarios: solicitudModalService.comentarios, Notificaciones: solicitudModalService.notificaciones, Warrant: Warrantstatic, SeguroExportacion: scope.SeguroExportacion }
                    },
                        function (data, status, headers, config) {
                            console.log('callbackguardarborrador warrant');
                            scope.entidad = data.d.solicitud;
                            scope.comentarios = [];
                            scope.notificaciones = [];
                            scope.procesar(data, accion);
                        }, function (data, status, headers, config) {
                            bootbox.alert(data.m);
                        });

                });
                //setTimeout(function () { console.log('waiting'); }, 500)


                return false;
            }

            if (!scope.existeNumeroWarrant && scope.CoberturaValida) {
                garantiasService.post("SolicitudDetalle/GuardarBorrador", {
                    //Comentarios: scope.comentarios
                    request: { Solicitud: scope.entidad, SolicitudDPCB: scope.solicitudDPCB, Comentarios: solicitudModalService.comentarios, Notificaciones: solicitudModalService.notificaciones, Warrant: scope.Warrant, SeguroExportacion: scope.SeguroExportacion }
                },
                    function (data, status, headers, config) {

                        scope.entidad = data.d.solicitud;
                        scope.comentarios = [];
                        scope.notificaciones = [];
                        scope.procesar(data, accion);
                    }, function (data, status, headers, config) {
                        bootbox.alert(data.m);
                    });
            }
        };

        function enviarMensajeAvisoPrevio() {
            if (detectaTipoGarantiaMensaje) {
                bootbox.alert({
                    message: detectaTipoGarantiaMensaje,
                    callback: enviar
                });
            } else {
                enviar();
            }

        }

        function enviar() {

            //valida los archivos cargados del checklistdocumentario (solo obligatorios)
            var requiereMotivo = false;
            var mensajeConfirmacion = "";

            //verificaExisteNumerosWarrantPorCliente();            

            if (!scope.CoberturaValida) {
                //bootbox.alert(scope.MensajeCoberturaNoValida);
                ValidacionPorLimiteDeCoberturaYEnvioCorreo();
            }
            if (scope.existeNumeroWarrant && scope.TipoGarantias.WARRANT == scope.entidad.MTTIPOGARANTIA_e) {

                verificaExisteNumerosWarrantPorCliente(
                    function () {
                        var pag = 1;
                        var page = pag == 1 ? scope.paginaactualA = 1 : scope.paginaactualA;
                        scope.estaCargandoA = true;
                        garantiasService.post("GestionChecklist/Documentos", {
                            idSolicitud_e: scope.entidad.SOLICITUDID_e,
                            tipoGarantia: scope.entidad.MTTIPOGARANTIA_e,
                            page: page,
                            sort: "CHECKID",
                            sortDir: "ASC"
                        },
                            function (data, status, headers, config) {
                                scope.estaCargando = false;
                                scope.checkListDocumentario = data.d;
                                //if (scope.checkListDocumentario.length <= 0) {
                                //    var msj = "¡No se ha indicado un checklist!";
                                //    bootbox.alert(msj, function (r) {
                                //    });
                                //}
                                //else {
                                var contadorObligatorios = 0;
                                angular.forEach(scope.checkListDocumentario, function (value, key) {
                                    if (value.OBLIGATORIO && value.DocumentoDescripcion === '') {
                                        contadorObligatorios++;
                                    }
                                });

                                if (contadorObligatorios > 0) {
                                    requiereMotivo = true;
                                    scope.entidad.ConArchivosIncompletos = true;
                                }

                                if (requiereMotivo) mensajeConfirmacion = "Aún no se han cargado todos los archivos del checklist. ¿Desea continuar con los archivos incompletos?";
                                else mensajeConfirmacion = "¿Está seguro de Enviar este registro ?";

                                bootbox.confirm(mensajeConfirmacion, function (r) {
                                    if (r === true) {
                                        var modalInstance = $uibModal.open({
                                            templateUrl: 'mdSolicitudIngresaComentario',
                                            controller: 'solicitudIngresaComentarioController as ctr',
                                            size: 'mg',
                                            resolve: {
                                                args: function () {
                                                    return {
                                                        titulo: "Ingrese comentario para enviar solicitud",
                                                        requiereMotivo: requiereMotivo,
                                                        requiereComentario: !requiereMotivo,
                                                        TipoMotivoEnviarSolicitud: scope.TipoMotivoEnviarSolicitud
                                                    };
                                                }
                                            }
                                        });

                                        modalInstance.result.then(function (resp) {
                                            if (resp !== null && resp.cerrar === true) {
                                                scope.entidad.ComentarioSolicitudEnvio = resp.comentario;
                                                scope.entidad.MotivoComentarioSolicitudEnvio = resp.motivo;
                                                //scope.entidad.ConArchivosIncompletos = resp.motivo === undefined ? false : resp.motivo === '' ? false : resp.motivo === null ? false : true;
                                                scope.procesaEnviar();
                                            }

                                        }, function () { });
                                    }
                                });
                                //}
                            }, function (data, status, headers, config) {
                                scope.estaCargando = false;
                                scope.checkListDocumentario = [];
                                bootbox.alert(scope.MsjError);
                            });
                    }
                );
                return false;//salimos
            }

            if (!scope.existeNumeroWarrant && scope.CoberturaValida) {
                var pag = 1;
                var page = pag == 1 ? scope.paginaactualA = 1 : scope.paginaactualA;
                scope.estaCargandoA = true;
                garantiasService.post("GestionChecklist/Documentos", {
                    idSolicitud_e: scope.entidad.SOLICITUDID_e,
                    tipoGarantia: scope.entidad.MTTIPOGARANTIA_e,
                    page: page,
                    sort: "CHECKID",
                    sortDir: "ASC"
                },
                    function (data, status, headers, config) {
                        scope.estaCargando = false;
                        scope.checkListDocumentario = data.d;
                        //if (scope.checkListDocumentario.length <= 0) {
                        //    var msj = "¡No se ha indicado un checklist!";
                        //    bootbox.alert(msj, function (r) {
                        //    });
                        //}
                        //else {
                        var contadorObligatorios = 0;
                        angular.forEach(scope.checkListDocumentario, function (value, key) {
                            if (value.OBLIGATORIO && value.DocumentoDescripcion === '') {
                                contadorObligatorios++;
                            }
                        });

                        if (contadorObligatorios > 0) {
                            requiereMotivo = true;
                            scope.entidad.ConArchivosIncompletos = true;
                        }

                        if (requiereMotivo) mensajeConfirmacion = "Aún no se han cargado todos los archivos del checklist. ¿Desea continuar con los archivos incompletos?";
                        else mensajeConfirmacion = "¿Está seguro de Enviar este registro ?";

                        bootbox.confirm(mensajeConfirmacion, function (r) {
                            if (r === true) {
                                var modalInstance = $uibModal.open({
                                    templateUrl: 'mdSolicitudIngresaComentario',
                                    controller: 'solicitudIngresaComentarioController as ctr',
                                    size: 'mg',
                                    resolve: {
                                        args: function () {
                                            return {
                                                titulo: "Ingrese comentario para enviar solicitud",
                                                requiereMotivo: requiereMotivo,
                                                requiereComentario: !requiereMotivo,
                                                TipoMotivoEnviarSolicitud: scope.TipoMotivoEnviarSolicitud
                                            };
                                        }
                                    }
                                });

                                modalInstance.result.then(function (resp) {
                                    if (resp !== null && resp.cerrar === true) {
                                        scope.entidad.ComentarioSolicitudEnvio = resp.comentario;
                                        scope.entidad.MotivoComentarioSolicitudEnvio = resp.motivo;
                                        //scope.entidad.ConArchivosIncompletos = resp.motivo === undefined ? false : resp.motivo === '' ? false : resp.motivo === null ? false : true;
                                        scope.procesaEnviar();
                                    }

                                }, function () { });
                            }
                        });
                        //}
                    }, function (data, status, headers, config) {
                        scope.estaCargando = false;
                        scope.checkListDocumentario = [];
                        bootbox.alert(scope.MsjError);
                    });
            }

        };

        function procesaEnviar() {

            var accion = 'Enviar';

            garantiasService.post("SolicitudDetalle/Enviar", {
                request: {
                    //Comentarios: scope.comentarios
                    Solicitud: scope.entidad, SolicitudDPCB: scope.solicitudDPCB, Comentarios: solicitudModalService.comentarios, Notificaciones: solicitudModalService.notificaciones,
                    Warrant: scope.Warrant, SeguroExportacion: scope.SeguroExportacion
                }
            },

                function (data, status, headers, config) {

                    //console.log(data);
                    //scope.entidad = data.d.solicitud;
                    scope.comentarios = [];
                    scope.notificaciones = [];

                    //if(data.d.solicitud.existe_alerta){
                    //    bootbox.alert(data.d.solicitud.mensaje_alerta);
                    //}
                    scope.procesar(data, accion);
                    //bootbox.alert(data.m);

                }, function (data, status, headers, config) {
                    bootbox.alert(data.m);
                });
        }

        function EnvioCorreo() {

            var tipoGarantia = scope.entidad.MTTIPOGARANTIA_e;
            var garantias = scope.TipoGarantias;

            switch (tipoGarantia) {
                case garantias.FIANZA_SOLIDARIA: break;
                case garantias.DEPOSITO_A_PLAZO: break;
                case garantias.CERTIFICADO_BANCARIO: break;
                case garantias.SEGURO_DE_EXPORTACION:
                    if (!scope.CoberturaValida) { bootbox.alert(scope.MensajeCoberturaNoValida); }
                    else {
                        bootbox.confirm("¿Está seguro de enviar el aviso a SEPYMEX?", function (confirmo) {
                            if (confirmo) {
                                EnviarCorreo();
                            }

                        });
                    }

                    break;
                case garantias.WARRANT: break;
            }
        }

        function EnviarCorreo() {
            garantiasService.post("SolicitudDetalle/EnviarCorreo", {
                request: { Solicitud: scope.entidad, SeguroExportacion: scope.SeguroExportacion }
            },
                function (data, status, headers, config) {

                    bootbox.alert("Se envió con éxito.");

                }, function (data, status, headers, config) {
                    bootbox.alert(data.m);
                });
        };
        //#endregion

        //#region POPUPs

        function cargarCheckListDocumentario() {
            //scope.checkListDocumentario = null;
            //scope.checkListDocumentario = [];
            //scope.buscarDocumentoChk(1);
            //if (scope.checkListDocumentario.length > 0) {
            var pag = 1;
            var page = pag == 1 ? scope.paginaactualA = 1 : scope.paginaactualA;
            scope.estaCargandoA = true;
            garantiasService.post("GestionChecklist/Documentos", {
                idSolicitud_e: scope.entidad.SOLICITUDID_e,
                tipoGarantia: scope.entidad.MTTIPOGARANTIA_e,
                page: page,
                sort: "CHECKID",
                sortDir: "ASC"
            },
                function (data, status, headers, config) {
                    scope.estaCargando = false;
                    scope.checkListDocumentario = data.d;
                    if (scope.checkListDocumentario.length <= 0) {
                        var msj = "¡No se ha indicado un checklist!";
                        bootbox.alert(msj, function (r) {
                        });
                    }
                    else {

                        var modalInstance = $uibModal.open({
                            backdrop: "static",
                            keyboard: false,
                            templateUrl: 'mdCheckListDocumentos',
                            controller: 'gestionChecklistDocumentosController as ctr',
                            size: 'lg',
                            resolve: {
                                args: function () {
                                    return {
                                        idSolicitud_e: scope.entidad.SOLICITUDID_e,
                                        tipoGarantia: scope.entidad.MTTIPOGARANTIA_e
                                    };
                                }
                            }
                        });
                        modalInstance.result.then(function (resp) {
                            if (resp !== null) {
                                scope.checkListDocumentario = resp.checkListDocumentos;
                            }
                        }, function () {
                            //
                        });
                    }

                }, function (data, status, headers, config) {
                    scope.estaCargando = false;
                    scope.checkListDocumentario = [];
                    bootbox.alert(scope.MsjError);
                });

            //var modalInstance = $uibModal.open({
            //    backdrop: "static",
            //    keyboard: false,
            //    templateUrl: 'mdCheckListDocumentos',
            //    controller: 'gestionChecklistDocumentosController as ctr',
            //    size: 'lg',
            //    resolve: {
            //        args: function () {
            //            return {
            //                idSolicitud_e: scope.entidad.SOLICITUDID_e,
            //                tipoGarantia: scope.entidad.MTTIPOGARANTIA_e
            //            };
            //        }
            //    }
            //});
            //modalInstance.result.then(function (resp) {
            //    if (resp !== null) {
            //        scope.checkListDocumentario = resp.checkListDocumentos;
            //    }
            //}, function () {
            //    //
            //});
            //}
        };

        function cargarLog() {
            var modalInstance = $uibModal.open({
                backdrop: "static",
                keyboard: false,
                templateUrl: 'mdLogCambios',
                controller: 'consultarLogCambioBuscarController as ctr',
                size: 'lg',
                resolve: {
                    args: function () {
                        return {
                            idSolicitud_e: scope.entidad.SOLICITUDID_e
                        };
                    }
                }
            });

            modalInstance.result.then(function (resp) {
                if (resp.cerrar === true) {
                    //scope.limpiar();
                    //scope.buscar(1);
                }
            }, function () {
                //
            });
        };

        function cargarSaldos() {
            var modalInstance = $uibModal.open({
                templateUrl: 'mdEditarAlmacenerasSaldos',
                controller: 'gestionAlmacenerasSaldosController as ctr',
                resolve: {
                    args: function () {
                        return { id_e: '' };
                    }
                },
                size: 'lg'//,
            });
        }
        //#endregion

        //#region CLIENTE
        function buscarClientePorCodigo()
        {            
            if (scope.entidad !== null && scope.entidad.CODCLIENTE !== null) {
                var dataObj = {
                    CodigoCliente: scope.entidad.CODCLIENTE
                };
                scope.buscarCliente(dataObj);
            }
            else {
                scope.abreBuscarCliente();
            }
        };

        function buscarClientePorDescripcion() {
            if (scope.entidad !== null && scope.entidad.NOMCLIENTE !== undefined && scope.entidad.NOMCLIENTE !== null && scope.entidad.NOMCLIENTE.length >= 3) {
                var dataObj = {
                    nombre: scope.entidad.NOMCLIENTE
                };
                scope.buscarCliente(dataObj);
            }

            else {
                bootbox.alert('Ingrese al menos 3 caracteres.');
                scope.limpiarCliente();
                return;
            }
        };

        function setearCliente(cliente) {
            console.log(cliente);
            if (cliente == undefined) return;
            scope.entidad.CODCLIENTE = cliente.codigoCliente;
            scope.entidad.NOMCLIENTE = cliente.nombre + " " + cliente.apellidoPaterno + " " + cliente.apellidoMaterno;

            if (cliente.nombreRazonSocial !== null && cliente.nombreRazonSocial.trim() !== "" && cliente.nombreRazonSocial.trim().length > 0) {
                scope.entidad.NOMCLIENTE = cliente.nombreRazonSocial;
            }

            scope.entidad.CODFUNCIONARIO = cliente.codFuncionario;
            scope.entidad.FUNCIONARIO = cliente.funcionario;
            scope.entidad.CLIENTEID = cliente.idCliente;
            scope.entidad.CODBANCA = cliente.idBanca;
            scope.entidad.BANCA = cliente.banca;
            scope.entidad.CODOFICINA = cliente.idOficina;
            scope.entidad.OFICINA = cliente.nombreOficina;
            scope.entidad.NRODOCUMENTO = cliente.numeroDocumento;
            scope.entidad.TIPODOCUMENTO = cliente.idTipoDocumento;
            scope.entidad.numeroDocumento = cliente.numeroDocumento;
            scope.entidad.idTipoDocumento = cliente.idTipoDocumento;
            scope.entidad.DESTIPODOCUMENTO = cliente.TipoDocumento_Des;

            scope.entidad.Nombre = cliente.nombre;
            scope.entidad.apellidoPaterno = cliente.apellidoPaterno;
            scope.entidad.apellidoMaterno = cliente.apellidoMaterno;
            scope.entidad.IdTipoPersona = cliente.idTipoPersona;
            scope.entidad.NRODOCUMENTO = cliente.numeroDocumento;
            scope.entidad.TAMANIOCLIENTE = cliente.tamanioCliente;

            scope.entidad.RazonSocial = cliente.nombreRazonSocial;
            scope.entidad.Nombre = cliente.nombre;
            scope.entidad.IdTipoPersona = cliente.idTipoPersona;
            scope.entidad.TipoPersona = cliente.idTipoPersona;

            scope.codCliEnable = false;
            scope.obtenerNumerosWarrantPorCliente();
        };

        function abreBuscarCliente(nombre = '') {
            var modalInstance = $uibModal.open({
                templateUrl: 'mdBuscadorCliente',
                controller: 'clientesBandejaBuscarController as ctr',
                size: 'lg',
                resolve: {
                    args: function () {
                        return {
                            nombre: nombre,
                            flagDireccion: ''
                        };
                    }
                }
            });

            modalInstance.result.then(function (resp) {

                if (resp.Cliente !== null) {
                    scope.setearCliente(resp.Cliente);
                }

            }, function () { });
        };

        function buscarCliente(dataObj) {
            garantiasService.post("ClientesBandeja/BuscarCliente", dataObj,
                function (data, status, headers, config) {
                    //Si no se encontraron resultados
                    if (data.d === null || data.d == undefined || data.d.length === 0) {
                        bootbox.alert('No se encontró un cliente');
                        scope.limpiarCliente();
                        return;
                    }
                    if (data.d !== undefined || data.d !== null) {
                        //debugger;
                        if (data.d[0]) {
                            scope.abreBuscarCliente(scope.entidad.NOMCLIENTE);
                        }
                        else {

                            scope.setearCliente(data.d);
                        }
                    }

                    //if (data.d.length == 1) {
                    //    scope.setearCliente(data.d[0]);
                    //}
                    //else if (data.d.length > 1) {
                    //    scope.abreBuscarCliente(scope.entidad.NOMCLIENTE);
                    //}
                    //else {

                    //}

                    //

                });
        };

        function CargarDepositoPlazoFijo() {
            var nroplazo;
            nroplazo = scope.entidad.NRODEPOSITO;
            //limpiarDepositoPlazo();
            var dataObj = { NUMERO: nroplazo };
            garantiasService.post("SolicitudDetalle/BuscarPlazoFijo", dataObj,
                function (data, status, headers, config) {
                    if (data.d.length != 0) {
                        scope.entidad.CODCLIENTEP = data.d[0].CODCLIENTE;
                        scope.entidad.CODTIPODOCUMENTO = data.d[0].CODTIPODOCUMENTO;
                        scope.entidad.DESDOCUMENTO = data.d[0].DESDOCUMENTO;
                        scope.entidad.NRODOCUMENTOP = data.d[0].NRODOCUMENTO;
                        scope.entidad.TIPO = data.d[0].TIPO;
                        scope.entidad.APPATERNO = data.d[0].APPATERNO;
                        scope.entidad.APMATERNO = data.d[0].APMATERNO;
                        scope.entidad.NOMBRES = data.d[0].NOMBRES;
                        scope.entidad.NRODPCB = data.d[0].NRODPCB;
                        scope.entidad.NRODEPOSITO = data.d[0].NRODEPOSITO;
                        scope.entidad.CODMONEDA = data.d[0].CodMUlti;
                        scope.entidad.IMPORTE = data.d[0].IMPORTE;
                        scope.entidad.MancomunoL = data.d[0].MancomunoL;
                        scope.MancomunosView = data.d[0].MancomunoL;
                        if (scope.MancomunosView !== null) {
                            var flag = true;
                            scope.formVisibility = flag;
                        }
                    }
                    else {
                        var msj = "¡El deposito N°   " + nroCB + "   no existe!";
                        bootbox.alert(msj, function (r) {
                            limpiarDepositoPlazo();
                        });
                    }
                }, function (data, status, headers, config) {
                    bootbox.alert(scope.MsjError);
                });
        };
        function mancomunos() {
            var pag = 1;
            var page = pag === 1 ? scope.paginaactualA = 1 : scope.paginaactualA;
            scope.estaCargandoA = true;
            garantiasService.post("SolicitudDetalle/BuscarMancomuno", {
                NUMERO: scope.entidad.NRODEPOSITO,
                CODPERSONA: scope.entidad.CODCLIENTEP,
                page: page,
                sort: "CODMANCOMUNO",
                sortDir: "ASC"
            },
                function (data, status, headers, config) {
                    scope.estaCargando = false;
                    scope.MancomunosView = data.d;
                    scope.totalmancomuno = data.tt;
                }, function (data, status, headers, config) {
                    scope.estaCargando = false;
                    scope.mancomuno = [];
                    scope.totalmancomuno = 0;
                    bootbox.alert(scope.MsjError);
                });
        };

        function verMancomunos() {
            var modalInstance = $uibModal.open({
                templateUrl: 'mdMancomunos',
                controller: 'solicitudDetalleBuscarMancomunoController as ctr',
                size: 'lg',
                resolve: {
                    args: function () {
                        return { NUMERO: scope.entidad.NRODEPOSITO, CODPERSONA: scope.entidad.CODCLIENTEP };
                    }
                }
            });

            modalInstance.result.then(function (resp) {
                //if (resp.cerrar === true) { }
            }, function () {

            });
        };
        function limpiarCliente() {
            scope.entidad.CODFUNCIONARIO = null;
            scope.entidad.CLIENTEID = null;
            scope.entidad.CODCLIENTE = null;
            scope.entidad.NOMCLIENTE = null;
            scope.entidad.FUNCIONARIO = null;
            scope.entidad.CODBANCA = null;
            scope.entidad.BANCA = null;
            scope.entidad.CODOFICINA = null;
            scope.entidad.OFICINA = null;
            scope.entidad.NRODOCUMENTO = null;
            scope.entidad.TIPODOCUMENTO = null;
            scope.entidad.TAMANIOCLIENTE = null;
            scope.codCliEnable = true;
            limpiarGarantias(); //en warrant debe limpiarse los campos cuando se limpia cliente
        };

        function limpiarDepositoPlazo() {
            scope.entidad.CODCLIENTEP = null;
            scope.entidad.CODTIPODOCUMENTO = null;
            scope.entidad.DESDOCUMENTO = null;
            scope.entidad.NRODOCUMENTOP = null;
            scope.entidad.TIPO = null;
            scope.entidad.APPATERNO = null;
            scope.entidad.APMATERNO = null;
            scope.entidad.NOMBRES = null;
            scope.entidad.NRODEPOSITO = null;
            scope.entidad.MONEDA = null;
            scope.entidad.CODMONEDA = null;
            scope.entidad.IMPORTE = null;
            scope.entidad.MancomunoL = null;
            scope.MancomunosView = null;
            scope.solicitudDPCB.PROPIETARIO = null;
            scope.solicitudDPCB.MONEDA_e = null;
            scope.solicitudDPCB.IMPORTE = null;
            scope.solicitudDPCB.CODPROPIETARIO = null;
            scope.solicitudDPCB.NUMERO = null;
            scope.tieneMancomunos = true;
            $scope.$apply();
        };

        function buscarDocumentoChk(pag) {
            var page = pag == 1 ? scope.paginaactualA = 1 : scope.paginaactualA;
            scope.estaCargandoA = true;
            garantiasService.post("GestionChecklist/Documentos", {
                idSolicitud_e: scope.entidad.SOLICITUDID_e,
                tipoGarantia: scope.entidad.MTTIPOGARANTIA_e,
                page: page,
                sort: "CHECKID",
                sortDir: "ASC"
            },
                function (data, status, headers, config) {
                    scope.estaCargando = false;
                    //scope.checklistdocumentos = data.d;
                    //scope.cargarCheckListDocumentario = data.d;
                    scope.checkListDocumentario = data.d;
                    if (scope.checkListDocumentario.length <= 0) {
                        var msj = "¡No se ha indicado un checklist!";
                        bootbox.alert(msj, function (r) {
                        });
                    }
                    //$scope.$apply();
                    //scope.checklistdocumentosView = [].concat(scope.checklistdocumentos);
                    //scope.totalchecklistdocumentos = data.tt;
                }, function (data, status, headers, config) {
                    scope.estaCargando = false;
                    scope.checkListDocumentario = [];
                    //scope.totalchecklistdocumentos = 0;
                    bootbox.alert(scope.MsjError);
                });
        };

        function procesar(data, accion) {
            if (data.r) {
                setInterval(function () {
                    if (accion !== 'GuardarBorrador')
                        window.location = garantiasService.prefix() + "GestionSolicitud/Index";
                    else
                        editar(scope.entidad.SOLICITUDID_e, scope.entidad.MTTIPOGARANTIA_e, scope.entidad.MTESTADOSOLICITUD);
                }, 2500);
            }
        }

        function buscarDocumentos(pag) {
            var page = pag == 1 ? scope.paginaactualA = 1 : scope.paginaactualA;
            scope.estaCargandoA = true;
            garantiasService.post("GestionDocumentos/Buscar", {
                idSolicitud_e: scope.entidad.SOLICITUDID_e,
                lectura: false,
                tipoGarantia: scope.entidad.MTTIPOGARANTIA_e,
                usuario: 0,
                page: page,
                sort: "DOCUMENTOID",
                sortDir: "ASC",
                nroSolicitud: ""
            },
                function (data, status, headers, config) {
                    scope.estaCargando = false;
                    scope.listadocumentoChk = data.d.lista;

                }, function (data, status, headers, config) {
                    scope.estaCargando = false;
                });
        };
        function editar(id, tg, eg) {
            //var postEditarFunc = function () { postEditar(id); };
            //validarBloqueo(id, postEditarFunc);
            postEditar(id, tg, eg);
        }

        function postEditar(id, tg, eg) {
            if (id === null) return;

            //var tipoGarantia = scope.entidad.MTTIPOGARANTIA;
            //var estadoSolicitud = scope.entidad.MTESTADOSOLICITUD;
            var tipoGarantia = tg;
            var estadoSolicitud = eg;
            var estadoEncontrado = null;
            var strControllador = "";
            switch (tipoGarantia) {
                case scope.TipoGarantias.FIANZA_SOLIDARIA:
                    //strControllador = 'GarantiaFianzaSolidaria/IndexGarantia';
                    estadoEncontrado = buscarEstado(scope.EstadoSolicitudEdicion, estadoSolicitud);
                    if (estadoEncontrado) { strControllador = 'SolicitudDetalle/Index?id_e=' + id + '&tg_e=' + tipoGarantia; }
                    else { strControllador = 'GarantiaFianzaSolidaria/IndexGarantia'; }
                    break;
                case scope.TipoGarantias.DEPOSITO_A_PLAZO:
                    estadoEncontrado = buscarEstado(scope.EstadoSolicitudEdicion, estadoSolicitud);
                    if (estadoEncontrado) { strControllador = 'SolicitudDetalle/Index?id_e=' + id + '&tg_e=' + tipoGarantia; }
                    else { strControllador = 'GarantiaDepositoPlazo/IndexGarantia'; }
                    break;
                case scope.TipoGarantias.CERTIFICADO_BANCARIO:
                    estadoEncontrado = buscarEstado(scope.EstadoSolicitudEdicion, estadoSolicitud);
                    if (estadoEncontrado) { strControllador = 'SolicitudDetalle/Index?id_e=' + id + '&tg_e=' + tipoGarantia; }
                    else { strControllador = 'GarantiaDPCB/IndexGarantia'; }
                    break;
                case scope.TipoGarantias.SEGURO_DE_EXPORTACION:
                    //strControllador = 'GarantiaSeguroExportacion/IndexGarantia';
                    estadoEncontrado = buscarEstado(scope.EstadoSolicitudEdicion, estadoSolicitud);
                    if (estadoEncontrado) { strControllador = 'SolicitudDetalle/Index?id_e=' + id + '&tg_e=' + tipoGarantia; }
                    else { strControllador = 'GarantiaSeguroExportacion/IndexGarantia'; }
                    break;
                case scope.TipoGarantias.WARRANT:
                    //strControllador = 'GarantiaWarrant/IndexGarantia';
                    estadoEncontrado = buscarEstado(scope.EstadoSolicitudEdicion, estadoSolicitud);
                    if (estadoEncontrado) { strControllador = 'SolicitudDetalle/Index?id_e=' + id + '&tg_e=' + tipoGarantia; }
                    else { strControllador = 'GarantiaWarrant/IndexGarantia'; }
                    break;
                case scope.TipoGarantias.AVALES:
                    //strControllador = 'GarantiaAval/IndexGarantia';
                    estadoEncontrado = buscarEstado(scope.EstadoSolicitudEdicion, estadoSolicitud);
                    if (estadoEncontrado) { strControllador = 'SolicitudDetalle/Index?id_e=' + id + '&tg_e=' + tipoGarantia; }
                    else { strControllador = 'GarantiaAval/IndexGarantia'; }
                    break;
            }
            if (strControllador == "") return;

            var prefix = $('#urlBase').val();
            localStorage.setItem("__s", id);
            localStorage.setItem("__g", null);
            localStorage.setItem("__v", "");
            window.location = prefix + strControllador;
        }

        function buscarEstado(lista, id) {
            var encontrado = false;
            lista.forEach(function (element) {
                if (element.Valor === id) {
                    encontrado = true;
                }
            });
            return encontrado;
        }

        function actualizaBotonEnvioCorreo(data) {

            //SI 3iP0grohxQyRbMLkdy4r0A==
            //NO hBDsr-GbnNpnmXJmgkPiPQ==
            if (data == scope.CodigoSIEncriptado)// SI
            {
                scope.DeshabilitarEnvioCorreo = false;
                scope.MostrarEnvioCorreo = true;
            } else {
                scope.DeshabilitarEnvioCorreo = true;
                scope.MostrarEnvioCorreo = false;
            }
        }


        //tasaciones
        function agregarTasacion() {

            var _tasacionE = {};
            _tasacionE.correlativo = 1;
            _tasacionE.numTasacion = null;
            _tasacionE.producto = null;
            _tasacionE.proyecto = null;
            _tasacionE.numTasacion = null;
            
            scope.tasacionesE.push(_tasacionE);

            var contador = 1;
            angular.forEach(scope.tasacionesE, function (value, key) {
                value.correlativo = contador++;
            });
            //$scope.$apply();

        }

        function eliminarTasacion(item) {
            bootbox.confirm("¿Está seguro de eliminar este registro?", function (r) {
                if (r == true) {
                    var index = scope.tasacionesE.indexOf(item);
                    scope.tasacionesE.splice(index, 1);

                    var contador = 1;
                    angular.forEach(scope.tasacionesE, function (value, key) {
                        value.correlativo = contador++;
                    });
                    $scope.$apply();
                }
            });
        }

        function buscarTasaciones() {
            var modalInstance = $uibModal.open({
                templateUrl: 'mdTasaciones',
                controller: 'TasacionesController as ctr',
                backdrop: 'static',
                resolve: {
                    args: function () {
                        return {
                            codCliente: scope.entidad.CODCLIENTE
                        };
                    }
                },
                size: 'lg'//,
            });

            modalInstance.result.then(function (resp) {
                if (resp.cerrar === true) {

                    if (resp.tasacion !== null) {
                        
                        //scope.entidad.numTasacion = resp.tasacion.NroTasacion;
                        if (scope.tasacionesE.length > 0) {
                            scope.tasacionesE.push(resp.tasacion);

                        }
                        
                    }

                }
            }, function () {
                //
            });
        };

        //agregar imagen al carrusel
        function agregarImagen() {

            if (angular.element("#imagenInforme")[0].files.length == 0) {
                bootbox.alert("Debe seleccionar un archivo");
                return false;
            }

            var input = angular.element("#imagenInforme")[0];

            var tamArchivo = (input.files[0].size / 1000000);
            if (tamArchivo > scope.tamMaximo) {
                bootbox.alert("El tamaño del archivo supera el límite. Límite permitido (" + scope.tamMaximo + " MB)");
                return false;
            }

            var extension = input.files[0].name.split('.').pop();
            if (".jpg, .jpeg, .png".toLowerCase().indexOf(extension.toLowerCase()) === -1) {
                bootbox.alert("Tipo de archivo no es permitido. Tipos permitidos (.jpg, .jpeg, .png)");
                return false;
            }
            scope.imagen = {};
            scope.imagen.TasacionId_e = scope.id_e;
            //scope.imagen.Contador = scope.uploader.queue.length + 1;
            scope.imagen.TipoMime = extension;
            scope.imagen.Tamanio = Math.round(tamArchivo * 100) / 100;// + " MB";
            //scope.imagen.UsuarioRegistra_Usuario = scope.UsuarioAD;
            scope.imagen.FechaRegistra = js_dd_mm_yyyy();//new Date();//

            scope.uploaderImagen.addToQueue(input.files[0], { formData: [scope.imagen] });
            //setea valores
            scope.nombreImagen = "";
            return true;
        }

        scope.uploaderImagen = new FileUploader({

            url: garantiasService.prefix() + "Util/GuardarImagen",
            //headers: getHttpConfig().headers,
            onAfterAddingFile: function (item) {
                item.upload();
                scope.estaCargandoImagen = true;
            },
            onSuccessItem: function (item, response, status, headers) {
                scope.imagen.TasacionId_e = response.d.TasacionId_e;
                scope.imagen.ValUrlAvatar = response.d.ValUrlAvatar;
                scope.imagen.ValUrlAvatar_Image = response.d.ValUrlAvatar_Image;
                scope.imagen.ValUrlAvatar_ImageMin = response.d.ValUrlAvatar_ImageMin;
                scope.imagen.item = response.d.ValUrlAvatar_ImageMin;
                //scope.images = [];
                scope.images.push(scope.imagen);
                //scope.images = [
                //    {
                //        'url': scope.imagen.ValUrlAvatar_Image + '?' + new Date().getTime(),//refresh
                //        'thumbUrl': scope.imagen.ValUrlAvatar_ImageMin + '?' + new Date().getTime()//refresh
                //    }
                //];

                scope.mostrarCarrusel = true;
                scope.estaCargandoImagen = false;

                
           
            },
            onErrorItem: function (item, response, status, headers) {
                scope.estaCargandoImagen = false;

            }

        });
        
        function js_dd_mm_yyyy() {
            var now = new Date();
            var year = "" + now.getFullYear();
            var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
            var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
            var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
            var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
            var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
            return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
        }
        
        function eliminarImagen(image) {
           scope.images.splice(scope.images.indexOf(image), 1);
        }
    }
})(); 
