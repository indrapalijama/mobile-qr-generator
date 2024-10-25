import { QRCodeStyle, QRCodeType } from '../interfaces/qr-code.types';

export const DEFAULT_QR_STYLE: QRCodeStyle = {
    width: 256,
    errorCorrectionLevel: 'M',
    margin: 4,
    colorDark: '#000000',
    colorLight: '#ffffff'
};

export const QR_CODE_TYPES: QRCodeType[] = [
    {
        id: 'wifi',
        name: 'WiFi Network',
        fields: [
            {
                key: 'ssid',
                label: 'Network Name (SSID)',
                type: 'text', required: true
            },
            {
                key: 'password',
                label: 'Password',
                type: 'password',
                required: true
            },
            {
                key: 'type',
                label: 'Security Type',
                type: 'select',
                required: true,
                options: ['WPA', 'WEP', 'WPA2-EAP', 'nopass']
            }
        ],
        formatter: (data) => {
            let wifi = `WIFI:S:${data['ssid']};`;
            if (data['password'] && data['type'] !== 'nopass') {
                wifi += `P:${data['password']};`;
            }
            wifi += `T:${data['type']};`;
            return wifi + ';';
        }
    },
    {
        id: 'contact',
        name: 'Contact Card',
        fields: [
            { key: 'name', label: 'Full Name', type: 'text', required: true },
            { key: 'phone', label: 'Phone Number', type: 'tel', required: false },
            { key: 'email', label: 'Email', type: 'email', required: false },
            { key: 'address', label: 'Address', type: 'text', required: false }
        ],
        formatter: (data) => {
            let mecard = `MECARD:N:${data['name']};`;
            if (data['phone']) mecard += `TEL:${data['phone']};`;
            if (data['email']) mecard += `EMAIL:${data['email']};`;
            if (data['address']) mecard += `ADR:${data['address']};`;
            return mecard + ';';
        }
    },
    {
        id: 'email',
        name: 'Email',
        fields: [
            { key: 'address', label: 'Email Address', type: 'email', required: true },
            { key: 'subject', label: 'Subject', type: 'text', required: false },
            { key: 'body', label: 'Body', type: 'text', required: false }
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
        id: 'url',
        name: 'URL',
        fields: [
            { key: 'url', label: 'Website URL', type: 'url', required: true }
        ],
        formatter: (data) => data['url']
    },
    {
        id: 'sms',
        name: 'SMS',
        fields: [
            { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
            { key: 'message', label: 'Message', type: 'text', required: false }
        ],
        formatter: (data) => {
            let sms = `SMS:${data['phone']}`;
            if (data['message']) sms += `:${data['message']}`;
            return sms;
        }
    }
];

