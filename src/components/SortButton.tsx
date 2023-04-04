import cn from 'classnames';

const SortButton = ({
  onClick,
  isActive,
  order,
}: {
  onClick: () => void;
  isActive: boolean;
  order: 'asc' | 'desc';
}) => {
  return (
    <button
      onClick={onClick}
      className={cn('border', 'rounded', 'px-1', 'text-xs', {
        'font-normal': !isActive,
        'bg-black dark:bg-white': isActive,
        'text-white dark:text-black': isActive,
      })}
    >
      Sort {isActive ? (order === 'asc' ? '▼' : '▲') : ''}
    </button>
  );
};

export default SortButton;
