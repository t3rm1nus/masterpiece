// src/utils/migrationHelpers.js
// Helpers para migración de estado persistido de Zustand

/**
 * Migrador genérico para el store principal
 * @param {object} state - El estado persistido antiguo
 * @param {number} version - La versión desde la que migrar
 * @returns {object} - El nuevo estado migrado
 */
export function migrateAppStoreState(state, version) {
  return state;
}

/**
 * Puedes añadir más migradores para otros slices o stores aquí
 */
