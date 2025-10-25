import { QRCodeStyle, QRCodeType, ColorPreset } from '../interfaces/qr-code.types';

export const DEFAULT_QR_STYLE: QRCodeStyle = {
    width: 256,
    errorCorrectionLevel: 'M',
    margin: 4,
    colorDark: '#000000',
    colorLight: '#ffffff'
};

export const COLOR_PRESETS: ColorPreset[] = [
    { name: 'Classic', dark: '#000000', light: '#FFFFFF' },
    { name: 'Ocean', dark: '#1976D2', light: '#E3F2FD' },
    { name: 'Forest', dark: '#2E7D32', light: '#E8F5E9' },
    { name: 'Sunset', dark: '#D32F2F', light: '#FFEBEE' },
    { name: 'Purple', dark: '#7B1FA2', light: '#F3E5F5' },
    { name: 'Orange', dark: '#E64A19', light: '#FBE9E7' }
];

export const DARK_COLORS: string[] = [
    '#000000', // Black
    '#D32F2F', // Red
    '#1976D2', // Blue
    '#388E3C', // Green
    '#F57C00', // Orange
    '#7B1FA2', // Purple
    '#0097A7', // Cyan
    '#C2185B'  // Pink
];

export const LIGHT_COLORS: string[] = [
    '#FFFFFF', // White
    '#FFEBEE', // Light Red
    '#E3F2FD', // Light Blue
    '#E8F5E9', // Light Green
    '#FFF3E0', // Light Orange
    '#F3E5F5', // Light Purple
    '#E0F7FA', // Light Cyan
    '#FCE4EC'  // Light Pink
];

export const QR_CODE_TYPES: QRCodeType[] = [
    {
        id: 'url',
        name: 'Website URL',
        icon: 'globe-outline',
        fields: [
            {
                key: 'url',
                label: 'Website URL',
                type: 'url',
                required: true,
                placeholder: 'https://example.com'
            }
        ],
        formatter: (data) => data['url']
    },
    {
        id: 'wifi',
        name: 'WiFi Network',
        icon: 'wifi-outline',
        fields: [
            {
                key: 'ssid',
                label: 'Network Name (SSID)',
                type: 'text',
                required: true,
                placeholder: 'MyWiFi'
            },
            {
                key: 'password',
                label: 'Password',
                type: 'password',
                required: false,
                placeholder: 'Enter password'
            },
            {
                key: 'type',
                label: 'Security Type',
                type: 'select',
                required: true,
                options: ['WPA', 'WPA2', 'WEP', 'nopass']
            },
            {
                key: 'hidden',
                label: 'Hidden Network',
                type: 'select',
                required: false,
                options: ['false', 'true']
            }
        ],
        formatter: (data) => {
            let wifi = `WIFI:S:${data['ssid']};`;
            if (data['password'] && data['type'] !== 'nopass') {
                wifi += `P:${data['password']};`;
            }
            wifi += `T:${data['type']};`;
            if (data['hidden'] === 'true') {
                wifi += 'H:true;';
            }
            return wifi + ';';
        }
    },
    {
        id: 'contact',
        name: 'Contact Card',
        icon: 'person-outline',
        fields: [
            { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
            { key: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: '+1234567890' },
            { key: 'email', label: 'Email', type: 'email', required: false, placeholder: 'john@example.com' },
            { key: 'organization', label: 'Organization', type: 'text', required: false, placeholder: 'Company Name' },
            { key: 'address', label: 'Address', type: 'text', required: false, placeholder: '123 Main St' },
            { key: 'url', label: 'Website', type: 'url', required: false, placeholder: 'https://example.com' }
        ],
        formatter: (data) => {
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            vcard += `FN:${data['name']}\n`;
            if (data['phone']) vcard += `TEL:${data['phone']}\n`;
            if (data['email']) vcard += `EMAIL:${data['email']}\n`;
            if (data['organization']) vcard += `ORG:${data['organization']}\n`;
            if (data['address']) vcard += `ADR:${data['address']}\n`;
            if (data['url']) vcard += `URL:${data['url']}\n`;
            vcard += 'END:VCARD';
            return vcard;
        }
    },
    {
        id: 'email',
        name: 'Email',
        icon: 'mail-outline',
        fields: [
            { key: 'address', label: 'Email Address', type: 'email', required: true, placeholder: 'user@example.com' },
            { key: 'subject', label: 'Subject', type: 'text', required: false, placeholder: 'Email subject' },
            { key: 'body', label: 'Message', type: 'textarea', required: false, placeholder: 'Email message' }
        ],
        formatter: (data) => {
            let mailto = `mailto:${data['address']}`;
            const params = [];
            if (data['subject']) params.push(`subject=${encodeURIComponent(data['subject'])}`);
            if (data['body']) params.push(`body=${encodeURIComponent(data['body'])}`);
            return params.length ? `${mailto}?${params.join('&')}` : mailto;
        }
    },
    {
        id: 'sms',
        name: 'SMS Message',
        icon: 'chatbubble-outline',
        fields: [
            { key: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+1234567890' },
            { key: 'message', label: 'Message', type: 'textarea', required: false, placeholder: 'SMS message' }
        ],
        formatter: (data) => {
            let sms = `SMSTO:${data['phone']}`;
            if (data['message']) sms += `:${data['message']}`;
            return sms;
        }
    },
    {
        id: 'phone',
        name: 'Phone Call',
        icon: 'call-outline',
        fields: [
            { key: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+1234567890' }
        ],
        formatter: (data) => `tel:${data['phone']}`
    },
    {
        id: 'text',
        name: 'Plain Text',
        icon: 'document-text-outline',
        fields: [
            { key: 'text', label: 'Text Content', type: 'textarea', required: true, placeholder: 'Enter any text' }
        ],
        formatter: (data) => data['text']
    }
];