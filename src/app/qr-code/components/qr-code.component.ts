import { Component, OnInit, DoCheck } from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { QRCodeStyle, QRCodeType } from '../interfaces/qr-code.types';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DEFAULT_QR_STYLE } from '../configs/qr-code.config';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['qr-code.component.scss']
})
export class QrCodeComponent implements OnInit, DoCheck {
    qrTypes: QRCodeType[] = [];
    selectedTypeId: string = '';
    selectedType?: QRCodeType;
    formData: Record<string, string> = {};
    qrData: string = '';
    qrImageUrl: SafeUrl | null = null;
    qrStyle: QRCodeStyle = { ...DEFAULT_QR_STYLE };
    isMobile: boolean;

    constructor(
        private qrCodeService: QrCodeService,
        private sanitizer: DomSanitizer,
        private platform: Platform
    ) {
        this.isMobile = this.platform.is('mobile') || this.platform.is('tablet');
    }

    ngOnInit() {
        this.qrTypes = this.qrCodeService.getQRTypes();
    }

    onTypeChange() {
        this.selectedType = this.qrCodeService.getQRType(this.selectedTypeId);
        this.formData = {};
        this.qrData = '';
        this.qrImageUrl = null;
    }

    resetStyle() {
        this.qrStyle = { ...DEFAULT_QR_STYLE };
    }

    onQRCodeGenerated(url: SafeUrl) {
        this.qrImageUrl = url;
    }

    ngDoCheck() {
        if (this.selectedType && this.hasRequiredFields()) {
            this.qrData = this.qrCodeService.formatQRData(this.selectedType, this.formData);
        } else {
            this.qrData = '';
        }
    }

    hasRequiredFields(): boolean {
        if (!this.selectedType) return false;
        return this.selectedType.fields
            .filter(field => field.required)
            .every(field => this.formData[field.key]?.trim());
    }

    async downloadQR() {
        if (!this.qrImageUrl) return;

        try {
            // Convert SafeUrl back to string
            const urlString = this.sanitizer.sanitize(4, this.qrImageUrl) || '';

            // Fetch the image data
            const response = await fetch(urlString);
            const blob = await response.blob();

            if (this.platform.is('mobile') || this.platform.is('tablet')) {
                // Mobile download using File API
                const reader = new FileReader();
                reader.onload = () => {
                    const link = document.createElement('a');
                    link.href = reader.result as string;
                    link.download = `qr-code-${this.selectedTypeId}-${new Date().getTime()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
                reader.readAsDataURL(blob);
            } else {
                // Desktop download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr-code-${this.selectedTypeId}-${new Date().getTime()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading QR code:', error);
            // Here you might want to show a toast or alert to the user
        }
    }
}