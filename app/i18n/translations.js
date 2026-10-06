// Статический импорт всех переводов — работает с Turbopack

import ruCommon     from './locales/ru/common.json'
import ruLanding    from './locales/ru/landing.json'
import ruMenu       from './locales/ru/menu.json'
import ruBooking    from './locales/ru/booking.json'
import ruPromotions from './locales/ru/promotions.json'
import ruContacts   from './locales/ru/contacts.json'
import ruCart       from './locales/ru/cart.json'
import ruLogin      from './locales/ru/login.json'
import ruCheckout   from './locales/ru/checkout.json'
import ruProfile    from './locales/ru/profile.json'
import ruAdmin      from './locales/ru/admin.json'

import enCommon     from './locales/en/common.json'
import enLanding    from './locales/en/landing.json'
import enMenu       from './locales/en/menu.json'
import enBooking    from './locales/en/booking.json'
import enPromotions from './locales/en/promotions.json'
import enContacts   from './locales/en/contacts.json'
import enCart       from './locales/en/cart.json'
import enLogin      from './locales/en/login.json'
import enCheckout   from './locales/en/checkout.json'
import enProfile    from './locales/en/profile.json'
import enAdmin      from './locales/en/admin.json'

import kgCommon     from './locales/kg/common.json'
import kgLanding    from './locales/kg/landing.json'
import kgMenu       from './locales/kg/menu.json'
import kgBooking    from './locales/kg/booking.json'
import kgPromotions from './locales/kg/promotions.json'
import kgContacts   from './locales/kg/contacts.json'
import kgCart       from './locales/kg/cart.json'
import kgLogin      from './locales/kg/login.json'
import kgCheckout   from './locales/kg/checkout.json'
import kgProfile    from './locales/kg/profile.json'
import kgAdmin      from './locales/kg/admin.json'

export const translations = {
  ru: {
    common: ruCommon, landing: ruLanding, menu: ruMenu,
    booking: ruBooking, promotions: ruPromotions, contacts: ruContacts,
    cart: ruCart, login: ruLogin, checkout: ruCheckout,
    profile: ruProfile, admin: ruAdmin,
  },
  en: {
    common: enCommon, landing: enLanding, menu: enMenu,
    booking: enBooking, promotions: enPromotions, contacts: enContacts,
    cart: enCart, login: enLogin, checkout: enCheckout,
    profile: enProfile, admin: enAdmin,
  },
  kg: {
    common: kgCommon, landing: kgLanding, menu: kgMenu,
    booking: kgBooking, promotions: kgPromotions, contacts: kgContacts,
    cart: kgCart, login: kgLogin, checkout: kgCheckout,
    profile: kgProfile, admin: kgAdmin,
  },
}

export default translations
