
import { Link } from 'react-router-dom';

const FloatingButton = ({ to, character }) => {
  return (
    <Link
      to={to}
      className="fixed bottom-2.5 right-2.5 flex items-center justify-center  w-12 h-12 rounded-full bg-blue-500 text-white text-2xl font-semibold hover:bg-blue-600 transition-colors duration-200"
    >
      {character}
    </Link>
  );
};

export default FloatingButton;
