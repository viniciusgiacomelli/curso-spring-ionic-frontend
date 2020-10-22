import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CidadeDTO } from '../../models/cidade.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeService } from '../../services/domain/cidade.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { EstadoService } from '../../services/domain/estado.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl:AlertController,
              public formBuilder: FormBuilder,
              public cidadeService: CidadeService,
              public estadoService: EstadoService,
              public clienteService: ClienteService) {

    this.formGroup = this.formBuilder.group({
      nome : ['Joaquim',[Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email : ['joaquim@gmail.com',[Validators.required, Validators.email]],
      tipo : ['1',[Validators.required]],
      cpfOuCnpj : ['061234596280',[Validators.required, Validators.minLength(11),Validators.maxLength(14)]],
      senha : ['123', [Validators.required]],
      logradouro : ['Rua Via', [Validators.required]],
      numero : ['25',[Validators.required]],
      complemento : ['Apto 3', []],
      bairro : ['Copacabana',[]],
      cep : ['10828333',[Validators.required]],
      telefone1 : ['977261827',[Validators.required]],
      telefone2 : ['',[]],
      telefone3 : ['',[]],
      estadoId : ['null', [Validators.required]],
      cidadeId : ['null', [Validators.required]]
    });
  }

  ionViewDidLoad(){
    this.estadoService.findAll()
    .subscribe(response=>{
      this.estados = response;
      this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      this.updateCidades();
    },
    error => {});
  }

  updateCidades(){
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estado_id)
    .subscribe(response =>{
      this.cidades = response;
      //O comando a seguir apaga a cidade anteriormente carregada em caso de mudança do estado
      this.formGroup.controls.cidadeId.setValue(null);
    },
    error => {});

  }

  signupUser(){
    this.clienteService.insert(this.formGroup.value)
    .subscribe(response => {
      this.showInsertOk();
    },
    error => {});
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      cssClass: 'signupUser',
      title: 'BEM VINDO! :) ',
      message: 'Formulário enviado com êxito',
      enableBackdropDismiss: false,
      buttons:[
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
