import React from "react";
import { Modal, Button, message } from "antd";

const DeleteUser = ({ id, isOpen, onClose, refreshUsers }) => {
  const url = process.env.REACT_APP_API_URL;

  const handleDelete = async () => {
    try {
      const response = await fetch(`${url}/User?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      message.success("Përdoruesi u fshi me sukses!");
      onClose();
      refreshUsers();
    } catch (error) {
      message.error("Fshirja e përdoruesit dështoi!");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Modal
      title="Fshij Përdoruesin"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Anulo
        </Button>,
        <Button key="delete" type="primary" danger onClick={handleDelete}>
          Fshij
        </Button>,
      ]}
    >
      <p>A jeni i sigurt që dëshironi të fshini këtë përdorues?</p>
      <p>Kjo veprim nuk mund të kthehet pas.</p>
    </Modal>
  );
};

export default DeleteUser;
