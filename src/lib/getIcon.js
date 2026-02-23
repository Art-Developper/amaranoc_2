import { 
    Home, Pyramid, Warehouse, Waves, Trees, 
    Mountain, Flame, Palmtree, HandPlatter, 
    WandSparkles, PartyPopper, Rocket, 
    UtensilsCrossed, Video, CarFront 
} from "lucide-react";

const iconMap = {
    Home: Home,
    Pyramid: Pyramid,
    Warehouse: Warehouse,
    Waves: Waves,
    Trees: Trees,
    Mountain: Mountain,
    Flame: Flame,
    Palmtree: Palmtree,
    HandPlatter: HandPlatter,
    WandSparkles: WandSparkles,
    PartyPopper: PartyPopper,
    Rocket: Rocket,
    UtensilsCrossed: UtensilsCrossed,
    Video: Video,
    CarFront: CarFront
};

export const getIcon = (name, size = 28) => {
    const IconComponent = iconMap[name]; 
    return IconComponent ? <IconComponent size={size} /> : null;
};