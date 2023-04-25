import React, { useContext } from "react";
import AnimeCard from "./AnimeCard";
import AnimeContext from "~/context/AnimeContext";
import WatchList from "./WatchList";

type AnimeProps = {
  anime: {
    mal_id: number;
    url: string;
    title: string;
    images: {
      jpg: string;
      webp: {
        image_url: string;
      };
    };
    genres: [
      {
        name: string;
        url: string;
      }
    ];
    broadcast: {
      day: string;
    };
  }[];
};

const AnimeList: React.FC<AnimeProps> = ({ anime }) => {
  const { watching } = useContext(AnimeContext);
  return (
    <section className="w-full border-2 border-blue-700">
      <div className="mx-auto w-11/12">
        <ul className="flex flex-wrap gap-4">
          {anime.map((ani) => (
            <AnimeCard ani={ani} />
          ))}
        </ul>
      </div>
      <WatchList />
    </section>
  );
};

export default AnimeList;
