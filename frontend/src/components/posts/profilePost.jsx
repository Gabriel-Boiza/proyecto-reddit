import { Link } from 'react-router-dom';
import { Trash, ThumbsUp, ThumbsDown } from "lucide-react";
import axios from 'axios';
import { domain } from '../../context/domain';
import Swal from 'sweetalert2';

function ProfilePost({ post, onDelete }) {

    const deletePost = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Mostrar el popup de confirmación con estilo personalizado
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Este post será eliminado permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF6600',  // Naranja como color principal
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1c1c1c',  // Fondo oscuro
            color: '#ffffff', // Texto blanco
            customClass: {
                title: 'text-orange-500', // Título con color naranja
                content: 'text-gray-300', // Contenido en gris claro
                confirmButton: 'text-white border-none', // Botón de confirmación con texto blanco
                cancelButton: 'text-white border-none', // Botón de cancelación con texto blanco
            },
        });

        if (result.isConfirmed) {
            try {
                // Hacer la solicitud para eliminar el post
                await axios.delete(`${domain}deletePost`, {
                    data: { post_id: post._id },
                    withCredentials: true
                });

                // Llamar la función onDelete para actualizar el estado en el componente padre
                if (onDelete) onDelete(post._id);

                // Mostrar un mensaje de éxito
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'El post ha sido eliminado.',
                    icon: 'success',
                    background: '#1c1c1c',
                    color: '#ffffff',
                    confirmButtonColor: '#FF6600',
                    customClass: {
                        title: 'text-orange-500',
                        content: 'text-gray-300',
                        confirmButton: 'text-white border-none',
                    },
                });
            } catch (err) {
                // Manejar el error si algo sale mal
                console.error("Error deleting post:", err);
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el post.',
                    'error'
                );
            }
        }
    };

    return (
        <div key={post._id} className="mb-4">
            <div className="relative">
                <button
                    onClick={deletePost}
                    className="absolute right-4 top-4 gap-2 bg-[#2a3236] hover:bg-[#333D42] text-white font-bold px-2 py-2 rounded-2xl z-10"
                    aria-label="Delete Post"
                >
                    <Trash className="w-4 h-4" color="red" />
                </button>
                <Link
                    to={`/post/${post._id}`}
                    className="block rounded-md p-4 hover:bg-gray-800 w-[1200px] min-h-[200px] flex flex-col justify-between"
                    >
                    <div>
                        <img
                        src={`${domain}uploads/${post.file_url}` || "https://via.placeholder.com/150"}
                        alt={post.title}
                        className="w-18 h-18 rounded-md mb-2 float-left mr-2"
                        />
                        <h3 className="text-xl text-[#B7CAD4] font-semibold">{post.title}</h3>
                        <p className="text-gray-400">{post.description}</p>
                    </div>

                    <div className="mt-auto">
                        <div className="text-sm text-gray-500 mt-4">
                        <span>Posted at: {new Date(post.created_at).toLocaleString()}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 flex gap-4">
                        <span className="flex items-center gap-1 text-green-400">
                            <ThumbsUp size={16} />{post.votes?.upvotes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1 text-red-400">
                            <ThumbsDown size={16} />{post.votes?.downvotes?.length || 0}
                        </span>
                        </div>
                    </div>
                </Link>
            </div>
            <hr className="border-t border-gray-700 mt-6 mx-2" />

        </div>
    );
}

export default ProfilePost;
