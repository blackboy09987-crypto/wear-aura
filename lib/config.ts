export const SHIPPING_FEE = 200
export const FREE_SHIPPING_ABOVE = 3000

export const PAYMENT_DETAILS = {
  easypaisa: {
    label: 'Easypaisa',
    number: '0300-0000000', // REPLACE with your number
    account_name: 'WEAR AURA',
  },
  jazzcash: {
    label: 'JazzCash',
    number: '0300-0000000', // REPLACE with your number
    account_name: 'WEAR AURA',
  },
  bank_transfer: {
    label: 'Bank Transfer',
    bank_name: 'Meezan Bank', // REPLACE
    account_title: 'WEAR AURA',
    account_number: '00000000000000', // REPLACE
    iban: 'PK00MEZN0000000000000000', // REPLACE
  },
} as const

export const WHATSAPP_NUMBER = '923000000000' // REPLACE — format: 92XXXXXXXXXX
export const STORE_EMAIL = 'hello@wearaura.space'
export const INSTAGRAM = 'https://instagram.com/wearaura'
export const TIKTOK = 'https://tiktok.com/@wearaura'

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad (ICT)',
  'Gilgit-Baltistan',
  'Azad Kashmir',
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const CATEGORIES = ['Tees', 'Hoodies', 'Jackets', 'Bottoms', 'Accessories']
