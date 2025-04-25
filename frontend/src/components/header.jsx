
function Header() {

   return (
     <>
       <header class="w-full shadow-md p-4 flex justify-between items-center border-b">
            <button id="botonAside" class="md:hidden">
            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <rect y="5" width="20" height="2" rx="2" fill="gray"/>
                <rect y="11" width="20" height="2" rx="2" fill="gray"/>
                <rect y="17" width="20" height="2" rx="2" fill="gray"/>
            </svg>
            </button>
            
            <h1 class="text-2xl font-bold text-orange-600">Reddix</h1>
            <div class="w-full max-w-md">
            <input
                type="text"
                placeholder="Buscar..."
                class="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-100 focus:outline-none"
            />
            </div>

            <div>
            <a href="#">Get App</a>
            <a href="#">Log In</a>
            
            </div>
        </header>
     </>
   )
 }
 
 export default Header