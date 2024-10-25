export interface QRCodeField {
    key: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'tel' | 'url' | 'select';
    required: boolean;
    options?: string[];
}

export interface QRCodeType {
    id: string;
    name: string;
    fields: QRCodeField[];
    formatter: (data: Record<string, string>) => string;
}

export interface QRCodeStyle {
    width: number;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    margin: number;
    colorDark: string;
    colorLight: string;
}