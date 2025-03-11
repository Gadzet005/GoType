// components/pages/levels/current_level.tsx
import { useParams } from 'react-router-dom';

export const Level: React.FC = () => {
    const { levelId } = useParams<{ levelId: string }>();
    return <div>Level ID: {levelId}</div>;
};