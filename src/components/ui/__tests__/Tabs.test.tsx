import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../Tabs';

function Harness() {
  const [value, setValue] = useState('a');
  return (
    <Tabs
      label="Sample tabs"
      value={value}
      onChange={setValue}
      tabs={[
        { id: 'a', label: 'Alpha', content: <p>Alpha panel</p> },
        { id: 'b', label: 'Beta', content: <p>Beta panel</p> },
        { id: 'c', label: 'Gamma', content: <p>Gamma panel</p> },
      ]}
    />
  );
}

describe('Tabs', () => {
  it('exposes tab semantics and links the active panel', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Sample tabs' })).toBeInTheDocument();
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', alpha.id);
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('tabindex', '-1');
  });

  it('supports arrow, Home and End keys with wrap-around', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('tab', { name: 'Alpha' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveFocus();
    expect(screen.getByText('Beta panel')).toBeInTheDocument();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveFocus();
  });
});
