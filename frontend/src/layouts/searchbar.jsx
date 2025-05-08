
function SearchBar() {

    return (
      <>
        <div className="w-full max-w-md flex items-center space-x-2 bg-[#2a3236] hover:bg-[#333D42] rounded-full">
              <svg
                className="search-icon w-5 h-5 text-white ml-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="15"
                height="15"
              >
                <path
                  d="M23.9 22.1l-5.5-5.5c1.3-1.8 2.1-4.1 2.1-6.6C20.5 5.6 15.5 0 10 0S-.5 5.6-.5 11.1c0 5.5 5 10.1 10.5 10.1 2.4 0 4.6-.8 6.4-2.2l5.5 5.5c.5.5 1.3.5 1.8 0 .5-.6.5-1.3 0-1.8zm-13.9-5.5c-3.3 0-5.9-2.6-5.9-5.9s2.6-5.9 5.9-5.9 5.9 2.6 5.9 5.9-2.6 5.9-5.9 5.9z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search reddix"
                className="header-search-bar text-white"
                name="searchBar"
              />
            </div>
      </>
    )
  }
  
  export default SearchBar
  