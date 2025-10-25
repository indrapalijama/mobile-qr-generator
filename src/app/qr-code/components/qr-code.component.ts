import { Component, OnInit, OnDestroy } from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { QRCodeStyle, QRCodeType, QRHistory, ColorPreset, DownloadFormat } from '../interfaces/qr-code.types';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DEFAULT_QR_STYLE, COLOR_PRESETS, DARK_COLORS, LIGHT_COLORS } from '../configs/qr-code.config';
import { Platform, ToastController, ActionSheetController } from '@ionic/angular';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['qr-code.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ height: 0, opacity: 0 }),
                animate('300ms ease-out', style({ height: '*', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ height: 0, opacity: 0 }))
            ])
        ])
    ]
})
export class QrCodeComponent implements OnInit, OnDestroy {
    // QR Types and Selection
    qrTypes: QRCodeType[] = [];
    selectedTypeId: string = '';
    selectedType?: QRCodeType;

    // Form Data
    formData: Record<string, string> = {};
    private formDataSubject = new Subject<Record<string, string>>();

    // QR Code Data
    qrData: string = '';
    qrImageUrl: SafeUrl | null = null;
    qrStyle: QRCodeStyle = { ...DEFAULT_QR_STYLE };

    // UI State
    isGenerating: boolean = false;
    showAdvancedOptions: boolean = false;
    showHistory: boolean = false;
    isMobile: boolean;

    // Colors and Presets
    colorPresets: ColorPreset[] = COLOR_PRESETS;
    darkColors: string[] = DARK_COLORS;
    lightColors: string[] = LIGHT_COLORS;
    selectedPreset: string = 'Classic';

    // History
    history: QRHistory[] = [];

    // Download
    downloadFormat: DownloadFormat = 'png';
    isDownloading: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        public qrCodeService: QrCodeService,
        private sanitizer: DomSanitizer,
        private platform: Platform,
        private toastController: ToastController,
        private actionSheetController: ActionSheetController
    ) {
        this.isMobile = this.platform.is('mobile') || this.platform.is('tablet');
    }

    ngOnInit() {
        this.qrTypes = this.qrCodeService.getQRTypes();

        // Load history
        this.qrCodeService.history$
            .pipe(takeUntil(this.destroy$))
            .subscribe(history => {
                this.history = history;
            });

        // Debounce form data changes
        this.formDataSubject
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.generateQRCode();
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onTypeChange() {
        this.selectedType = this.qrCodeService.getQRType(this.selectedTypeId);
        this.formData = {};
        this.qrData = '';
        this.qrImageUrl = null;
    }

    onFormDataChange() {
        this.formDataSubject.next(this.formData);
    }

    generateQRCode() {
        if (this.selectedType && this.hasRequiredFields()) {
            this.isGenerating = true;
            setTimeout(() => {
                this.qrData = this.qrCodeService.formatQRData(this.selectedType!, this.formData);
                this.isGenerating = false;
            }, 100);
        } else {
            this.qrData = '';
            this.qrImageUrl = null;
        }
    }

    hasRequiredFields(): boolean {
        if (!this.selectedType) return false;
        return this.selectedType.fields
            .filter(field => field.required)
            .every(field => this.formData[field.key]?.trim());
    }

    resetStyle() {
        this.qrStyle = { ...DEFAULT_QR_STYLE };
        this.selectedPreset = 'Classic';
        this.showToast('Style reset to default');
    }

    applyColorPreset(preset: ColorPreset) {
        this.qrStyle.colorDark = preset.dark;
        this.qrStyle.colorLight = preset.light;
        this.selectedPreset = preset.name;
    }

    onQRCodeGenerated(url: SafeUrl) {
        this.qrImageUrl = url;

        // Save to history
        if (this.qrData && this.selectedType) {
            this.qrCodeService.saveToHistory(
                this.selectedType.id,
                this.qrData,
                this.qrStyle
            );
        }
    }

    async presentDownloadOptions() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Download QR Code',
            buttons: [
                {
                    text: 'Download as PNG',
                    icon: 'image-outline',
                    handler: () => {
                        this.downloadQR('png');
                    }
                },
                {
                    text: 'Download as JPEG',
                    icon: 'camera-outline',
                    handler: () => {
                        this.downloadQR('jpeg');
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    async downloadQR(format: DownloadFormat = 'png') {
        if (!this.qrImageUrl) return;

        this.isDownloading = true;

        try {
            const urlString = this.sanitizer.sanitize(4, this.qrImageUrl) || '';
            const response = await fetch(urlString);
            let blob = await response.blob();

            // Convert to JPEG if needed
            if (format === 'jpeg') {
                blob = await this.convertToJPEG(blob);
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${this.selectedTypeId}-${Date.now()}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            await this.showToast(`QR Code downloaded as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Error downloading QR code:', error);
            await this.showToast('Failed to download QR code', 'danger');
        } finally {
            this.isDownloading = false;
        }
    }

    private async convertToJPEG(blob: Blob): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;

                // White background for JPEG
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to convert to JPEG'));
                }, 'image/jpeg', 0.95);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }

    async shareQR() {
        if (!this.qrImageUrl) return;

        try {
            const urlString = this.sanitizer.sanitize(4, this.qrImageUrl) || '';
            const response = await fetch(urlString);
            const blob = await response.blob();
            const file = new File([blob], `qr-code.png`, { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    files: [file],
                    title: 'QR Code',
                    text: 'Check out this QR code'
                });
                await this.showToast('QR Code shared successfully');
            } else {
                await this.showToast('Sharing not supported on this device', 'warning');
            }
        } catch (error) {
            console.error('Error sharing QR code:', error);
        }
    }

    loadFromHistory(item: QRHistory) {
        const type = this.qrCodeService.getQRType(item.type);
        if (!type) return;

        this.selectedTypeId = item.type;
        this.selectedType = type;
        this.qrStyle = { ...item.style };
        this.qrData = item.data;

        this.showHistory = false;
        this.showToast('QR Code loaded from history');
    }

    async deleteHistoryItem(item: QRHistory, event: Event) {
        event.stopPropagation();
        this.qrCodeService.deleteHistoryItem(item.id);
        await this.showToast('History item deleted');
    }

    async clearHistory() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Clear all history?',
            buttons: [
                {
                    text: 'Clear All',
                    role: 'destructive',
                    icon: 'trash-outline',
                    handler: () => {
                        this.qrCodeService.clearHistory();
                        this.showToast('History cleared');
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    toggleAdvancedOptions() {
        this.showAdvancedOptions = !this.showAdvancedOptions;
    }

    toggleHistory() {
        this.showHistory = !this.showHistory;
    }

    private async showToast(message: string, color: string = 'success') {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom',
            color
        });
        await toast.present();
    }

    getTypeName(typeId: string): string {
        return this.qrTypes.find(t => t.id === typeId)?.name || typeId;
    }

    formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }

    selectType(typeId: string) {
        this.selectedTypeId = typeId;
        this.onTypeChange();
    }
}