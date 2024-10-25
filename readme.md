# Dynamic QR Code Generator - Ionic Angular
A dynamic QR code generator supporting multiple formats including WiFi, Contact Cards, Email, URL, and SMS.

## Live Demo
Try out the application: [Mobile QR Generator](https://apasajaqr.vercel.app/)

## Project Structure
```
src/
├── app/
│   ├── qr-code/
│   │   ├── interfaces/
│   │   │   └── qr-code.types.ts
│   │   ├── configs/
│   │   │   └── qr-code.config.ts
│   │   ├── services/
│   │   │   └── qr-code.service.ts
│   │   ├── components/
│   │   │   └── qr-code.component.ts
│   │   └── qr-code.module.ts
│   ├── app.module.ts
│   ├── app.component.ts
│   └── app-routing.module.ts
└── assets/
    └── icon/
        └── qr-code.svg
```

## Features
- Multiple QR code formats support:
  - WiFi Networks
  - Contact Cards (MECARD)
  - Email addresses
  - URLs
  - SMS messages
- Dynamic form generation based on QR code type
- Download generated QR codes
- Responsive design
- Type-safe implementation

## Extending the Application
To add new QR code types:
1. Add a new entry to `QR_CODE_TYPES` in `qr-code.config.ts`:
```typescript
{
  id: 'new-type',
  name: 'New QR Type',
  fields: [
    { key: 'field1', label: 'Field 1', type: 'text', required: true },
    // ... add more fields
  ],
  formatter: (data) => `Your formatted string here`
}
```
2. The new type will automatically appear in the dropdown and generate the appropriate form fields.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.