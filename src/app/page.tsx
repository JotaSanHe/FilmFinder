"use client";
import { useState } from "react";
import Image from "next/image"; 
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");

  const searchMovies = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${query}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error || "No se encontraron resultados");
      }
    } catch (err) {
      setError("Error al conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center text-sky-400">
        🎬 FilmFinder
      </h1>

      <form onSubmit={searchMovies} className="flex gap-4 mb-8 w-full max-w-lg">
        <input
          type="text"
          placeholder="Busca una película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-6 py-3 rounded-full text-black bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-colors">
          <span className="hidden md:inline">Buscar</span>
          <span className="md:hidden">🔍</span>
        </button>
      </form>

      {loading && <p className="text-sky-400 font-semibold text-lg">Buscando películas...</p>}
      {error && <p className="text-red-400 font-semibold text-lg">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-gray-800 p-4 rounded-xl shadow-lg border border-transparent hover:border-sky-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div className="w-full h-72 relative mb-3">
              <Image
                src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
                alt={movie.Title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h2 className="text-lg font-bold text-slate-100 mb-1 leading-tight">{movie.Title}</h2>
            <p className="text-sm text-gray-400 font-medium">{movie.Year}</p>
          </div>
        ))}
      </div>
    </main>
  );
}