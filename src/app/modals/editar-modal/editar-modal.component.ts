import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-editar-modal',
  templateUrl: './editar-modal.component.html',
  styleUrls: ['./editar-modal.component.scss']
})
export class EditarModalComponent {
  
  public rol: string = "";

  constructor(
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private materiasService: MateriasService,
    private alumnosService: AlumnosService,
    private dialogRef: MatDialogRef<EditarModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    this.rol = this.data.rol;
    console.log("Rol modal: ", this.rol);

  }

  public cerrar_modal(){
    this.dialogRef.close({isEdit:false});
  }

  public editarUser(){
    if(this.rol == "administrador"){
      this.administradoresService.editarAdmin(this.data).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isEdit:true});
        }, (error)=>{
          this.dialogRef.close({isEdit:false});
        }
      );

    }else if(this.rol == "maestro"){
      this.maestrosService.editarMaestro(this.data).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isEdit:true});
        }, (error)=>{
          this.dialogRef.close({isEdit:false});
        }
      );

    }else if(this.rol == "alumno"){
      this.alumnosService.editarAlumno(this.data).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isEdit:true});
        }, (error)=>{
          this.dialogRef.close({isEdit:false});
        }
      );
    }else if(this.rol == "materia"){
      this.materiasService.editarMateria(this.data).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isEdit:true});
        }, (error)=>{
          this.dialogRef.close({isEdit:false});
        }
      );    }

  }
}
