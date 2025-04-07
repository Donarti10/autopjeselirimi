import React, { useState, useEffect } from "react";
import {
  Drawer,
  Input,
  Button,
  Form,
  Select,
  AutoComplete,
  message,
} from "antd";
import toast from "react-hot-toast";

const AddUserDrawer = ({ visible, onClose, refreshUsers }) => {
  const url = process.env.REACT_APP_API_URL;
  const [form] = Form.useForm();
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

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
        toast.error("Failed to fetch roles.");
        console.error("Error fetching roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [url]);

  const handleSubjectSearch = async (value) => {
    if (!value) {
      setSubjectOptions([]);
      return;
    }
    try {
      const response = await fetch(
        `${url}/Subjects/search?value=${encodeURIComponent(value)}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const options = data.map((subject) => ({
        value: subject.$ID.toString(),
        label: subject.Emertimi,
      }));
      setSubjectOptions(options);
    } catch (error) {
      toast.error("Failed to search subjects.");
      console.error("Error searching subjects:", error);
    }
  };

  const onFinish = async (values) => {
    const postData = {
      id: 0,
      subject: values.subject,
      key: values.key,
      roleID: values.roleID,
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      password: values.password,
      note: values.note,
    };
    try {
      const response = await fetch(`${url}/User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      toast.success("User added successfully!");
      form.resetFields();
      if (onClose) onClose();
      if (refreshUsers) refreshUsers();
    } catch (error) {
      toast.error("Failed to add user.");
      console.error("Error adding user:", error);
    }
  };

  return (
    <Drawer
      title="Shto Përdorues"
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Subjekti"
          name="subject"
          rules={[{ required: true, message: "Kërko një subjekt!" }]}
        >
          <AutoComplete
            placeholder="Kërko subjektin"
            options={subjectOptions}
            onSearch={handleSubjectSearch}
            value={subjectOptions?.Emertimi}
            filterOption={false}
            optionLabelProp="label"
          />
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
        <Form.Item
          label="Çelsi"
          name="key"
          rules={[{ required: true, message: "Vendos një Çels " }]}
        >
          <Input placeholder="Vendos një Çelsë" />
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
