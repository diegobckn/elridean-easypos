import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import Product from "../../Models/Product";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecProduct from "../BoxOptionsLite/TableSelect/TableSelecProduct";
import ModelConfig from "../../Models/ModelConfig";
import LongClick from "../../Helpers/LongClick";
import ConfirmOption from "../Dialogs/ConfirmOption";
import SmallDangerButton from "../Elements/SmallDangerButton";
import BoxBusquedaRapida from "../BoxOptionsLite/BoxBusquedaRapida";
import ProductButton from "../Elements/ProductButton";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";
import ProductFastSearch from "../../Models/ProductFastSearch";
import Ofertas from "../../Models/Ofertas";
import ProductSold from "../../Models/ProductSold";
import OfertaButton from "../Elements/OfertaButton";

export default ({
  openDialog,
  setOpenDialog
}) => {

  const {
    userData,
    addToSalesData,
    showConfirm,
    showMessage,
    showLoading,
    hideLoading,
    cliente
  } = useContext(SelectedOptionsContext);


  const [prods, setProds] = useState([])

  const getOfertas = () => {
    console.log("getOfertas")
    showLoading("Cargando ofertas...")
    setProds([])
    // setProdfiltereds([])
    Ofertas.getAllOfertas((ofs) => {
      console.log("ofs", ofs)
      setProds(ofs)
      // setProdfiltereds(productosServidor)
      // setFilterSelected(filtrosBusquedaRapida.Todos)
      // // console.log("respuesta del servidor")
      // // console.log(productosServidor)
      // completarBotonesFaltantes(productosServidor)
      hideLoading()
    }, () => {
      hideLoading()
    })
  }



  const onSelect = (product) => {
    console.log("onSelect", product)
    // setIsChanging(false)
    if (product.codigoProducto) {//si tiene codigo 0 o null es un boton sin asignar
      product.idProducto = product.codigoProducto
      Product.getInstance().findByCodigoBarras({
        codigoProducto: product.codbarra,
        codigoCliente: (cliente ? cliente.codigoCliente : 0)
      }, (prodsEncontrados) => {
        console.log("prodsEncontrados", prodsEncontrados)
        if (prodsEncontrados.length < 1) {
          showMessage("No se pudo encontrar el producto...")
        } else {
          const prodAgregar = prodsEncontrados[0]

          // prodAgregar.mostrarPrecioRangos = null
          // prodAgregar.precioVenta = product.precioVenta

          addToSalesData(prodAgregar)
          // setOpenDialog(false)
        }
      }, (err) => {
        showMessage("No se pudo encontrar el producto." + err)
      })

    } else {
      showMessage("no tiene codigo")
    }
  }


  useEffect(() => {
    getOfertas()
  }, [openDialog])


  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false)
      }}
      fullScreen
      maxWidth="lg"
      PaperProps={{
        style: {
          maxWidth: "90%",
          // backgroundColor:"red",
          // padding:"100px"
        }
      }}
    >
      <DialogContent>



        <Grid container spacing={2} style={{
          padding: "0px",
        }}>

          <Grid item xs={12} sm={12} md={12} lg={12} style={{
            // display: (!showSearchProduct ? "block" : "none")
          }}>

            <Typography>Ofertas</Typography>

            {/* <BoxOptionList
              optionSelected={filterSelected}
              setOptionSelected={setFilterSelected}
              options={System.arrayIdValueFromObject(filtrosBusquedaRapida, true)}
            /> */}

            {prods.length > 0 && prods.map((oferta, index) => {
              var styles = {
                marginTop: "20px",
                minHeight: "80px"
              }
              const product = new ProductSold()
              product.nombre = oferta.descripcion + " | " + oferta.codigoOferta
              product.precioVenta = oferta.oferta_Regla.valor
              product.oferta = oferta
              if (!product.codigoProducto) {
                styles.backgroundColor = "#c1c1c1"
              }

              const longBoleta = new LongClick(2);
              longBoleta.onClick(() => {
                product.oferta.products.forEach((pr) => {
                  console.log("agregando el producto", pr)
                  pr.codigoProducto = pr.codbarra

                  // pr.mostrarPrecioRangos = null
                  // pr.precioVenta = product.precioVenta

                  onSelect(pr)
                })
              })
              longBoleta.onLongClick(() => {
                // setIsChanging(true)
                // if (product.codigoProducto) {
                //   setSettingProduct(product)
                //   setShowConfirmOption(true)
                // }
              })


              return product.oferta.oferta_Regla.valor <= 0 ? null : (
                <OfertaButton key={index} product={product}
                  onTouchStart={() => longBoleta.onStart("touch")}
                  onMouseDown={() => longBoleta.onStart("mouse")}
                  onTouchEnd={() => longBoleta.onEnd("touch")}
                  onMouseUp={() => longBoleta.onEnd("mouse")}
                  onMouseLeave={() => longBoleta.cancel()}
                  onTouchMove={() => longBoleta.cancel()}
                  style={styles}
                  animateBackgroundColor={true}
                />
              )
            })
            }
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions sx={{
        alignSelf: "center"
      }}>


        <SmallDangerButton
          actionButton={() => {
            setOpenDialog(false)
            // setShowConfirmOption(false)
            // setShowSearchProduct(false)
          }}
          textButton={"Cerrar"}
        />



      </DialogActions>
    </Dialog>
  );
};

