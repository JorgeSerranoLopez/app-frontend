import React from 'react';
import { Box, Snowflake, Waves, Armchair, BedDouble } from 'lucide-react';

interface Props {
  type: 'box' | 'fridge' | 'washer' | 'sofa' | 'bed';
  className?: string;
}

export const FurnitureIcon: React.FC<Props> = ({ type, className }) => {
  switch (type) {
    case 'box': return <Box className={className} />;
    case 'fridge': return <Snowflake className={className} />;
    case 'washer': return <Waves className={className} />;
    case 'sofa': return <Armchair className={className} />;
    case 'bed': return <BedDouble className={className} />;
    default: return <Box className={className} />;
  }
};