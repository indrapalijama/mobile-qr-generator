import { Injectable } from '@angular/core';
import { QRCodeType } from '../interfaces/qr-code.types';
import { QR_CODE_TYPES } from '../configs/qr-code.config';

@Injectable({
    providedIn: 'root'
})
export class QrCodeService {
    private qrTypes = QR_CODE_TYPES;

    getQRTypes(): QRCodeType[] {
        return this.qrTypes;
    }

    getQRType(id: string): QRCodeType | undefined {
        return this.qrTypes.find(type => type.id === id);
    }

    formatQRData(type: QRCodeType, data: Record<string, string>): string {
        return type.formatter(data);
    }
}