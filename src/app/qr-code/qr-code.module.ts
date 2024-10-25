import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { QrCodeComponent } from './components/qr-code.component';
import { QrCodeService } from './services/qr-code.service';
import { QRRoutingModule } from './qr-code-routing.module';

@NgModule({
    declarations: [QrCodeComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        QRCodeModule,
        QRRoutingModule
    ],
    providers: [QrCodeService],
    exports: [QrCodeComponent]
})
export class QrCodeModule { }