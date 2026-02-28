const { body, validationResult } = require('express-validator');

/**
 * Common handler to return validation errors in a consistent format
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }))
  });
}

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['judge', 'chief-judge', 'stenographer', 'admin'])
    .withMessage('Invalid role'),
  handleValidationErrors
];

/**
 * Validation rules for admin-created users (register-user route)
 */
const registerUserValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 150 }).withMessage('Full name is too long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('cnic')
    .trim()
    .notEmpty().withMessage('CNIC is required')
    // Pakistan CNIC format: 12345-1234567-1
    .matches(/^\d{5}-\d{7}-\d$/).withMessage('CNIC must be in 12345-1234567-1 format'),
  body('birthDate')
    .notEmpty().withMessage('Birth date is required')
    .isISO8601().withMessage('Birth date must be a valid date'),
  body('court')
    .trim()
    .notEmpty().withMessage('Court is required')
    .isLength({ max: 150 }).withMessage('Court name is too long'),
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['stenographer', 'judge', 'chief-judge', 'admin'])
    .withMessage('Invalid role'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  handleValidationErrors
];

/**
 * Validation rules for creating a case
 */
const addCaseValidation = [
  body('caseType')
    .trim()
    .notEmpty().withMessage('Case type is required')
    .isLength({ max: 100 }).withMessage('Case type is too long'),
  body('caseTitle')
    .trim()
    .notEmpty().withMessage('Case title is required')
    .isLength({ max: 255 }).withMessage('Case title is too long'),
  body('caseLevel')
    .trim()
    .notEmpty().withMessage('Case level is required')
    .isLength({ max: 50 }).withMessage('Case level is too long'),
  body('party1')
    .trim()
    .notEmpty().withMessage('Party 1 is required')
    .isLength({ max: 150 }).withMessage('Party 1 name is too long'),
  body('party2')
    .trim()
    .notEmpty().withMessage('Party 2 is required')
    .isLength({ max: 150 }).withMessage('Party 2 name is too long'),
  handleValidationErrors
];

/**
 * Validation rules for updating a case
 */
const updateCaseValidation = [
  body('case_code')
    .trim()
    .notEmpty().withMessage('Case code is required')
    .isLength({ max: 50 }).withMessage('Case code is too long'),
  body('case_type')
    .trim()
    .notEmpty().withMessage('Case type is required')
    .isLength({ max: 100 }).withMessage('Case type is too long'),
  body('case_title')
    .trim()
    .notEmpty().withMessage('Case title is required')
    .isLength({ max: 255 }).withMessage('Case title is too long'),
  body('case_status')
    .trim()
    .notEmpty().withMessage('Case status is required')
    .isIn(['Scheduled', 'In Progress', 'Completed', 'Postponed'])
    .withMessage('Invalid case status'),
  body('case_party1')
    .trim()
    .notEmpty().withMessage('Party 1 is required')
    .isLength({ max: 150 }).withMessage('Party 1 name is too long'),
  body('case_party2')
    .trim()
    .notEmpty().withMessage('Party 2 is required')
    .isLength({ max: 150 }).withMessage('Party 2 name is too long'),
  body('steno_code')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Stenographer code is too long'),
  body('judge_code')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Judge code is too long'),
  body('court')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('Court name is too long'),
  body('case_level')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Case level is too long'),
  handleValidationErrors
];

/**
 * Validation rules for updating a user
 */
const updateUserValidation = [
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['stenographer', 'judge', 'chief-judge', 'admin'])
    .withMessage('Invalid role'),
  body('code')
    .trim()
    .notEmpty().withMessage('User code is required')
    .isLength({ max: 50 }).withMessage('User code is too long'),
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 150 }).withMessage('Name is too long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('cnic')
    .optional({ checkFalsy: true, values: 'falsy' }) // Treat empty strings, null, undefined as optional
    .trim()
    .matches(/^\d{5}-\d{7}-\d$/).withMessage('CNIC must be in 12345-1234567-1 format'),
  body('birthday')
    .optional({ checkFalsy: true, values: 'falsy' }) // Treat empty strings, null, undefined as optional
    .trim()
    .isISO8601().withMessage('Birthday must be a valid date (YYYY-MM-DD)'),
  body('court')
    .custom((value) => {
      // Accept both string and number (court_id can be a number)
      if (value === null || value === undefined || value === '') {
        throw new Error('Court is required');
      }
      if (typeof value === 'number' && value > 0) {
        return true;
      }
      if (typeof value === 'string' && value.trim() !== '') {
        return true;
      }
      throw new Error('Court must be a valid number or string');
    }),
  body('password')
    .optional({ checkFalsy: true }) // Treat empty strings as optional
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  handleValidationErrors
];

/**
 * Validation rules for scheduling a hearing
 */
const scheduleHearingValidation = [
  body('caseNumber')
    .notEmpty().withMessage('Case number is required')
    .isInt({ min: 1 }).withMessage('Case number must be a valid integer'),
  body('court')
    .trim()
    .notEmpty().withMessage('Court is required')
    .isLength({ max: 150 }).withMessage('Court name is too long'),
  body('judge')
    .trim()
    .notEmpty().withMessage('Judge code is required')
    .isLength({ max: 50 }).withMessage('Judge code is too long'),
  body('stenographer')
    .trim()
    .notEmpty().withMessage('Stenographer code is required')
    .isLength({ max: 50 }).withMessage('Stenographer code is too long'),
  body('hearingDate')
    .trim()
    .notEmpty().withMessage('Hearing date is required')
    .isISO8601().withMessage('Hearing date must be a valid date (YYYY-MM-DD)'),
  body('hearingTime')
    .trim()
    .notEmpty().withMessage('Hearing time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hearing time must be in HH:MM format'),
  handleValidationErrors
];

/**
 * Validation rules for transcript edits
 */
const editTranscriptValidation = [
  body('original_transcript_id')
    .notEmpty().withMessage('Original transcript ID is required')
    .isInt({ min: 1 }).withMessage('Original transcript ID must be a valid integer'),
  body('case_id')
    .notEmpty().withMessage('Case ID is required')
    .isInt({ min: 1 }).withMessage('Case ID must be a valid integer'),
  body('edited_text')
    .trim()
    .notEmpty().withMessage('Edited text is required')
    .isLength({ max: 10000 }).withMessage('Edited text is too long'),
  body('speaker')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Speaker name is too long'),
  body('start_time')
    .optional()
    .matches(/^\d{2}:\d{2}:\d{2}$/).withMessage('Start time must be in HH:MM:SS format'),
  body('end_time')
    .optional()
    .matches(/^\d{2}:\d{2}:\d{2}$/).withMessage('End time must be in HH:MM:SS format'),
  body('judge_name')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('Judge name is too long'),
  handleValidationErrors
];

/**
 * Validation rules for saving transcript
 */
const saveTranscriptValidation = [
  body('case_id')
    .notEmpty().withMessage('Case ID is required')
    .isInt({ min: 1 }).withMessage('Case ID must be a valid integer'),
  body('speaker')
    .trim()
    .notEmpty().withMessage('Speaker is required')
    .isLength({ max: 100 }).withMessage('Speaker name is too long'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message/transcript text is required')
    .isLength({ max: 10000 }).withMessage('Message is too long'),
  body('start_time')
    .optional()
    .isNumeric().withMessage('Start time must be a number'),
  body('end_time')
    .optional()
    .isNumeric().withMessage('End time must be a number'),
  body('original_language')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Original language is too long'),
  handleValidationErrors
];

/**
 * Validation rules for deleting a case
 */
const deleteCaseValidation = [
  body('case_code')
    .trim()
    .notEmpty().withMessage('Case code is required')
    .isLength({ max: 50 }).withMessage('Case code is too long'),
  handleValidationErrors
];

/**
 * Validation rules for deleting a user
 */
const deleteUserValidation = [
  body('code')
    .trim()
    .notEmpty().withMessage('User code is required')
    .isLength({ max: 50 }).withMessage('User code is too long'),
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['stenographer', 'judge', 'admin'])
    .withMessage('Invalid role for deletion'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  loginValidation,
  registerUserValidation,
  addCaseValidation,
  updateCaseValidation,
  updateUserValidation,
  scheduleHearingValidation,
  editTranscriptValidation,
  saveTranscriptValidation,
  deleteCaseValidation,
  deleteUserValidation
};


