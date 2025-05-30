import Swal from 'sweetalert2';

function GetApp() {
  const popup = async () => {
    await Swal.fire({
      html: `<img src="https://www.redditstatic.com/shreddit/assets/download-app-persistent-qr-codex2.png" alt="QR Code" style="width:200px; height:auto; margin: auto auto;" />`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Download App',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#FF6600',
      cancelButtonColor: '#d33',
      background: '#1c1c1c',
      color: '#ffffff',
      customClass: {
        title: 'text-orange-500',
        content: 'text-gray-300',
        confirmButton: 'text-white border-none',
        cancelButton: 'text-white border-none',
      },
    });
  };

  return (
    <>
      <button onClick={popup} className="qr-button" aria-label="Get App">
        <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8 16h-3.7v-1.2h3.7v-3.7H16v3.7c0 .7-.5 1.2-1.2 1.2ZM9 7.8V5.2C9 4.5 8.5 4 7.8 4H5.2C4.5 4 4 4.5 4 5.2v2.5C4 8.5 4.5 9 5.2 9h2.5C8.5 9 9 8.5 9 7.8Zm-1.2 0H5.3V5.3h2.5v2.5Zm8.2 0V5.2c0-.7-.5-1.2-1.2-1.2h-2.5c-.8 0-1.3.5-1.3 1.2v2.5c0 .8.5 1.3 1.2 1.3h2.5c.8 0 1.3-.5 1.3-1.2Zm-1.2 0h-2.5V5.3h2.5v2.5Zm-5.8 7v-2.5c0-.8-.5-1.3-1.2-1.3H5.2c-.7 0-1.2.5-1.2 1.2v2.5c0 .8.5 1.3 1.2 1.3h2.5c.8 0 1.3-.5 1.3-1.2Zm-1.2 0H5.3v-2.5h2.5v2.5Zm-.8 3H2.6c-.2 0-.4-.2-.4-.4V13H1v4.4c0 .9.7 1.6 1.6 1.6H7v-1.2Zm12-.4V13h-1.2v4.4c0 .2-.2.4-.4.4H13V19h4.4c.9 0 1.6-.7 1.6-1.6Zm0-14.8c0-.9-.7-1.6-1.6-1.6H13v1.2h4.4c.2 0 .4.2.4.4V7H19V2.6Zm-16.8 0c0-.2.2-.4.4-.4H7V1H2.6C1.7 1 1 1.7 1 2.6V7h1.2V2.6Z"></path>
        </svg>
        Get App
      </button>
    </>
  );
}

export default GetApp;
