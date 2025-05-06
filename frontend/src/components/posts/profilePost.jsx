import { Link } from 'react-router-dom';

function ProfilePost({ post }) {
    return (
        <div key={post._id} className="mb-4">
            {/* Separador arriba fuera del hover */}
            <div className="border-t border-gray-600 mb-4"></div>

            <Link to={`/post/${post._id}`} className="block rounded-md p-4 hover:bg-gray-800">
                <h3 className="text-xl text-[#B7CAD4] font-semibold">{post.title}</h3>
                <p className="text-gray-400">{post.description}</p>
                <div className="mt-3 text-sm text-gray-500">
                    <span>Posted at: {new Date(post.created_at).toLocaleString()}</span>
                </div>
            </Link>

        </div>
    );
}

export default ProfilePost;
