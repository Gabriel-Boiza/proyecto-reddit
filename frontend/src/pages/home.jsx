import Header from "../layouts/header";
import Aside from "../layouts/aside";
import Post from "../components/posts/post"; // ✅ Importa tu componente nuevo

// Todo lo demás igual hasta el return...

function Home() {
  // const orderedPosts = groupPostsByWeek(posts); // 🔁 Puedes comentar esto de momento si no vas a usarlo

  return (
    <>
      <Header />
      <Aside />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Post /> {/* ✅ Solo renderizas el componente con datos hardcodeados */}
      </div>
    </>
  );
}

export default Home;
