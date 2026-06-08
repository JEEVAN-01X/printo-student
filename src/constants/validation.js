/**
 * validation.js
 *
 * Single source of truth for ALL validation rules.
 * Used by useOrderForm.js on the frontend.
 * Mirrors the Joi schema in Person A's backend exactly.
 * When backend rules change, update here too.
 */

// Indian mobile number: exactly 10 digits, first digit must be 6, 7, 8, or 9
export const PHONE_REGEX = /^[6-9]\d{9}$/

// Must start with https:// — rejects http:// and plain text
export const HTTPS_URL_REGEX = /^https:\/\/.+/

export const FIELD_RULES = {
  student_name: {
    min: 2,
    max: 60,
    required: true,
    label: 'Your Name',
  },
  student_phone: {
    pattern: PHONE_REGEX,
    required: true,
    label: 'Phone Number',
    hint: '10 digits starting with 6, 7, 8, or 9',
  },
  file_link: {
    pattern: HTTPS_URL_REGEX,
    required: true,
    label: 'File Link',
    hint: 'Must start with https://',
  },
  file_type: {
  label: 'File Type',
  options: [
    { value: '',          label: 'Select file type' },
    { value: 'PDF',       label: 'PDF' },
    { value: 'WORD',      label: 'Word Document' },
    { value: 'PPT',       label: 'PowerPoint' },
    { value: 'IMAGE',     label: 'Image' },
    { value: 'EXCEL',     label: 'Excel Spreadsheet' },
    { value: 'OTHER',     label: 'Other' },
  ],
  validate(val) {
    if (!val) return 'Please select a file type'
    return null
  },
},
  copies: {
    min: 1,
    max: 50,
    required: true,
    label: 'Number of Copies',
  },
  color: {
    options: [
      { value: 'BLACK_WHITE', label: 'Black & White' },
      { value: 'COLOR',       label: 'Colour' },
    ],
    required: true,
    label: 'Print Type',
  },
  double_sided: {
    options: [
      { value: false, label: 'Single Sided' },
      { value: true,  label: 'Double Sided' },
    ],
    required: true,
    label: 'Sides',
  },
  special_instructions: {
    max: 200,
    required: false,
    label: 'Special Instructions',
    hint: 'Optional — font size, paper type, page range, etc.',
  },
}

/**
 * Validates a single field value against its rules.
 * Returns an error string or empty string if valid.
 *
 * @param {string} fieldName - key from FIELD_RULES
 * @param {any}    value     - the current field value
 * @returns {string}
 */
export function validateField(fieldName, value) {
  const rules = FIELD_RULES[fieldName]
  if (!rules) return ''

  // Required check
  if (rules.required) {
    const isEmpty =
      value === '' ||
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')

    if (isEmpty) return `${rules.label} is required`
  }

  // String min/max length
  if (typeof value === 'string' && rules.min && value.trim().length < rules.min) {
    return `${rules.label} must be at least ${rules.min} characters`
  }
  if (typeof value === 'string' && rules.max && value.trim().length > rules.max) {
    return `${rules.label} must be ${rules.max} characters or fewer`
  }

  // Number min/max
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return `${rules.label} must be at least ${rules.min}`
    }
    if (rules.max !== undefined && value > rules.max) {
      return `${rules.label} cannot exceed ${rules.max}`
    }
    if (!Number.isInteger(value)) {
      return `${rules.label} must be a whole number`
    }
  }

  // Regex pattern
  if (rules.pattern && typeof value === 'string' && value.trim() !== '') {
    if (!rules.pattern.test(value.trim())) {
      if (fieldName === 'student_phone') {
        return 'Phone must be 10 digits and start with 6, 7, 8, or 9'
      }
      if (fieldName === 'file_link') {
        return 'Link must start with https:// (not http://)'
      }
      return `${rules.label} format is invalid`
    }
  }

  return ''
}

/**
 * Validates the entire form object.
 * Returns an errors object with fieldName -> errorString.
 * Empty string means no error for that field.
 *
 * @param {object} formData
 * @returns {object}
 */
export function validateForm(formData) {
  const errors = {}
  const fields = [
    'student_name',
    'student_phone',
    'file_link',
    'file_type',
    'copies',
    'color',
    'double_sided',
    'special_instructions',
  ]

  fields.forEach(field => {
    errors[field] = validateField(field, formData[field])
  })

  return errors
}

/**
 * Returns true if the errors object has zero error strings.
 */
export function isFormValid(errors) {
  return Object.values(errors).every(e => e === '')
}