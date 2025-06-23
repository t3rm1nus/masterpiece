// src/utils/migrationHelpers.js
// Helpers para migración de estado persistido de Zustand

/**
 * Migrador genérico para el store principal
 * @param {object} state - El estado persistido antiguo
 * @param {number} version - La versión desde la que migrar
 * @returns {object} - El nuevo estado migrado
 */
export function migrateAppStoreState(state, version) {
  // Ejemplo: migrar de v0 a v1 (añadir un campo nuevo)
  // if (version === 0) {
  //   return { ...state, nuevoCampo: valorPorDefecto };
  // }
  // Ejemplo: migrar de v1 a v2 (renombrar un campo)
  // if (version === 1) {
  //   const { oldField, ...rest } = state;
  //   return { ...rest, newField: oldField };
  // }
  return state;
}

/**
 * Puedes añadir más migradores para otros slices o stores aquí
 */
