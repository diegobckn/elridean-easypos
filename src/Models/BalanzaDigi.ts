import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import axios from "axios";
import Model from './Model.js';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';
import Singleton from './Singleton.ts';
import dayjs from 'dayjs';
import SoporteTicket from './SoporteTicket.ts';
import Env from '../definitions/Env.ts';
import ModelSingleton from './ModelSingleton.ts';


class BalanzaDigi extends ModelSingleton {

  socket: WebSocket | null = null

  static detectandoConexion = false
  static primeraConexion = false

  constructor() {
    super()
    // this.sesion = new StorageSesion("balanza");
  }

  hacerAccion(accion: string, callbackOk: any, objetoAEnviar: any = {}) {
    console.log("pedirProductos")
    var me = BalanzaDigi.getInstance();

    objetoAEnviar.accion = accion

    me.socket = new WebSocket(ModelConfig.get("urlServicioDeteccionPeso"));
    me.socket.onopen = () => {
      console.log("Conectado al servidor WebSocket");
      me.socket.send(JSON.stringify(objetoAEnviar));
    };

    me.socket.onmessage = (event: any) => {
      const formatResponse = JSON.parse(event.data)
      console.log("Mensaje recibido:", formatResponse);
      callbackOk(formatResponse)
    };

    me.socket.onerror = (error: any) => {
      console.error(" Error en WebSocket:", error);
    };

    me.socket.onclose = (event: any) => {
      console.log(" Conexión WebSocket cerrada");
      console.warn('Codigo de conexión cerrada:', event.code);
      console.warn('Motivo de conexión cerrada:', event.reason);
    };
  }

  eliminarProductos(callbackOk: any) {
    this.hacerAccion("eliminarTodos", callbackOk)
  }

  enviarProductos(prods: any, callbackOk: any) {
    this.hacerAccion("enviarTodos", callbackOk, prods)
  }

  recibirProductos(callbackOk: any) {
    this.hacerAccion("recibirTodos", callbackOk)
  }

  leerProductos(callbackOk: any) {
    this.hacerAccion("leerTodosProductos", callbackOk)
  }

  estadoVales(callbackOk: any) {
    this.hacerAccion("estadoCapturaVales", callbackOk)
  }

};

export default BalanzaDigi;