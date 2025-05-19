import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

function Aside() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const button = document.getElementById('botonDesplegableAside');
    const toggle = () => setIsOpen(prev => !prev);
    
    if (button) {
      button.addEventListener('click', toggle);
    }
    return () => {
      if (button) {
        button.removeEventListener('click', toggle);
      }
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 w-80 h-[calc(100vh-4rem)] text-white overflow-y-auto no-scrollbar p-6 border-r border-[#3E4042] bg-[#14181a] 
          transform transition-transform duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <nav className="flex flex-col gap-2 border-b border-[#26282A] pb-2 mb-4">
          <p className="text-[#637d84]">TOPICS</p>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Games</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Internet Culture (Viral)</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Q&As</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Technology</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Pop Culture</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Movies & TV</a>
        </nav>
        <nav className="flex flex-col gap-2 border-b border-[#26282A] pb-2 mb-4">
          <p className="text-[#637d84]">RESOURCES</p>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">About Reddix</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Advertise</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Help</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Blog</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Careers</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Press</a>
        </nav>
        <nav className="flex flex-col gap-2">
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Communities</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Best of Reddix</a>
          <a href="#" className="hover:bg-[#1c2224] px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200">Topics</a>
        </nav>
      </aside>
    </>
  );
}

export default Aside;
