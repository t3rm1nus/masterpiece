import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { StorageMonitor } from '../StorageMonitor';
import * as safeStorageModule from '../../utils/safeStorage';

describe('StorageMonitor', () => {
  it('no renderiza si enabled es false', () => {
    const { container } = render(<StorageMonitor enabled={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza si enabled es true', () => {
    const { getByText } = render(<StorageMonitor enabled={true} />);
    expect(getByText(/Storage Monitor/i)).toBeInTheDocument();
  });

  it('al hacer click alterna el estado visible', () => {
    const { getByText, queryByText } = render(<StorageMonitor enabled={true} />);
    fireEvent.click(getByText(/Storage Monitor/i));
    expect(getByText(/Status:.*Active/i)).toBeInTheDocument();
    fireEvent.click(getByText(/Storage Monitor/i));
    expect(queryByText(/Status:.*Active/i)).toBeNull();
  });

  it('al hacer click en Clear Storage llama a safeStorage.clear', () => {
    const clearMock = jest.spyOn(safeStorageModule.safeStorage, 'clear').mockImplementation(() => false);
    const { getByText } = render(<StorageMonitor enabled={true} />);
    fireEvent.click(getByText(/Storage Monitor/i));
    fireEvent.click(getByText(/Clear Storage/i));
    expect(clearMock).toHaveBeenCalled();
    clearMock.mockRestore();
  });
}); 