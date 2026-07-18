import Swal from "sweetalert2";

export const toast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,

    customClass: {
      popup: "rounded",
    },
  });
};
