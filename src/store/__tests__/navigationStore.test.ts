import { createNavigationSlice } from '../navigationStore';
describe('navigationStore', () => {
  let set: any;
  let get: any;
  let store: any;

  beforeEach(() => {
    let state: any = {};
    set = (fn: any) => { state = { ...state, ...(typeof fn === 'function' ? fn(state) : fn) }; store = state; };
    get = () => state;
    store = createNavigationSlice(set, get);
  });

  it('va a la home correctamente', () => {
    store.currentView = 'detail';
    store.selectedItem = { id: 1 };
    store.goHome();
    expect(store.currentView).toBe('home');
    expect(store.selectedItem).toBe(null);
  });

  it('resetea a la home', () => {
    store.currentView = 'detail';
    store.selectedItem = { id: 2 };
    store.resetToHome();
    expect(store.currentView).toBe('home');
    expect(store.selectedItem).toBe(null);
  });

  it('puede cambiar la vista', () => {
    store.setView('coffee');
    expect(store.currentView).toBe('coffee');
  });

  it('puede seleccionar un item', () => {
    store.setSelectedItem({ id: 3 });
    expect(store.selectedItem).toEqual({ id: 3 });
  });

  it('va al detalle de un item', () => {
    store.goToDetail({ id: 4, category: 'libros' });
    expect(store.currentView).toBe('detail');
    expect(store.selectedItem).toEqual({ id: 4, category: 'libros' });
  });

  it('va a la vista de donaciones', () => {
    store.goToCoffee();
    expect(store.currentView).toBe('coffee');
  });

  it('va a la vista de cómo descargar', () => {
    store.goToHowToDownload();
    expect(store.currentView).toBe('howToDownload');
  });
}); 