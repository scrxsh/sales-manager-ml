package com.project.sales_manager_ml.predictionModules;

import com.project.sales_manager_ml.modules.sellsManager.VentaModel;
import com.project.sales_manager_ml.modules.sellsManager.VentaRepository;
import com.project.sales_manager_ml.modules.sellsManager.details.DetalleVentaModel;
import com.project.sales_manager_ml.modules.sellsManager.details.DetalleVentaRepository;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaDataService {

    @Autowired
    VentaRepository ventaRepository;
    @Autowired
    DetalleVentaRepository detalleVentaRepository;

    public INDArray cargarVentas(){
        List<VentaModel> ventas = ventaRepository.findAll();
        List<DetalleVentaModel> detalleVentas = detalleVentaRepository.findAll();

        if(ventas.isEmpty()){
            throw new IllegalStateException("No hay datos disponibles");
        }

        int numFilas = ventas.size();
        int numCols = 2;

        double[][] datos = new double[numFilas][numCols];

        for(int i = 0; i< numFilas; i++){
            VentaModel venta = ventas.get(i);
            DetalleVentaModel detalleVenta = detalleVentas.get(i);
            datos[i][0] = venta.getTotalPagado();
            datos[i][1] = detalleVenta.getCantidad();
        }

        return Nd4j.create(datos);
    }
}
