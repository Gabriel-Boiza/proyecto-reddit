import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { domain } from "../context/domain";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debounceTimeout = useRef(null);
  const resultsRef = useRef(null); 

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value.trim() !== "") {
        fetchResults(value);
      } else {
        setResults([]);
      }
    }, 300);
  };

  const fetchResults = async (searchTerm) => {
    try {
      const response = await fetch(
        `${domain}searchPosts?query=${encodeURIComponent(searchTerm)}`,
        { credentials: "include" }
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center space-x-2 bg-[#2a3236] hover:bg-[#333D42] rounded-full px-4">
        <svg
          className="search-icon w-5 h-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="15"
          height="15"
        >
          <path d="M23.9 22.1l-5.5-5.5c1.3-1.8 2.1-4.1 2.1-6.6C20.5 5.6 15.5 0 10 0S-.5 5.6-.5 11.1c0 5.5 5 10.1 10.5 10.1 2.4 0 4.6-.8 6.4-2.2l5.5 5.5c.5.5 1.3.5 1.8 0 .5-.6.5-1.3 0-1.8zm-13.9-5.5c-3.3 0-5.9-2.6-5.9-5.9s2.6-5.9 5.9-5.9 5.9 2.6 5.9 5.9-2.6 5.9-5.9 5.9z" />
        </svg>
        <input
          type="text"
          placeholder="Search reddix"
          className="header-search-bar text-white bg-transparent focus:outline-none flex-grow"
          name="searchBar"
          value={query}
          onChange={handleInputChange}
        />
      </div>
  
      {query.trim() !== "" && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute left-0 top-full mt-1 w-full max-h-[200px] overflow-y-auto bg-[#2a3236] rounded-md p-2 text-white shadow-lg z-10"
        >
          {results.map((item, index) => (
            <div key={item._id}>
              {index > 0 && <hr className="my-2 border-[#3c474c]" />}
              <Link
                to={`/post/${item._id}`}
                className="block hover:bg-[#3c474c] p-2 rounded cursor-pointer flex justify-between"
              >
                <div>
                  <span className="text-sm text-gray-400">
                    {item.created_at
                      ? format(new Date(item.created_at), "d MMMM yyyy", { locale: es })
                      : ""}
                  </span>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
                <img
                  src={`${domain}uploads/${item.file_url}` || "https://via.placeholder.com/150"}
                  alt={item.title}
                  className="w-18 h-18 rounded-md ml-4"
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default SearchBar;