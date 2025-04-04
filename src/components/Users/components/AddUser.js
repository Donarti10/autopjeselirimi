import React, { useState, useEffect } from "react";
import { Drawer, Input, Button, Form, Select, message } from "antd";

const AddUserDrawer = ({ visible, onClose, refreshUsers }) => {
  const url = process.env.REACT_APP_API_URL;
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const response = await fetch(`${url}/Subjects/search`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        message.error("Failed to fetch subjects.");
        console.error("Error fetching subjects:", error);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [url]);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await fetch(`${url}/LocalUserRole`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        message.error("Failed to fetch roles.");
        console.error("Error fetching roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [url]);

  const onFinish = async (values) => {
    const payload = {
      id: 0,
      subject: values.subject || 0,
      key: null,
      roleID: values.roleID || 0,
      firstName: values.firstName || "",
      lastName: values.lastName || "",
      username: values.username || "",
      password: values.password || "",
      note: values.note || "",
    };

    try {
      const response = await fetch(`${url}/User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      message.success("User added successfully!");
      form.resetFields();
      if (onClose) onClose();
      if (refreshUsers) refreshUsers();
    } catch (error) {
      message.error("Failed to add user.");
      console.error("Error adding user:", error);
    }
  };

  return (
    <Drawer
      title="Shto Përdorues"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={600}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Subjekti"
          name="subject"
          rules={[{ required: true, message: "Zgjidh një subjekt!" }]}
        >
          <Select
            loading={loadingSubjects}
            placeholder="Zgjidh një subjekt"
            allowClear
          >
            {subjects.map((subject) => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Roli"
          name="roleID"
          rules={[{ required: true, message: "Zgjidh një rol!" }]}
        >
          <Select
            loading={loadingRoles}
            placeholder="Zgjidh një rol"
            allowClear
          >
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.role}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Çelësi" name="key">
          <Input placeholder="Vendos çelësin" />
        </Form.Item>
        <Form.Item label="Emri" name="firstName">
          <Input placeholder="Vendos emrin" />
        </Form.Item>
        <Form.Item label="Mbiemri" name="lastName">
          <Input placeholder="Vendos mbiemrin" />
        </Form.Item>
        <Form.Item label="Përdoruesi" name="username">
          <Input placeholder="Vendos emrin e përdoruesit" />
        </Form.Item>
        <Form.Item label="Fjalëkalimi" name="password">
          <Input.Password placeholder="Vendos fjalëkalimin" />
        </Form.Item>
        <Form.Item label="Shënim" name="note">
          <Input.TextArea placeholder="Vendos një shënim" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Shto Përdorues
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddUserDrawer;
