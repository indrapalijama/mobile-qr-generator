export interface QRCodeStyle {
    width: number;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    margin: number;
    colorDark: string;
    colorLight: string;
}

export interface QRCodeField {
    key: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'tel' | 'url' | 'textarea' | 'select';
    required: boolean;
    options?: string[];
    placeholder?: string;
}

export interface QRCodeType {
    id: string;
    name: string;
    icon?: string;
    fields: QRCodeField[];
    formatter: (data: Record<string, string>) => string;
}

export interface ColorPreset {
    name: string;
    dark: string;
    light: string;
}

export interface QRHistory {
    id: string;
    type: string;
    data: string;
    style: QRCodeStyle;
    timestamp: number;
}

export type DownloadFormat = 'png' | 'svg' | 'jpeg';