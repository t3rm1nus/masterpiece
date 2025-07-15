// Helpers para migración de estado persistido de Zustand

/**
 * Migrador genérico para el store principal
 */
export function migrateAppStoreState<T>(state: T, version: number): T {
  return state;
}

/**
 * Puedes añadir más migradores para otros slices o stores aquí
 */