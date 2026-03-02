/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Context/ProviderModales";

import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import TecladoCierre from "../Teclados/TecladoCierre";
import Validator from "../../Helpers/Validator";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";
import IngresarNumeroORut from "./IngresarNumeroORut";
import SmallDangerButton from "../Elements/SmallDangerButton";
import TiposDescuentos from "../../definitions/TiposDescuentos";
import ModelConfig from "../../Models/ModelConfig";
import BalanzaDigi from "../../Models/BalanzaDigi";
import LogObject from "../../Models/LogObject";
import SeleccionarProductos from "../BoxOptionsLite/TableSelect/SeleccionarProductos";


export default ({
  openDialog,
  setOpenDialog,

}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showAlert,
  } = useContext(SelectedOptionsContext);

  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);

  const [productosBalanza, setProductosBalanza] = useState([])
  const [productosPos, setProductosPos] = useState([])
  const [verSeleccionarProductosPos, setVerSeleccionarProductosPos] = useState(false)
  const balanza = new BalanzaDigi()

  useEffect(() => {



  }, [])


  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        // setOpenDialog(false)
      }} maxWidth="lg"
      fullWidth>
      <DialogTitle>
        Balanza Digi
      </DialogTitle>
      <DialogContent>


        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          position: "relative"
        }}>


          <Grid item xs={12} sm={12} md={12} lg={12}>

            <TableContainer
              component={Paper}
            // style={{
            //   overflowX: "auto"
            // }}
            >
              <Table>
                <TableHead sx={{
                  background: "#859398",
                  // height: "30%"
                  // height: "60px"
                }}>
                  <TableRow>
                    <TableCell sx={{
                      textAlign: "center"
                    }}>
                      Codigo
                    </TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{
                  // maxHeight: "400px",
                  // maxHeight: "200px",
                  // overflowY: "auto"


                }}>
                  {productosBalanza.map((prodBalanza, ix) => (
                    <TableRow key={ix}>
                      <TableCell sx={{
                        textAlign: "center"
                      }}>{parseInt(prodBalanza.plu)}</TableCell>
                      <TableCell>{prodBalanza.descripcion}</TableCell>
                      <TableCell>${System.formatMonedaLocal(prodBalanza.precio, false)}</TableCell>
                      <TableCell>
                        <SmallButton textButton={"Detalles"} actionButton={() => {
                          showAlert(<textarea cols={100} rows={50} value={LogObject(prodBalanza)} readOnly />)
                        }} />
                      </TableCell>
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>


        </Grid>




      </DialogContent>
      <DialogActions>


        <SeleccionarProductos
          productosSeleccionados={productosPos}
          setProductosSeleccionados={setProductosPos}
          openDialog={verSeleccionarProductosPos}
          setOpenDialog={setVerSeleccionarProductosPos}
        />
        <SmallButton
          style={{
            backgroundColor: "#99017D"
          }}
          textButton={"Productos del pos"}
          actionButton={() => {
            setVerSeleccionarProductosPos(true)
          }} />

        <SmallDangerButton textButton={"Vaciar la balanza"} actionButton={() => {
          balanza.eliminarProductos((res) => {
            if (res.status) {
              showAlert("Vaciada correctamente")
            }
          })
        }} />

        <SmallButton textButton={"Enviar a la balanza"} actionButton={() => {
          balanza.enviarProductos({
            productosPos
          }, (res) => {
            if (res.status) {
              showAlert("Enviado correctamente")
            }
          })
        }} />

        <SmallButton textButton={"Recibir de la balanza"} actionButton={() => {
          balanza.recibirProductos((res) => {
            if (res.status) {
              showAlert("Recibido correctamente")
            }
          })
        }} />


        <SmallButton textButton={"Leer de la balanza"} actionButton={() => {
          balanza.leerProductos((res) => {
            if (res.status && res.info.length > 0) {
              setProductosBalanza(res.info)
            }
          })
        }} />

        <Button
          onClick={() => {
            setOpenDialog(false)
            setProductosBalanza([])
          }}
        >Volver</Button>
      </DialogActions>
    </Dialog >
  );
};
