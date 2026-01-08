/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const Button = ({ label, backgroundColor, ...props }: any) => {
  return (
    <button 
      style={{ backgroundColor }} 
      className="bg-blue-500 text-white px-4 py-2 rounded" 
      {...props}
    >
      {label}
    </button>
  );
};

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Button',
  },
};
