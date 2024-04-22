import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-modal',
  templateUrl: './editar-modal.component.html',
  styleUrls: ['./editar-modal.component.scss']
})
export class EditarModalComponent {
  
  public rol: string = "";
  public flag: boolean = false;

  constructor(
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
    this.dialogRef.close({isEdit:true});
  }
}
