import { RamLocation } from '../../types/ramTypes';

export type LocationProps = {
  location: RamLocation;
};

export const Location = ({ location }: LocationProps) => {
  return (
    <div>
      <a href={`/location/${location.id}`}>{location.name}</a>
    </div>
  );
};
