package com.example.sales_manager_ml.modules.employesManager;

import com.example.sales_manager_ml.modules.sellsManager.VentaModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "empleados")
public class EmpleadoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nombre;
    @JsonProperty("n_documento")
    @Column(nullable = false, name = "n_documento")
    private Long nDocumento;
    @Column(nullable = false, length = 45)
    private String email;
    @Column(nullable = false, length = 10)
    private String telefono;
    @Column(nullable = false, length = 45)
    private String direccion;

    @JsonIgnore
    @OneToMany(mappedBy = "empleado")
    List<VentaModel> ventasRealizadas;
}
