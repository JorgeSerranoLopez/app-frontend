import React from 'react';
import { Box, Snowflake, Waves, Armchair, BedDouble, Lamp, Monitor, Utensils, DoorOpen, Bike, Tv, Zap } from 'lucide-react';

interface Props {
  type: 'box' | 'fridge' | 'washer' | 'sofa' | 'bed' | 'nightstand' | 'chair' | 'desk' | 'dining' | 'wardrobe' | 'bike' | 'tv' | 'microwave';
  className?: string;
}

export const FurnitureIcon: React.FC<Props> = ({ type, className }) => {
  switch (type) {
    case 'box': return <Box className={className} />;
    case 'fridge': return <Snowflake className={className} />;
    case 'washer': return <Waves className={className} />;
    case 'sofa': return <Armchair className={className} />;
    case 'bed': return <BedDouble className={className} />;
    case 'nightstand': return <Lamp className={className} />;
    case 'chair': return <Armchair className={className} />;
    case 'desk': return <Monitor className={className} />;
    case 'dining': return <Utensils className={className} />;
    case 'wardrobe': return <DoorOpen className={className} />;
    case 'bike': return <Bike className={className} />;
    case 'tv': return <Tv className={className} />;
    case 'microwave': return <Zap className={className} />;
    default: return <Box className={className} />;
  }
};