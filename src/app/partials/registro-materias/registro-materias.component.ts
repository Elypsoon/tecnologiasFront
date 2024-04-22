import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { Location } from '@angular/common';
import { EditarModalComponent } from 'src/app/modals/editar-modal/editar-modal.component';
import { MatDialog } from '@angular/material/dialog';

declare var $:any;

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent {
  @Input() datos_materia: any = {};
  @Input() rol: string = "";

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;

  public materia:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idMat: Number = 0;
  //Check
  public dias: any [] = [];

  public carreras: any[] = [
    {value: '1', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: '2', viewValue: 'Ingeniería en Tecnologías de la Información'},
    {value: '3', viewValue: 'Licenciatura en Ciencias de la Computación'},
  ];

  //Array para materias - checkbox
  public semana:any[]= [
    {value: '1', nombre: 'Lunes'},
    {value: '2', nombre: 'Martes'},
    {value: '3', nombre: 'Miércoles'},
    {value: '4', nombre: 'Jueves'},
    {value: '5', nombre: 'Viernes'},
    {value: '6', nombre: 'Sábado'},
  ];

  constructor(
    private location : Location,
    private materiasService: MateriasService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idMat = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idMat);
      this.ObtenerMateriaByID();
      //Al iniciar la vista asignamos los datos del user
      this.materia = this.datos_materia;
    }else{
      this.materia = this.materiasService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Materia: ", this.materia);
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    //Validar
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar)
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
      //Aquí si todo es correcto vamos a registrar - aquí se manda a consumir el servicio
    this.materiasService.registrarMateria(this.materia).subscribe(
      (response)=>{
        alert("Materia registrada correctamente");
        console.log("Materia registrada: ", response);
        this.router.navigate(["/"]);
      }, (error)=>{
        console.log(this.materia);
        alert("No se pudo registrar la materia");
      }
    );
  }

  public ObtenerMateriaByID(){
    this.materiasService.getSubByID(this.idMat).subscribe(
      (response)=>{
        this.materia = response;
        this.materia.horaInicio = this.materia.horaInicio.substring(0,5);
        this.materia.horaFin = this.materia.horaFin.substring(0,5);
        console.log("Datos materia: ", this.materia);
      }, (error)=>{
        alert("No se pudieron obtener los datos de la materia para editar");
      }
    );
  }

  public actualizar(){
    //Validación
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    const dialogRef = this.dialog.open(EditarModalComponent,{
      data: {rol: 'esta materia'},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isEdit){
        this.materiasService.editarMateria(this.materia).subscribe(
          (response)=>{
            alert("Materia editada correctamente");
            console.log("Materia editada: ", response);
            //Si se editó, entonces mandar al home
            this.router.navigate(["home"]);
          }, (error)=>{
            alert("No se pudo editar la materia");
            console.log("Error: ", error);
          }
        );
      }else{
        console.log("No se editó la materia");
      }
    });


    
  }

  public checkboxChange(event:any){
    //console.log("Evento: ", event);
    if(event.checked){
      this.materia.dias.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materia.dias.splice(i,1)
        }
      });
    }
    console.log("Array semana: ", this.materia);
  }

  public revisarSeleccion(nombre: string){
    if(this.materia.dias){
      var busqueda = this.materia.dias.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
}
