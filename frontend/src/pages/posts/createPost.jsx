import Header from "../../layouts/header";
import Aside from "../../layouts/aside";


function CreatePost() {

  return (
    <>
      <Header />
      <Aside />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <p>Create post</p>
        <select name="community">
          <option value="a">a</option>
          <option value="b">b</option>
        </select>
        <form action="#">

        </form>
      </div>
    </>
  );
}

export default CreatePost;