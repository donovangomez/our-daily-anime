import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import TitleTab from "~/components/TitleTab";

const animeDetails = ({ani, characters}) => {
  const router = useRouter();

  if (router.isFallback || !ani || !ani.data || !characters || !characters.data) {
    return (
      <div className="grid items-center">
        <h2 className="mb-4 text-2xl text-center">Getting Anime Data!</h2>
        <img src="/assets/yuru-camp.gif" />
      </div>
    );
  }

  console.log(ani.data);
  console.log(characters.data)

  return (
    <>
      <Head>
        <title>Mainichi | {ani.data.title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header
        className={`absolute top-0 z-10 flex w-screen flex-col items-center overflow-hidden
     bg-[image:var(--image-url)] bg-cover bg-no-repeat py-36`}
        style={{ backgroundImage: `url(${ani.data.images.webp.image_url})` }}
      >
        <div className="absolute left-0 top-0 h-full w-full bg-[url('/assets/texture.png')]"></div>
        <div className="absolute left-0 top-0 h-full w-full bg-black opacity-40"></div>
      </header>
      <section className="mx-auto mt-64 lg:mt-44 w-10/12 rounded-md">
        <div className="mt-10 bg-white  p-4 shadow-lg lg:grid lg:grid-cols-2">
          <div className="z-50  flex justify-center">
            <img src={ani.data.images.webp.image_url} alt={ani.data.title} className="-mt-12" />
          </div>
          <div className="lg:grid lg:place-items-start gap-4 sm:grid sm:place-items-center">
            <TitleTab title={ani.data.title} jpTitle={ani.data.title_japanese}/>
          </div>
        </div>
        <section className="mt-4 md:grid md:grid-cols-2 md:gap-2">
          <div className="bg-white p-4 shadow-lg">
            <ul>
              <li className="my-2">
                <p className="text-2xl text-zinc-900">Airing:</p>
                <p>{ani.data.status}</p>
              </li>
              <li className="my-2">
                <p className="text-2xl text-zinc-900">Broadcast:</p>
                <p>{ani.data.broadcast.string}</p>
              </li>
              <li>
                <a
                  href={ani.data.url}
                  className="text-pink-700  duration-75 hover:text-pink-500"
                  target="_blank"
                >
                MyanimeList
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-white my-4 p-4 shadow-lg">
            <h3 className="text-2xl text-zinc-900">Synopsis</h3>
            <p className="text-clip break-normal leading-6">{ani.data.synopsis}</p>
          </div>
        </section>
        <section className="w-3/6 my-4  bg-white p-4 shadow-lg">
          <h2 className="text-2xl text-zinc-900">Platforms for streaming:</h2>
          <>
            {ani.data.streaming.map((stream) => (
              <div key={stream.name}>
                <a
                  href={stream.url}
                  target="_blank"
                  className="text-pink-700  duration-75 hover:text-pink-500"
                >
                  {stream.name}
                </a>
              </div>
            ))}
          </>
        </section>
      </section>
    </>
  );
};

const getAnimeIds = async () => {
  const res = await fetch("https://api.jikan.moe/v4/seasons/2023/fall");
  const data = await res.json();
  return data.data; 
};

export const getStaticPaths = async () => {
  const animeIds = await getAnimeIds(); 

  // Generate paths for each anime ID
  const paths = animeIds.map((id) => ({ params: { id: id.toString() } }));

  return { paths, fallback: true };
};

export const getStaticProps = async ({ params }) => {
  try {
    const id = params.id;

    const [animeRes, charactersRes] = await Promise.all([
      fetch(`https://api.jikan.moe/v4/anime/${id}/full`),
      fetch(`https://api.jikan.moe/v4/anime/${id}/characters`),
    ]);

    const [animeData, charactersData] = await Promise.all([
      animeRes.json(),
      charactersRes.json(),
    ]);

    return {
      props: {
        ani: animeData,
        characters: charactersData,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log("Error fetching data!", error);
    return { notFound: true };
  }
};

export default animeDetails;
