import { MateriasService } from './../../services/materias.service';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent {
  public lista_materias: any[] = [];
  public token : string = "";
  public rol:string = "";
  public name_user:string = "";

  

  //Para la tabla
  displayedColumns: string[];
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);

    if(this.token == ""){
      this.router.navigate([""]);
    }

    this.obtenerMaterias();
    //Para paginador
    this.initPaginator();
    this.mostrarTabla();
  }

  public mostrarTabla(){
    if(this.rol=="administrador"){
      this.displayedColumns = ['nrc', 'nombre', 'seccion', 'dias', 'horaInicio', 'horaFin', 'salon', 'programa', 'editar', 'eliminar'];;
    }else if(this.rol=="maestro"){
      this.displayedColumns = ['nrc', 'nombre', 'seccion', 'dias', 'horaInicio', 'horaFin', 'salon', 'programa'];
    }
  }
  //Para paginación
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  //Obtener alumnos
  public obtenerMaterias(){
    this.materiasService.obtenerListaMaterias().subscribe(
      (response)=>{
        this.lista_materias = response;
        console.log("Lista materias: ", this.lista_materias);
        if(this.lista_materias.length > 0){
  
          console.log("Otro user: ", this.lista_materias);

          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
        }
      }, (error)=>{
        alert("No se pudo obtener la lista de usuarios");
      }
    );
  }

  //Funcion para editar
  public goEditar(idMat: number){
    this.router.navigate(["registro-materias/"+idMat]);
  }

  public delete(idMat: number){
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idMat, rol: 'materia'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Materia eliminada");
        //Recargar página
        window.location.reload();
      }else{
        alert("Materia no eliminada ");
        console.log("No se eliminó la materia");
      }
    });
  }
}//Cierre de la clase

//Esto va fuera de la llave que cierra la clase
export interface DatosMateria {
  id: number,
  nrc: number,
  nombre: string;
  seccion: number;
  dias: any[];
  horaInicio: string;
  horaFinal: string,
  salon: string,
  programa: string,
}