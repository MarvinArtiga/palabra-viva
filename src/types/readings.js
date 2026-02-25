/**
 * @typedef {Object} ReadingText
 * @property {string} reference
 * @property {string} title
 * @property {string} text
 * @property {string} [excerpt]
 */

/**
 * @typedef {Object} DailyReading
 * @property {string} date
 * @property {string} liturgicalName
 * @property {string} liturgicalTitle
 * @property {string} liturgicalColor
 * @property {ReadingText} gospel
 * @property {ReadingText} firstReading
 * @property {ReadingText} psalm
 * @property {ReadingText|null} secondReading
 */

/**
 * @typedef {Object} MonthReadings
 * @property {string} month
 * @property {DailyReading[]} days
 */

export {};
