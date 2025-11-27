/**
 * Logger Utility
 * Production-safe logging with automatic disabling in production
 */

const IS_PRODUCTION = window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('127.0.0.1') &&
                      !window.location.hostname.includes('.local');

export const logger = {
  log: (...args) => {
    if (!IS_PRODUCTION) {
      console.log(...args);
    }
  },
  
  warn: (...args) => {
    if (!IS_PRODUCTION) {
      console.warn(...args);
    }
  },
  
  error: (...args) => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  debug: (...args) => {
    if (!IS_PRODUCTION && window.DEBUG_MODE) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args) => {
    if (!IS_PRODUCTION) {
      console.info(...args);
    }
  }
};

/**
 * Enable debug mode in console:
 * window.DEBUG_MODE = true;
 */
