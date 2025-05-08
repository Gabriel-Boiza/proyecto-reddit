import { Plus } from "lucide-react";

function Aside() {
  return (
    <>
      <div className="flex">
        <aside className="aside">
          <nav className="aside-nav">
            <p className="aside-title">TOPICS</p>
            <a href="#" className="aside-links">Games</a>
            <a href="#" className="aside-links">Internet Culture (Viral)</a>
            <a href="#" className="aside-links">Q&As</a>
            <a href="#" className="aside-links">Technology</a>
            <a href="#" className="aside-links">Pop Culture</a>
            <a href="#" className="aside-links">Movies & TV</a>
          </nav>
          <nav className="aside-nav">
            <p className="aside-title">COMMUNITIES</p>
            <a href="#" className="aside-links flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create a community</span>
            </a>
            <a href="#" className="aside-links">
              <img src="/communities/announcements.png" alt="announcements" className="w-6 rounded-full mr-2 float-left" />
              r/announcements
            </a>
            <a href="#" className="aside-links">
              <img src="/communities/Asi_va_Espana.png" alt="announcements" className="w-6 rounded-full mr-2 float-left" />
              r/Asi_va_Espana
            </a>
            <a href="#" className="aside-links">
              <img src="/communities/spain.jpg" alt="announcements" className="w-6 rounded-full mr-2 float-left" />
              r/spain
            </a>
          </nav>
          <nav className="aside-nav">
            <p className="aside-title">RESOURCES</p>
            <a href="#" className="aside-links">About Reddix</a>
            <a href="#" className="aside-links">Advertise</a>
            <a href="#" className="aside-links">Help</a>
            <a href="#" className="aside-links">Blog</a>
            <a href="#" className="aside-links">Careers</a>
            <a href="#" className="aside-links">Press</a>
          </nav>
          <nav className="aside-nav">
            <a href="#" className="aside-links">Communities</a>
            <a href="#" className="aside-links">Best of Reddix</a>
            <a href="#" className="aside-links">Topics</a>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default Aside;
