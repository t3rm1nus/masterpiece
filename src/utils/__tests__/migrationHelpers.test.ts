import { migrateAppStoreState } from '../migrationHelpers';

describe('migrateAppStoreState', () => {
  test('devuelve el estado original', () => {
    const state = { foo: 1 };
    expect(migrateAppStoreState(state, 1)).toEqual(state);
  });
}); 