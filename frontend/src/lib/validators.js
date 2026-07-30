// ─── FORM VALIDATORS ─────────────────────────────────────────────────────────

export const validators = {
  name: (v) => {
    if (!v.trim()) return 'Name is required'
    if (v.trim().length < 2) return 'Name is too short'
    if (!/^[a-zA-Z\s'.]+$/.test(v.trim())) return 'Name should only contain letters'
    return ''
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Enter a valid email address'
    return ''
  },
  phoneNumber: (v) => {
    const digits = v.replace(/\s/g, '')
    if (!digits) return 'Phone number is required'
    if (!/^\d{6,14}$/.test(digits)) return 'Enter 6–14 digits'
    return ''
  },
  city: (v) => {
    if (!v.trim()) return 'City is required'
    if (v.trim().length < 2) return 'City name is too short'
    if (!/^[a-zA-Z\s\-'.]+$/.test(v.trim())) return 'City should only contain letters'
    return ''
  },
  country: (v, countries) => {
    if (!v.trim()) return 'Country is required'
    const match = countries.find(c => c.name.toLowerCase() === v.trim().toLowerCase())
    if (!match) return 'Please select a valid country from the list'
    return ''
  },
  experience: (v) => {
    if (!v) return 'Please select your trading experience'
    return ''
  },
}
