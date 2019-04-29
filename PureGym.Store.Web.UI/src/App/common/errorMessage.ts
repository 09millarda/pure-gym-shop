import swal from "sweetalert";

function showErrorAlert(title: string, body: string): void {
  swal({
    icon: "error",
    title,
    text: body
  });
}

export default showErrorAlert;