import { Injectable } from '@angular/core';
import { QRCodeType, QRHistory, QRCodeStyle } from '../interfaces/qr-code.types';
import { QR_CODE_TYPES } from '../configs/qr-code.config';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QrCodeService {
    private qrTypes = QR_CODE_TYPES;
    private readonly STORAGE_KEY = 'qr_history';
    private readonly MAX_HISTORY = 10;

    private historySubject = new BehaviorSubject<QRHistory[]>(this.loadHistory());
    public history$: Observable<QRHistory[]> = this.historySubject.asObservable();

    getQRTypes(): QRCodeType[] {
        return this.qrTypes;
    }

    getQRType(id: string): QRCodeType | undefined {
        return this.qrTypes.find(type => type.id === id);
    }

    formatQRData(type: QRCodeType, data: Record<string, string>): string {
        return type.formatter(data);
    }

    saveToHistory(type: string, data: string, style: QRCodeStyle): void {
        const history = this.loadHistory();
        const newEntry: QRHistory = {
            id: Date.now().toString(),
            type,
            data,
            style: { ...style },
            timestamp: Date.now()
        };

        // Add to beginning and limit to MAX_HISTORY
        history.unshift(newEntry);
        const limitedHistory = history.slice(0, this.MAX_HISTORY);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
        this.historySubject.next(limitedHistory);
    }

    loadHistory(): QRHistory[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    clearHistory(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.historySubject.next([]);
    }

    deleteHistoryItem(id: string): void {
        const history = this.loadHistory().filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        this.historySubject.next(history);
    }
}